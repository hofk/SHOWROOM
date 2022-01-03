//.............. build showroom ................

'use strict'

const pi = Math.PI;
const p2i = 2 * pi;
const sin = ( x ) => ( Math.sin(x) );
const cos = ( x ) => ( Math.cos(x) );
const tan = ( x ) => ( Math.tan(x) );
const sqrt = ( x ) => ( Math.sqrt(x) );
const atan2PI = ( x, y ) => ( Math.atan2( y, x ) < 0 ? Math.atan2( y, x )+ pi * 2 : Math.atan2( y, x ) );
const toRad = ( deg ) => ( deg * pi / 180 );
const getMatIndex = ( cp, i, idx, k ) => ( k < cp[ i ][ idx ].length ? cp[ i ][ idx ][ k ] : cp[ i ][ idx ][ cp[ i ][ idx ].length - 1 ] );
 
 
let xM, yM, zM, yB, yT, xMax, zMax, xMin, zMin, dx, dy, dy1, dy2, dz, len, corners;
let p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, p4x, p4y, p4z;
let p1xp, p1xm, p1zp, p1zm, p2xp, p2xm, p2zp, p2zm, p3xp, p3xm, p3zp, p3zm, p4xp, p4xm, p4zp, p4zm;
let radius, height, rX, rZ, rMax, taper, r, rs, hs, phi0, phi, phix, phiz, depth, indent, tSill, rSill, oSill, oSillx, oSillz;
let u, v, u1, v1, u2, v2, vb0, vb1, vb2, vo1, vo2, vt0, vt1, vt2, dv2; 
let mi, uvi, equIdx, maxIdx, wIdx, oIdx, idx, offs, partsIdx, sillIdx, sign;
let thick, equlev, equArr, uvArr;
let alpha, tilt, color, nRotation;
let parts, cx, cy, cz, cpx, cpz, pax, paz, pbx, pbz, pcx, pcz;
let wallType, wid, wid1, wid2, ex, ez, mb, mt, hb, hb1, hb2, ht, ht1, ht2, ho1, ho2, wallWidth, wallPosCount;
let openings, opnIdx, openingCount;
let soffitPosCount, archwayPosCount, frameClosed; ;
let matCount, matj, mNo, fMat, aMat, oMat;
let rwv, view;
let detailXZ, detailY, shell, shf;

let vt = []; // vertices
let uv = []; 

for ( let i = 0; i < m.length; i ++ ) {
	
	m[ i ].unshift( i )	// insert index at the front of the material definition, used for vt, uv  index 
	
	vt.push( [] );      //  vertices array for each material
	uv.push( [] );      //  uv's array for each material
	
}

// lighting
for ( let i = 0; i < lightings.length; i ++ ) { if ( lightings[i].length > 0 ) addLighting( i ); }

// floors
for ( let i = 0; i < floors.length; i ++ ) { if ( floors[i].length > 0 ) buildPlan( floors, i ); }

// ceilings
for ( let i = 0; i < ceilings.length; i ++ ) { if ( ceilings[i].length > 0 ) buildPlan( ceilings, i ); }

// walls
for ( let i = 0; i < walls.length; i ++ ) {
	
	wallOpnPos.push( [] ); // to ensure the correct wall index for wall openings
	wallOpnUVs.push( [] );
	
	if ( walls[i].length > 0 ) buildWall( i );
	
}

// soffits
for ( let i = 0; i < soffits.length; i ++ ) { if ( soffits[i].length > 0 ) buildSoffit( i ); }

// archways
for ( let i = 0; i < archways.length; i ++ ) { if ( archways[i].length > 0 ) buildArchaway( i ); }

// round walls
for ( let i = 0; i < roundWalls.length; i ++ ) { if ( roundWalls[i].length > 0 ) buildRoundWall( i ); }

// components
for ( let i = 0; i < components.length; i ++ ) { if ( components[i].length > 0 ) buildComponent( i ); }
 
// frames
for ( let i = 0; i < frames.length ; i ++ ) { if ( frames[i].length > 0 ) processFrames( i ); }

// mirrors
for ( let i = 0; i < mirrors.length; i ++ ) { if ( mirrors[i].length > 0 ) buildMirror( i ); }

// objects 3D
for ( let i = 0; i < objects3D.length; i ++ ) { if ( objects3D[i].length > 0 ) addObject3D( i ); }

// viewer
const viewer = new THREE.Object3D( );
addViewer( );

// .........................................................................................................

let geometries = [];
let meshes = [];

for ( let i = 0; i < m.length; i ++ ) {
	
	if ( vt[ i ].length > 0 ) { // only for defined materials, not for material Empty
	
		geometries[ i ] = new THREE.BufferGeometry();
		
		geometries[ i ].setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vt[ i ] ), 3 ) );
		geometries[ i ].setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uv[ i ] ), 2 ) );
		
		geometries[ i ].computeVertexNormals();
		
		meshes[ i ] = new THREE.Mesh( geometries[ i ], getMaterial( m[ i ] ) );
		scene.add( meshes[ i ] );
		
	} else {
		
		geometries[ i ] = null;
		meshes[ i ]  = null;
		
	}
	
}

//surrounding / Umgebung
for ( let i = 0; i < 6; i ++ ) {
	
	surrTex[ i ] = 'CubeMap/' + surroundingTexture[ i ]; 
	
}

scene.background = new THREE.CubeTextureLoader( ).load( surrTex );

// ...............................................................

function addLighting( i ) {	
	
	switch ( lightings[ i ][ 0 ] ) {
		
		case Ambient:
		
		lighting[ i ] = new THREE.AmbientLight( lightings[ i ][ 1 ], lightings[ i ][ 2 ] );
		scene.add( lighting[ i ] );
		break;
		
		case Point:
		
		lighting[ i ] = new THREE.PointLight( lightings[ i ][ 4 ], lightings[ i ][ 5 ], 100, 2 );
		lighting[ i ].position.set( lightings[ i ][ 1 ], lightings[ i ][ 3 ], lightings[ i ][ 2 ] ); // x,z,  y in showroomDesign.js
		scene.add( lighting[ i ] );
		break;
		
		case Spot:
		
		lighting[ i ] = new THREE.SpotLight( lightings[ i ][ 7 ], lightings[ i ][ 8 ], 0, toRad(lightings[ i ][ 9 ] ), lightings[ i ][ 8 ]  );
		lighting[ i ].position.set( lightings[ i ][ 1 ], lightings[ i ][ 3 ], lightings[ i ][ 2 ] );		// x,z,  y in showroomDesign.js
		lighting[ i ].target.position.set( lightings[ i ][ 4 ], lightings[ i ][ 6 ], lightings[ i ][ 5 ] );	// x,z,  y in showroomDesign.js
		scene.add( lighting[ i ].target );
		scene.add( lighting[ i ] );
		break;
		
		case LongLamp:
		
		lighting[ i ] = new THREE.PointLight( lightings[ i ][ 4 ], lightings[ i ][ 5 ], 100, 2 );
		lighting[ i ].position.set( lightings[ i ][ 1 ], lightings[ i ][ 3 ], lightings[ i ][ 2 ] ); // x,z,  y in showroomDesign.js
		
		const li1 = lighting[ i ].clone();
		li1.position.set( lightings[ i ][ 1 ] - 0.5, lightings[ i ][ 3 ], lightings[ i ][ 2 ] );
		const li2 = lighting[ i ].clone();
		li2.position.set( lightings[ i ][ 1 ] + 0.5, lightings[ i ][ 3 ], lightings[ i ][ 2 ] );
		
		const gLightFitting = new THREE.CylinderBufferGeometry( 0.1, 0.1, 2, 24, 1, false, 0, 3.3 );
		const lightFitting = new THREE.Mesh( gLightFitting, new THREE.MeshPhongMaterial( { color: 0xeeeeff, side: THREE.DoubleSide , transparent: true, opacity: 0.95 } ) );
		
		lightFitting.position.set( 0, -0.05 , 0 );
		lightFitting.rotation.z = 1.57;
		lighting[ i ].add( lightFitting );
		
		scene.add( lighting[ i ] );
		scene.add( li1 );
		scene.add( li2 );
		
		scene.add( new THREE.PointLightHelper( lighting[ i ], 0.05 ) );
		scene.add( new THREE.PointLightHelper( li1, 0.05 ) );
		scene.add( new THREE.PointLightHelper( li2, 0.05 ) );
		break;
	
	}
	
}

function buildPlan( plans, i ) {
	
	maxIdx = plans[ i ].length - 1;
	
	uvArr =  plans[ i ][ maxIdx ][ 1 ] === undefined || typeof plans[ i ][ maxIdx ][ 1 ] !== 'string';
	equArr = Array.isArray( plans[ i ][ maxIdx - ( uvArr ? 2 : 1 ) ] );
	
	mi = maxIdx - ( uvArr ? 1 : 0 );
	equIdx = mi - 1;
	uvi = maxIdx; // used as required to set uv's
	
	corners = ( plans[ i ].length - ( uvArr ? 2 : 1 ) - ( equArr ? 1 : 0 ) ) / ( equArr ? 2 : 3 );
	
 	pls = [];
	
	if ( equArr ) {
		
		for ( let j = 0; j < equIdx;  j += 2 ) {
			
			pls.push( plans[ i ][ j ], plans[ i ][ j + 1 ], plans[ i ][ equIdx ][ 0 ] );
			
		}
		
	} else {
		
		for ( let j = 0; j < mi;  j ++ ) {
			
			pls.push( plans[ i ][ j ] );
			
		}
		
	}
	
	xM = 0;
	yM = 0;
	zM = 0;
	
	for (  let c = 0, j = 0; c < corners; c ++, j += 3 ) {
		
		xM += pls[ j ];
		zM += pls[ j + 1 ];
		yM += pls[ j + 2 ]; // x,z, y 
		
	}
	
	xM = xM / corners;
	zM = zM / corners;
	yM = yM / corners; 
	
	offs  = vt[ plans[ i ][ mi ][ 0 ] ].length;		// offset is needed for uv calculation
	
	pushPlanPos( plans, i );
	pushPlanUV( plans, i );
	 
}

function buildWall( i ) {
	
	wls = []; // for uniform wall values
	
	equlev = Array.isArray( walls[ i ][ 6 ] ); //  last two coordinates are height levels
	
	if ( equlev ) {
		
		thick = walls[ i ][ 6 ][ 0 ] === wd ? true : false;
		openings =  walls[ i ][ 6 ][ 0 ] === wo ?  true : false;
		
		if ( thick || openings ) {
			
			depth = walls[ i ][ 6 ][ 1 ] !== undefined ? walls[ i ][ 6 ][ 1 ] : wallDepthDefault; // only used when thick
			opnIdx = 6;				// only used when openings
			mi = 7;	
			uvi = 8;
			
		} else {
			
			mi = 6;	
			uvi = 7;
			
		}
		
	} else {
		
		thick = walls[ i ][ 8 ][ 0 ] === wd ? true : false;
		openings = walls[ i ][ 8 ][ 0 ] === wo ? true : false;
		
		if ( thick || openings ) {
			
			depth = walls[ i ][ 8 ][ 1 ] !== undefined ? walls[ i ][ 8 ][ 1 ] : wallDepthDefault; // only used when thick
			opnIdx = 8;			 	// only used when openings
			mi = 9;
			uvi = 10 ;
			
		} else {
			
			mi = 8;	
			uvi = 9;
			
		}
		
	}
	
	//create uniform wall values
	
	wls.push( walls[ i ][ 0 ], walls[ i ][ 1 ] ); // x0,z0, start of wall
	
	if ( equlev ) {
		
		wls.push( walls[ i ][ 4 ], walls[ i ][ 5 ] ); // (y00,y01,) <-- y10,y11 (identical, equal level)
		wls.push( walls[ i ][ 2 ], walls[ i ][ 3 ], walls[ i ][ 4 ], walls[ i ][ 5 ] ); // x1,z1, y10,y11
		
	} else {
		
		wls.push( walls[ i ][ 2 ], walls[ i ][ 3 ], walls[ i ][ 4 ], walls[ i ][ 5 ], walls[ i ][ 6 ], walls[ i ][ 7 ] );
		
	}
	
	                // design
	p1x = wls[ 0 ]; // x0
	p1y = wls[ 2 ]; // y00
	p1z = wls[ 1 ]; // z0
	
	p2x = wls[ 0 ]; // x0
	p2y = wls[ 3 ]; // y01
	p2z = wls[ 1 ]; // z0
	
	p3x = wls[ 4 ]; // x1
	p3y = wls[ 6 ]; // y10 
	p3z = wls[ 5 ]; // z1
	
	p4x = wls[ 4 ]; // x1
	p4y = wls[ 7 ]; // y11
	p4z = wls[ 5 ]; // z1
	
	wallWidth = sqrt( ( p3x - p1x ) * ( p3x - p1x ) + ( p3z - p1z ) * ( p3z - p1z ) );
	
	mb = ( p3y - p1y ) / wallWidth;	
	mt = ( p4y - p2y ) / wallWidth;
	
	if ( !thick ) { //  surface of an outer wall
		
		wid = 0;
		
		if ( openings ) {
			
			openingCount = Math.trunc( ( walls[ i ][ opnIdx ].length - 1 ) / 4 ); // [ wo, 4 values each .. (, indent) ]
			
			indent = walls[ i ][ opnIdx ].length % 2 === 0  ? walls[ i ][ opnIdx ][ openingCount * 4 + 1 ] : wallIndentDefault;
			
			for ( let j = 1; j < openingCount * 4 + 1; j += 4 ) {
				
				wid1 = wid + walls[ i ][ opnIdx ][ j ];
				wid2 = wid1 + walls[ i ][ opnIdx ][ j + 1 ];
				
				if ( wid1 > wallWidth || wid2 > wallWidth  ) break;
				
				ho1 = p1y + walls[ i ][ opnIdx ][ j + 2 ];
				ho2 = ho1 + walls[ i ][ opnIdx ][ j + 3 ];
				
				hb1 = p1y + wid1 * mb;
				hb2 = p1y + wid2 * mb;
				ht1 = p2y + wid1 * mt;
				ht2 = p2y + wid2 * mt;
				
				wid = wid2;
				
			}
			
		}
		
		setWallPositions( i );
		 
		if ( uvi < walls[ i ].length ) {
			
			setWallUVs( i );
			
		} else {
			
			autoWallUVs( i );
			
		}
		
	} 
	
	if ( thick ) { // structural component, thick wall
		
		setThickWallPositions( i );	
		
		if ( uvi < walls[ i ].length ) {
			
			setThickWallUVs( i );
			
		} else {
			
			autoWallUVs( i );
			
		}
		
	}
	
}

function buildSoffit( i ) {
	
	// soffits defined in wall openings as  wall index, opening index, depth, mm[ ] (, parts)
	
	mNo = 0;
	depth = soffits[ i ][ 2 ];
	mi = 3;
	
	partsIdx = typeof soffits[ i ][ 4 ] === 'string' ? 4 : undefined;
	parts = partsIdx !== undefined ? soffits[ i ][ 4 ] : soffitPartsDefault;
	
	sillIdx = partsIdx === 4 ? 5 : 4;
	
	wIdx = soffits[ i ][ 0 ];
	oIdx = soffits[ i ][ 1 ] * 6;
	
	getOpeningPoints( );	// from wall
	
	len =  sqrt( ( p3x - p1x ) * ( p3x - p1x ) + ( p3z - p1z ) * ( p3z - p1z ) );
	dx = depth * ( p3z - p1z ) / len;
	dz = -depth * ( p3x - p1x ) / len;	
	
	tSill = 0; // if no sill,   NOTE! tSill even for 'l' 't'  
	
	if ( parts.indexOf( 's' ) !== -1 ) { // sill
		
		tSill = soffits[ i ][ sillIdx ] !== undefined ? soffits[ i ][ sillIdx ] : soffitSillThicknessDefault;
		oSill = soffits[ i ][ sillIdx + 1 ] !== undefined ? soffits[ i ][ sillIdx + 1 ] : soffitSillOverhangDefault;
		oSillx = oSill * ( p3z - p1z ) / len;
		oSillz = -oSill * ( p3x - p1x ) / len;
		
	}
	
	if ( parts.indexOf( 'l' ) !== -1 ) { // left
		
		setSidePositions( soffits, i, mi, mNo, 'left', p1x, p1y, p1z, p2x, p2y, p2z, 0, dx, dz, tSill, 0, 0, 0 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
	if ( parts.indexOf( 'r' ) !== -1 ) { // right
		
		setSidePositions( soffits, i, mi, mNo, 'right', p3x, p3y, p3z, p4x, p4y, p4z, 0, dx, dz, tSill, 0, 0, 0 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
	if ( parts.indexOf( 't' ) !== -1 ) { // top
		
		setSidePositions( soffits, i, mi, mNo, 'left', p2x, p2y, p2z, p4x, p4y, p4z, 0, dx, dz, 0, 0, 0, 0 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
	if ( parts.indexOf( 'b' ) !== -1 && parts.indexOf( 's' ) === -1 ) { // bottom but not sill
		
		setSidePositions( soffits, i, mi, mNo, 'right', p1x, p1y, p1z, p3x, p3y, p3z, 0, dx, dz, 0, 0, 0, 0 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
	}
 	
	if ( parts.indexOf( 's' ) !== -1 ) { // sill 
		
		// sill top
		
		setSidePositions( soffits, i, mi, mNo, 'right', p1x, p1y, p1z, p3x, p3y, p3z, 0, dx, dz, tSill, tSill, oSillx, oSillz );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
		// sill front ( no side positions! )
		
		const x1 = p1x - oSillx;
		const y1 = p1y;
		const z1 = p1z - oSillz;
		 
		const x2 = p3x - oSillx;
		const y2 = p3y;
		const z2 = p3z - oSillz;
		
		const x3 = p3x - oSillx;
		const y3 = p3y + tSill;
		const z3 = p3z - oSillz;
		
		const x4 = p1x - oSillx;
		const y4 = p1y + tSill;
		const z4 = p1z - oSillz;
		
		vt[ getMatIndex( soffits, i, mi, mNo ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3, x1,y1,z1, x3,y3,z3, x4,y4,z4 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
		// sill underside
		
		setSidePositions( soffits, i, mi, mNo, 'left', p1x, p1y, p1z, p3x, p3y, p3z, 0, 0, 0, 0, 0, oSillx, oSillz );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
		// sill left (overhang)
		
		rSill = p2y - p1y - tSill;
		setSidePositions( soffits, i, mi, mNo, 'left', p1x, p1y, p1z, p2x, p2y, p2z, rSill, -oSillx, -oSillz, 0, 0, 0, 0 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
		// sill right (overhang)
		
		setSidePositions( soffits, i, mi, mNo, 'right', p3x, p3y, p3z, p4x, p4y, p4z, rSill, -oSillx,- oSillz, 0, 0, 0, 0 );
		uv[ getMatIndex( soffits, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		
	}
 	
}

function buildArchaway( i ) {
	
	mNo = 0;
	
	if ( Array.isArray( archways[ i ][ 7 ] ) ) {	// archways defined as  x0,z0, x1,z1, y0,y1, depth, mm[ ] (, parts)
		
		depth = archways[ i ][ 6 ];
		mi = 7;
		
		partsIdx = typeof archways[ i ][ 8 ] === 'string' ? 8 : undefined;
		parts = partsIdx !== undefined ? archways[ i ][ 8 ] : archwayPartsDefault;
		 
		sillIdx = partsIdx === 8 ? 9 : 8;
		
		// left
		p1x = archways[ i ][ 0 ]; // x0
		p1y = archways[ i ][ 4 ]; // y0
		p1z = archways[ i ][ 1 ]; // z0
		
		p2x = archways[ i ][ 0 ]; // x0
		p2y = archways[ i ][ 5 ]; // y1
		p2z = archways[ i ][ 1 ]; // z0
		
		//right	
		p3x = archways[ i ][ 2 ]; // x1
		p3y = archways[ i ][ 4 ]; // y0 
		p3z = archways[ i ][ 3 ]; // z1
		
		p4x = archways[ i ][ 2 ]; // x1
		p4y = archways[ i ][ 5 ]; // y1
		p4z = archways[ i ][ 3 ]; // z1
	
	} else {	// archways defined in wall openings as  wall index, opening index, depth, mm[ ] (, parts)
		
		depth = archways[ i ][ 2 ];
		mi = 3;
		
		partsIdx = typeof archways[ i ][ 4 ] === 'string' ? 4 : undefined;
		parts = partsIdx !== undefined ? archways[ i ][ 4 ] : archwayPartsDefault;
		 
		sillIdx = partsIdx === 4 ? 5 : 4;
		
		wIdx = archways[ i ][ 0 ];
		oIdx = archways[ i ][ 1 ] * 6;
		
		getOpeningPoints( ); // from wall
		
	}
	
	len =  sqrt( ( p3x - p1x ) * ( p3x - p1x ) + ( p3z - p1z ) * ( p3z - p1z ) );
	radius = len / 2;
	
	dx = depth * ( p3z - p1z ) / len;
	dz = -depth * ( p3x - p1x ) / len;
	
	// parts 'fao'  front, arching, opposite  in function setArchawayPositions( .. )
		
	if (  parts.indexOf('f') !== -1 ) {
		
		fMat = mNo;
		mNo ++;
		
	}
	
	if (  parts.indexOf('a') !== -1 ) {
		
		aMat = mNo;
		mNo ++;
		
	}
	
	if (  parts.indexOf('o') !== -1 ) {	
		
		oMat = mNo;
		mNo ++;
		
	}
	
	cx = ( p2x + p4x ) / 2; // center
	cy = p2y - radius;
	cz = ( p2z + p4z ) / 2;
	
	// left	
	cpx = -( p3x - p1x ) / 2;
	cpz = -( p3z - p1z ) / 2;	
	setArchawayPositions( i, 'left', p2x, p2y, p2z );
	
	//right	
	cpx = ( p3x - p1x ) / 2;
	cpz = ( p3z - p1z ) / 2;
	setArchawayPositions( i, 'right', p4x, p4y, p4z );
	
	if ( Array.isArray( archways[ i ][ 7 ] ) ) { // archways defined as  x0,z0, x1,z1, y0,y1, depth, mm[ ] (, parts)
		
		 setArchawayUVs( i, 'left', 0, 0.5, 1, 1 );
		 setArchawayUVs( i, 'right', 0, 0.5, 1, 1 );
		
	} else { // archways  defined in wall openings as  wall index, opening index, depth, mm[ ] (, parts)
		
		wIdx = archways[ i ][ 0 ];
		oIdx = archways[ i ][ 1 ] * 4;
		
		u1 = wallOpnUVs[ wIdx ][ oIdx ];
		v1 = wallOpnUVs[ wIdx ][ oIdx + 1 ];
		
		u2 = wallOpnUVs[ wIdx ][ oIdx + 2 ];
		v2 = wallOpnUVs[ wIdx ][ oIdx + 3 ];
		
		setArchawayUVs( i, 'left' , u1, v1, u2, v2 );
		setArchawayUVs( i, 'right', u1, v1, u2, v2 );
		
	}
	
	tSill = 0; //  if no sill,    NOTE! tSill even for 'l' 't'
	
	if ( parts.indexOf( 's' ) !== -1 ) { // sill,
 		
		tSill = archways[ i ][ sillIdx ] !== undefined ? archways[ i ][ sillIdx ] : archwaySillThicknessDefault;
		oSill = archways[ i ][ sillIdx + 1 ] !== undefined ? archways[ i ][ sillIdx + 1 ] : archwaySillOverhangDefault;
		oSillx = oSill * ( p3z - p1z ) / len;
		oSillz = -oSill * ( p3x - p1x ) / len;
		
	}
	
	if ( parts.indexOf( 'l' ) !== -1 ) { // left
		
		setSidePositions( archways, i, mi, mNo, 'left', p1x, p1y, p1z, p2x, p2y, p2z, radius, dx, dz, tSill, 0, 0, 0 );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
	if ( parts.indexOf( 'r' ) !== -1 ) { // right
		
		setSidePositions( archways, i, mi, mNo, 'right', p3x, p3y, p3z, p4x, p4y, p4z, radius, dx, dz, tSill, 0, 0, 0 );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
	if ( parts.indexOf( 'b' ) !== -1 && parts.indexOf( 's' ) === -1 ) { // bottom but not sill
	
		setSidePositions( archways, i, mi, mNo, 'right', p1x, p1y, p1z, p3x, p3y, p3z, 0, dx, dz, 0, 0, 0, 0 );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
	if ( parts.indexOf( 's' ) !== -1 ) { // sill
		
		// sill top
		
		setSidePositions( archways, i, mi, mNo, 'right', p1x, p1y, p1z, p3x, p3y, p3z, 0, dx, dz, tSill, tSill, oSillx, oSillz );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
		// sill front  ( no side positions! )
		
		const x1 = p1x - oSillx;
		const y1 = p1y;
		const z1 = p1z - oSillz;
		 
		const x2 = p3x - oSillx;
		const y2 = p3y;
		const z2 = p3z - oSillz;
		
		const x3 = p3x - oSillx;
		const y3 = p3y + tSill;
		const z3 = p3z - oSillz;
	 	
		const x4 = p1x - oSillx;
		const y4 = p1y + tSill;
		const z4 = p1z - oSillz;
		
		vt[ getMatIndex( archways, i, mi, mNo ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3, x1,y1,z1, x3,y3,z3, x4,y4,z4 );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
		// sill underside
		
		setSidePositions( archways, i, mi, mNo, 'left', p1x, p1y, p1z, p3x, p3y, p3z, 0, 0, 0, 0, 0, oSillx, oSillz );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
		// sill left (overhang)
		
		rSill = p2y - p1y - tSill;
		setSidePositions( archways, i, mi, mNo, 'left', p1x, p1y, p1z, p2x, p2y, p2z, rSill, -oSillx, -oSillz, 0, 0, 0, 0 );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 );
		mNo ++;
		
		// sill right (overhang)
			
		setSidePositions( archways, i, mi, mNo, 'right', p3x, p3y, p3z, p4x, p4y, p4z, rSill, -oSillx,- oSillz, 0, 0, 0, 0 );
		uv[ getMatIndex( archways, i, mi, mNo ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
		mNo ++;
		
	}
	
}

function buildRoundWall( i ) {
	
	let x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4;
	let u1, v1, u2, v2, u3, v3, u4, v4;
	let dkPhi, dk1Phi, krs, krs1;
	
	xM = roundWalls[ i ][ 0 ];
	zM = roundWalls[ i ][ 1 ];
	yB = roundWalls[ i ][ 2 ];
	yT = roundWalls[ i ][ 3 ];
	r  = roundWalls[ i ][ 4 ];
	rs = roundWalls[ i ][ 5 ];
	phi0 = toRad( roundWalls[ i ][ 6 ] );
	phi = toRad( roundWalls[ i ][ 7 ] );
	mi = 8;
	
	rwv = roundWalls[ i ][ 9 ] !== undefined ? roundWalls[ i ][ 9 ] : roundWallViewDefault;
	view = rwv === 'c' ? 1 : 0;
	sign = view === 1 ? -1 : 1;
	
	for ( var k = 0; k < rs; k ++ ) {
		
		dkPhi =  k * phi / rs;
		dk1Phi = ( k + 1 ) * phi / rs;
		krs = k / rs;
		krs1 = ( k + 1 ) / rs;
		
		x1 = xM + r * sin( phi0 + dkPhi );
		y1 = yB; 
		z1 = zM + r * cos( phi0 + dkPhi );
		 
		x2 = xM + r * sin( phi0 + dk1Phi );
		y2 = yB; 
		z2 = zM + r * cos( phi0 + dk1Phi );
		 
		x3 = xM + r * sin( phi0 + dk1Phi );
		y3 = yT; 
		z3 = zM + r * cos( phi0 + dk1Phi );
		 
		x4 = xM + r * sin( phi0 + dkPhi );
		y4 = yT; 
		z4 = zM + r * cos( phi0 + dkPhi );
		
		if ( rwv === 'e' ) vt[ roundWalls[ i ][ mi ][ 0 ] ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3, x1,y1,z1, x3,y3,z3, x4,y4,z4 );
		if ( rwv === 'c' ) vt[ roundWalls[ i ][ mi ][ 0 ] ].push( x1,y1,z1, x3,y3,z3, x2,y2,z2,  x1,y1,z1, x4,y4,z4, x3,y3,z3 );
		
		u1 = view + sign * krs;
		v1 = 0;
		
		u2 = view + sign * krs1;
		v2 = 0;
		
		u3 = view + sign * krs1;
		v3 = 1; 
		
		u4 = view + sign * krs;
		v4 = 1;
		
		if ( rwv === 'e' ) uv[ roundWalls[ i ][ mi ][ 0 ] ].push( u1, v1, u2, v2, u3, v3,   u1, v1, u3, v3, u4, v4 );
		if ( rwv === 'c' ) uv[ roundWalls[ i ][ mi ][ 0 ] ].push( u1, v1, u3, v3, u2, v2,   u1, v1, u4, v4, u3, v3 );
		
	}
}

function buildComponent( i ) {
	
	let x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4;
	let u1, v1, u2, v2, u3, v3, u4, v4;
	let kPhi, k1Phi, bhhs, bh1hs, hhs, h1hs, krs, krs1;
	let offsB, offsT;
	
	shf = typeof components[ i ][ 8 ] === 'function';
	len = components[ i ].length;
	
	xM = components[ i ][ 0 ];
	zM = components[ i ][ 1 ];
	yB = components[ i ][ 2 ];
	yT = components[ i ][ 3 ];
	height = yT - yB;
	rs = components[ i ][ 4 ] < 3 ? 3 : components[ i ][ 4 ]; // detailXZ, radial segments
	hs = components[ i ][ 5 ] < 1 ? 1 : components[ i ][ 5 ]; // detailY, height segments
	r = components[ i ][ 6 ] / 2;
	mi = 7;
	shell = shf ? components[ i ][ 8 ] : dHdefault;
	phi0 = shf && len === 10 ? toRad( components[ i ][ 9 ] ) : ( !shf && len === 9 ? toRad( components[ i ][ 8 ] ) : componentRotationDefault );
	
	const uvf = rs === 4 ? 1.41 : ( rs === 8 ? 1.08 : ( rs === 12 ? 1.03 : 1 ) ); // uv adjustment factor
	
	for ( var h = 0; h < hs; h ++ ) {
		
		if ( h === 0 ){ offsB = vt[ components[ i ][ mi ][ 0 ] ].length; }
		if ( h === hs - 1 ) { offsT = vt[ components[ i ][ mi ][ 0 ] ].length; }
		
		bhhs = yB + h * height / hs;
		bh1hs = yB + ( h + 1 ) * height / hs;
		
		hhs = h / hs;
		h1hs = ( h + 1 ) / hs;
		
		for ( var k = 0; k < rs; k ++ ) {
			
			krs = k / rs;
			krs1 = ( k + 1 ) / rs;
			
			kPhi = phi0 + krs * p2i + p2i / rs / 2;
			k1Phi = phi0 + krs1 * p2i + p2i / rs / 2;
		 	
			x1 = xM + r * shell( hhs ) * sin( kPhi );
			y1 = bhhs; 
			z1 = zM + r * shell( hhs ) * cos( kPhi );
			
			x2 = xM + r * shell( hhs ) * sin( k1Phi );
			y2 = bhhs; 
			z2 = zM + r * shell( hhs ) * cos( k1Phi );
			
			x3 = xM + r * shell( h1hs ) * sin( k1Phi );
			y3 = bh1hs; 
			z3 = zM + r * shell( h1hs ) * cos( k1Phi );
			
			x4 = xM + r * shell( h1hs ) * sin( kPhi );
			y4 = bh1hs; 
			z4 = zM + r * shell( h1hs ) * cos( kPhi );
			
			vt[ components[ i ][ mi ][ 0 ] ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3, x1,y1,z1, x3,y3,z3, x4,y4,z4 );
			
			if( shf ) {  //   if not dHdefault only color as material
				
			 	uv[ components[ i ][ mi ][ 0 ] ].push( 0,0,  0,0,  0,0,  0,0,  0,0,  0,0 ); // 0 as placeholder
				
			} else {    //  dHdefault ==>  radius is constant 
				
				u1 = krs;
				v1 = hhs;
				u2 = krs1;
				v2 = hhs;
				u3 = krs1;
				v3 = h1hs;
				u4 = krs;
				v4 = h1hs;
				
				uv[ components[ i ][ mi ][ 0 ] ].push( u1, v1, u2, v2, u3, v3, u1, v1, u3, v3, u4, v4 );
			
		 	}
			
		}
		
		if ( h === 0  ) { // bottom
			
			for ( var k = 0; k < rs; k ++ ) {
				
				x1 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsB + k * 18 ];
				z1 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsB + k * 18 + 2 ];
				x2 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsB + k * 18 + 3 ];
				z2 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsB + k * 18 + 5 ];
				
				vt[ getMatIndex( components, i, mi, 2 ) ].push( xM,yB,zM, x2,yB,z2, x1,yB,z1 );
				
				kPhi =  k * p2i / rs  + p2i / rs / 2 ;
				k1Phi = ( k + 1 ) * p2i / rs +  p2i / rs / 2 ;
				
				u1 = 1 - 0.5 * ( 1 + uvf * sin( kPhi ) );
				v1 = 0.5 * ( 1 - uvf * cos( kPhi ) );
				
				u2 = 1 - 0.5 * ( 1 + uvf * sin( k1Phi ) );
				v2 = 0.5 * ( 1 - uvf * cos( k1Phi ) );
				
				uv[ getMatIndex( components, i, mi, 2 ) ].push( 0.5,0.5, u2, v2, u1, v1 ); 
				
			}
			
		}
		
		if ( h === hs - 1 ) { // top
			
			for ( var k = 0; k < rs; k ++ ) {
				
				x3 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsT + k * 18 + 12 ];
				z3 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsT + k * 18 + 14 ];
				x4 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsT + k * 18 + 15 ];
				z4 = vt[ getMatIndex( components, i, mi, 0 ) ][ offsT + k * 18 + 17 ];
				
				vt[ getMatIndex( components, i, mi, 1 ) ].push( xM,yT,zM, x4,yT,z4, x3,yT,z3 );
				
				kPhi =  k * p2i / rs  + p2i / rs / 2 ;
				k1Phi = ( k + 1 ) * p2i / rs +  p2i / rs / 2 ;
				
				u1 = 0.5 * ( 1 + uvf * sin( k1Phi ) );
				v1 = 0.5 * ( 1 - uvf * cos( k1Phi ) );
				
				u2 = 0.5 * ( 1 + uvf * sin( kPhi ) );
				v2 = 0.5 * ( 1 - uvf * cos( kPhi ) );
				
				uv[ getMatIndex( components, i, mi, 1 ) ].push( 0.5,0.5, u2, v2, u1, v1 );
				
			}
			
		}
		
	}
	
}

function buildMirror( i ) {
	
	let x, y, z;
	
	tilt = mirrorTiltDefault;
	color = mirrorColorDefault;
	
	const type = mirrors[ i ][ 0 ];
	
	const p1 = mirrors[ i ][ 1 ];
	const p2 = mirrors[ i ][ 2 ];
	const p3 = mirrors[ i ][ 3 ];
	const p4 = mirrors[ i ][ 4 ];
	const p5 = mirrors[ i ][ 5 ];
	const p6 = mirrors[ i ][ 6 ];
	
	const mirrorMat = ( color ) => ( { textureWidth: window.innerWidth * window.devicePixelRatio,
			textureHeight: window.innerHeight * window.devicePixelRatio,
			color: color,
			recursion: 1 } );
	
	if ( mirrors[ i ].length > 7 ) {
		
		if ( Array.isArray( mirrors[ i ][ 7 ] ) ) {
			
			if ( mirrors[ i ][ 7 ][ 0 ] === ti ) tilt = toRad( mirrors[ i ][ 7 ][ 1 ] );
			
		} else {
			
			color = mirrors[ i ][ 7 ];
			
		}
		
		if ( mirrors[ i ][ 8 ]  !== undefined ) color = mirrors[ i ][ 8 ];
		
	}
	
	switch ( type ) {
		
		case Rectangle:
		reflectors[ i ] = new THREE.Reflector( new THREE.PlaneBufferGeometry( p4, p5 ), mirrorMat( color ) );
		reflectors[ i ].rotateY( toRad( p6 ) );
		reflectors[ i ].position.set( p1, p3, p2 );
		break;
		
		case Polygon:
		
		nRotation = toRad( ( p5 - Math.trunc( p5 ) ) * 1000 );
		reflectors[ i ] = new THREE.Reflector( new THREE.CircleBufferGeometry( p4, Math.trunc( p5 ), nRotation ), mirrorMat( color ) );
		reflectors[ i ].rotateY( toRad( p6 ) );
		reflectors[ i ].position.set( p1, p3, p2 );
		break;
		
		case WallRectangle:
		
		reflectors[ i ] = new THREE.Reflector( new THREE.PlaneBufferGeometry( p4, p5 ), mirrorMat( color ) );
		
		equlev = Array.isArray( walls[ p1 ][ 6 ] );
		
		dx = equlev ? walls[ p1 ][ 2 ] - walls[ p1 ][ 0 ] : walls[ p1 ][ 4 ] - walls[ p1 ][ 0 ];
		dz = equlev ? walls[ p1 ][ 3 ] - walls[ p1 ][ 1 ] : walls[ p1 ][ 5 ] - walls[ p1 ][ 0 ];
		
		phi = atan2PI( dx, dz );
		
		x = walls[ p1 ][ 0 ] + ( p2 + p4 / 2 ) * cos( phi ) - p6 * sin( phi ); 
		z = walls[ p1 ][ 1 ] + ( p2 + p4 / 2 ) * sin( phi ) + p6 * cos( phi );
		
		y = walls[ p1 ][ equlev ? 4 : 2 ] + p3 + p5 / 2;
		
		reflectors[ i ].rotateY( -phi );
		reflectors[ i ].position.set( x, y, z );
		break;
		
		case WallPolygon:
		
		nRotation = toRad( ( p5 - Math.trunc( p5 ) ) * 1000 );
		reflectors[ i ] = new THREE.Reflector( new THREE.CircleBufferGeometry( p4, Math.trunc( p5 ), nRotation ), mirrorMat( color ) );
		
		equlev = Array.isArray( walls[ p1 ][ 6 ] );
		
		dx = equlev ? walls[ p1 ][ 2 ] - walls[ p1 ][ 0 ] : walls[ p1 ][ 4 ] - walls[ p1 ][ 0 ];
		dz = equlev ? walls[ p1 ][ 3 ] - walls[ p1 ][ 1 ] : walls[ p1 ][ 5 ] - walls[ p1 ][ 0 ];
		
		phi = atan2PI( dx, dz );
		
		x = walls[ p1 ][ 0 ] + ( p2 + p4 ) * cos( phi ) - p6 * sin( phi ); 
		z = walls[ p1 ][ 1 ] + ( p2 + p4 ) * sin( phi ) + p6 * cos( phi );
		
		y = walls[ p1 ][ equlev ? 4 : 2 ] + p3 + p4;
		
		reflectors[ i ].rotateY( -phi );
		reflectors[ i ].position.set( x, y, z );
		break;
		
	}
	
	if ( tilt !== 0 ) reflectors[ i ].rotateOnAxis ( new THREE.Vector3( 1,0,0), tilt );
	
	scene.add( reflectors[ i ] );
	
}

function processFrames( i ) {
	
	let x, y, z, x0, y0, z0;
	
	const fid = frames[ i ][ 0 ];
	
	mi = Array.isArray( frames[ i ][ 5 ] ) ? 5 : ( Array.isArray( frames[ i ][ 4 ] ) ? 4 : 3 );
	
	
	for ( let j = 0; j < frmuvs[ fid ].length; j ++ ) {
		
		for ( let k = 0; k < frmuvs[ fid ][ j ].length; k ++ ) {
			
			uv[ getMatIndex( frames, i, mi, j ) ].push( frmuvs[ fid ][ j ][ k ] );
			
		}
		
	}
	
	// scaling x,z, y
	const scx = frames[ i ][ mi + 1 ] !== undefined ? frames[ i ][ mi + 1 ] : frameXscaleDefault;
	const scz = frames[ i ][ mi + 2 ] !== undefined ? frames[ i ][ mi + 2 ] : frameZscaleDefault;
	
	const scy = frames[ i ][ mi + 3 ] !== undefined ? frames[ i ][ mi + 3 ] : frameYscaleDefault;
	
	if ( mi === 5 ) { // variant (a)	explicit positioning
		
		phi = toRad( frames[ i ][ 4 ] ); // rotation y 
	  	
		for ( let j = 0; j < frmpos[ fid ].length; j ++ ) {
			
			for ( let k = 0; k < frmpos[ fid ][ j ].length; k += 3 ) {
 				
				x0 = scx * frmpos[ fid ][ j ][ k ];
				y0 = scy * frmpos[ fid ][ j ][ k + 1 ];
				z0 = scz * frmpos[ fid ][ j ][ k + 2 ];
				
				x = x0 * cos( phi ) - z0 * sin( phi ) + frames[ i ][ 1 ];
				y = y0 + frames[ i ][ 3 ];
				z = x0 * sin( phi ) + z0 * cos( phi ) + frames[ i ][ 2 ];
				
				vt[ getMatIndex( frames, i, mi, j ) ].push( x, y, z );
				
			}
			
		}
		
	}
	
	if ( mi === 4 || mi === 3 ) { // variant (b) position defined by wall openings
		
		indent = Array.isArray( frames[ i ][ 4 ] ) ? frames[ i ][ 3 ] : frameIndentDefault;
		
		wIdx = frames[ i ][ 1 ];
		oIdx = frames[ i ][ 2 ] * 6;
		
		getOpeningPoints( ); // from wall
		
		len =  sqrt( ( p3x - p1x ) * ( p3x - p1x ) + ( p3z - p1z ) * ( p3z - p1z ) );
		dx = indent * ( p3z - p1z ) / len;
		dz = -indent * ( p3x - p1x ) / len;
		
		// center
		cx = ( p1x + p3x ) / 2;
		cy = ( p1y + p2y ) / 2;
		cz = ( p1z + p3z ) / 2;
		
		phi = -atan2PI( (p3x - p1x ), -( p3z - p1z ) );
		
		for ( let j = 0; j < frmpos[ fid ].length; j ++ ) {
			
			for ( let k = 0; k < frmpos[ fid ][ j ].length; k += 3 ) {
 				
				x0 = scx * frmpos[ fid ][ j ][ k ];
				y0 = scy * frmpos[ fid ][ j ][ k + 1 ];
				z0 = scz * frmpos[ fid ][ j ][ k + 2 ];
				
				x = x0 * cos( phi ) - z0 * sin( phi ) + cx + dx;
				y = y0 + cy;
				z = x0 * sin( phi ) + z0 * cos( phi ) + cz + dz;
				
				vt[ getMatIndex( frames, i, mi, j ) ].push( x, y, z );
				
			}
			
		}
		
	}
	
}

function addObject3D( i ) {
	
	const type      = objects3D[ i ][ 0 ];
	const name      = objects3D[ i ][ 1 ];
	
	// x,z,  y  order in the design
	const xScale    = objects3D[ i ][ 2 ];
	const yScale    = objects3D[ i ][ 4 ];
	const zScale    = objects3D[ i ][ 3 ];
	
	let xPosition = objects3D[ i ][ 5 ];
	let yPosition = objects3D[ i ][ 7 ];
	let zPosition = objects3D[ i ][ 6 ]; 
	
	let xRotation = toRad( objects3D[ i ][ 8 ] );
	let yRotation = toRad( objects3D[ i ][ 10 ] );
	let zRotation = toRad( objects3D[ i ][ 9 ] );
	
	if ( type === Gltf ) addObjectGLTF( );
	if ( type === Obj )  addObjectOBJ( );
	
	//---- detail functions ----
	
	function addObjectGLTF( ) {
		
		const loader = new THREE.GLTFLoader( );
		loader.load( 'objects3D/' + name + '/' + name + '.' + type, processGltf );
		
	}
	
	function processGltf( gltf ) {
		
		const box = new THREE.Box3( ).setFromObject( gltf.scene );
		const c = box.getCenter( new THREE.Vector3( ) );
		const size = box.getSize( new THREE.Vector3( ) );
		
		phi = new THREE.Vector3( 0, atan2PI( c.x, -c.z ), 0 ); //  around y 
		
		gltf.scene.rotation.set( xRotation, yRotation, zRotation );
		
		// rotate center
		const cz = c.z * cos( yRotation ) - c.x * sin( yRotation );
		const cx = c.z * sin( yRotation ) + c.x * cos( yRotation );
		
		gltf.scene.position.set( xPosition - cx, yPosition + size.y / 2 - c.y, zPosition - cz );
		
		gltf.scene.scale.set( xScale, yScale, zScale );
		
		scene.add( gltf.scene );
		
	}
	
	function addObjectOBJ( ) {
		
		new THREE.MTLLoader( ).load( 'objects3D/' + name + '/' + name + '.mtl', function ( materials ) {
			
			materials.preload( );
			
			const objLoader = new THREE.OBJLoader( ).setMaterials( materials );
			
			objLoader.load( 'objects3D/' + name + '/' + name + '.' + type, processObj );
			
		} );
		
	}
	
	function processObj( obj ) {
		
		obj.scale.set( xScale, yScale, zScale );
		obj.position.set( xPosition, yPosition, zPosition );
		obj.rotation.set( xRotation, yRotation, zRotation );
		
		scene.add( obj );
			
	} 
	
}

function addViewer( ) {
	
	const viewer = new THREE.Object3D( );
	const loader = new THREE.GLTFLoader( );
	loader.load( 'objects3D/' + visitor[ 0 ] + '/' + visitor[ 0 ] + '.gltf', processViewer );
	eyes.position.set( visitor[ 5 ], visitor[ 4 ], visitor[ 6 ] );
	eyes.rotation.y = toRad( visitor[ 7 ] );
	
	function processViewer( gltf ) {
		
		const box = new THREE.Box3( ).setFromObject( gltf.scene );
		const c = box.getCenter( new THREE.Vector3( ) );
		const size = box.getSize( new THREE.Vector3( ) );
		
		gltf.scene.position.set( -c.x, size.y / 2 - c.y - visitor[ 4 ], -c.z - size.z );
		
		gltf.scene.scale.set( visitor[ 1 ], visitor[ 3 ], visitor[ 2 ] ); // x,z, y order in definition
		
		viewer.add( gltf.scene );
		
		viewer.rotation.y = pi;
		eyes.add( viewer );
		
	}
	
}

// ......  detail functions  ......

function getMaterial( mi ) {
	
	let tex;
	let mType;
	let video;
	let side = Front;
	let opacity = 1;
	let wrap = [];
	
	mType = mi[ 1 ]; //  NOTE! [ 0 ] is index inserted by code => all indices + 1
	
	switch ( mType ) {
		
		// case Empty: //  there aren't any faces 
		 
		case Wireframe:
			
			if ( mi[ 3 ] !== undefined )  side = mi[ 3 ][ 0 ];
			return new THREE.MeshBasicMaterial( { color: mi[ 2 ], side: side, wireframe: true } );
			break;
			
		case Basic:
			
			if ( mi[ 3 ] !== undefined && Array.isArray( mi[ 3 ] ) ) side = mi[ 3 ][ 0 ];
			if ( mi[ 3 ] !== undefined && !Array.isArray( mi[ 3 ] ) ) opacity = mi[ 3 ];
			if ( mi[ 4 ] !== undefined ) opacity = mi[ 4 ];
			return new THREE.MeshBasicMaterial( { color: mi[ 2 ], side: side, transparent: true, opacity: opacity } );
			break;
			
		case Phong:
			
			if ( mi[ 3 ] !== undefined && Array.isArray( mi[ 3 ] ) ) side = mi[ 3 ][ 0 ];
			if ( mi[ 3 ] !== undefined && !Array.isArray( mi[ 3 ] ) ) opacity = mi[ 3 ];
			if ( mi[ 4 ] !== undefined ) opacity = mi[ 4 ];	
			return new THREE.MeshPhongMaterial( { color: mi[ 2 ], side: side, transparent: true, opacity: opacity } );
			break;
			
		case Lambert:
			
			if ( mi[ 3 ] !== undefined && Array.isArray( mi[ 3 ] ) ) side = mi[ 3 ][ 0 ];
			if ( mi[ 3 ] !== undefined && !Array.isArray( mi[ 3 ] ) ) opacity = mi[ 3 ];
			if ( mi[ 4 ] !== undefined ) opacity = mi[ 4 ];	
			return new THREE.MeshLambertMaterial( { color: mi[ 2 ], side: side, transparent: true, opacity: opacity } );
			break;
			
		case Texture:
			
			tex = new THREE.TextureLoader().load( 'textures/' + mi[ 2 ] );
			
			if ( mi[ 3 ] !== undefined && Array.isArray( mi[ 3 ] ) && mi[ 3 ][ 1 ] === undefined ) side = mi[ 3 ][ 0 ];
			if ( mi[ 3 ] !== undefined && Array.isArray( mi[ 3 ] ) && mi[ 3 ][ 1 ] !== undefined ) wrap = mi[ 3 ];
		 	if ( mi[ 3 ] !== undefined && !Array.isArray( mi[ 3 ] ) ) opacity = mi[ 3 ];
			
			if ( mi[ 4 ] !== undefined && Array.isArray( mi[ 4 ] ) )  wrap = mi[ 4 ];
		 	if ( mi[ 4 ] !== undefined && !Array.isArray( mi[ 4 ] ) ) opacity = mi[ 4 ];
			
		 	if ( mi[ 5 ] !== undefined ) opacity = mi[ 5 ];
			
			if ( wrap.length === 2 ) {
				
				tex.wrapS = THREE.RepeatWrapping;
				tex.wrapT = THREE.RepeatWrapping;
				tex.repeat.set( wrap[ 0 ], wrap[ 1 ] );
				
			}
	 		
			return  new THREE.MeshPhongMaterial( { map: tex, side: side, transparent: true, opacity: opacity } );
			break;
			
		case Video:
			
			if ( mi[ 3 ] !== undefined )  side = mi[ 3 ][ 0 ];
			
			video = document.createElement('video');
			video.src = 'textures/' + mi[ 2 ] ; //'textures/Raindrops_Videvo.mp4';  // free  https://www.videvo.net/video/raindrops-in-super-slow-motion/3313/
			//video.type = 'video/mp4';	
			//video.codecs = 'avc1.42E01E, mp4a.40.2';
			//video.controls = false;
			video.autoplay = true;   // video.play();
			video.loop = true;
			video.setAttribute('id','video' );
			video.style.display = 'none';
			document.body.appendChild( video );
			tex = new THREE.VideoTexture( video );
			tex.minFilter = THREE.LinearFilter;
			tex.magFilter = THREE.LinearFilter;
			tex.format = THREE.RGBFormat;
			return new THREE.MeshPhongMaterial( { map: tex, side: side } );
			break;
			
	}
	
}

function pushPlanPos( plans, i ) {
	
	xMin = Infinity;
	zMin = Infinity;
	xMax = -Infinity;
	zMax = -Infinity;
	
	for ( let c = 0; c < corners; c ++ ) {
		
		p1x = pls[ c * 3 ];
		p1y = pls[ c * 3 + 2 ];  // x,y,z <-- x,z,  y
		p1z = pls[ c * 3 + 1 ];
		
		p2x = pls[ ( c + 1 ) % corners * 3 ];
		p2y = pls[ ( c + 1 ) % corners * 3 + 2 ];  // x,y,z <-- x,z,
		p2z = pls[ ( c + 1 ) % corners * 3 + 1 ];
		
		if ( plans === floors )   vt[ plans[ i ][ mi ][ 0 ] ].push( xM, yM, zM, p2x, p2y, p2z, p1x, p1y, p1z );
		if ( plans === ceilings ) vt[ plans[ i ][ mi ][ 0 ] ].push( xM, yM, zM, p1x, p1y, p1z, p2x, p2y, p2z );
		
		if ( p1x < xMin ) xMin = p1x;
		if ( p1z < zMin ) zMin = p1z;
		
		if ( p1x > xMax ) xMax = p1x;
		if ( p1z > zMax ) zMax = p1z;
		
	}
	
}	

function pushPlanUV( plans, i )  {
	
	if ( uvArr ) { // setPlanUVs
		
		u = 0;
		v = 0;
		
		for (  let c = 0, j = 0; c < corners; c ++, j += 2 ) { 
			
			u += plans[ i ][ uvi ][ j ];
			v += plans[ i ][ uvi ][ j + 1 ];
			
		}
		
		u = u / corners;  // center point
		v = v / corners;
		
		for ( let c = 0; c < corners; c ++  ) {
			
			u1 = plans[ i ][ uvi ][ c * 2 ];
			v1 = plans[ i ][ uvi ][ c * 2 + 1 ];
			u2 = plans[ i ][ uvi ][ ( c + 1 ) % corners * 2 ];
			v2 = plans[ i ][ uvi ][ ( c + 1 ) % corners * 2 + 1 ];
			
			if ( plans === floors )    uv[ plans[ i ][ mi ][ 0 ] ].push( u, v, u2, v2, u1, v1 );
			if ( plans === ceilings )  uv[ plans[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
		}
		
	} else { // autoPlanUVs
		
		dx = xMax - xMin;
		dz = zMax - zMin;
		
		if ( plans === floors )	{
			
			u = ( xM - xMin ) / dx;
			v = ( zMax - zM ) / dz;
			
			for ( let c = 0, p = 0; c < corners; c ++, p += 9 ) {
				
				p1x = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 3 ];
				p1z = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 5 ];
				p2x = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 6 ];
				p2z = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 8 ];
				
				u1 = ( p1x - xMin ) / dx;
				v1 = ( zMax - p1z ) / dz;
				u2 = ( p2x - xMin ) / dx;
				v2 = ( zMax - p2z ) / dz;
				
				uv[ plans[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
				
			}
			
		} else {	//  plans === ceilings
			
			u = ( xMax - xM ) / dx;
			v = ( zMax - zM ) / dz;
			
			for ( let c = 0, p = 0; c < corners; c ++, p += 9 ) {
				
				p1x = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 3 ];
				p1z = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 5 ];
				p2x = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 6 ];
				p2z = vt[ plans[ i ][ mi ][ 0 ] ][ offs + p + 8 ];
				
				u1 = ( xMax - p1x ) / dx;
				v1 = ( zMax - p1z ) / dz;
				u2 = ( xMax - p2x ) / dx;
				v2 = ( zMax - p2z ) / dz;
				
				uv[ plans[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
				
			}
			
		}
		
	}
	
}

function getOpeningPoints( ) {
	
	// left                               // from wall opening
	p1x = wallOpnPos[ wIdx ][ oIdx ];     // x0 pbx
	p1y = wallOpnPos[ wIdx ][ oIdx + 1 ];	// y0 ho1
	p1z = wallOpnPos[ wIdx ][ oIdx + 2 ]; // z0 pbz
	
	p2x = wallOpnPos[ wIdx ][ oIdx ];     // x0 pbx
	p2y = wallOpnPos[ wIdx ][ oIdx + 4 ]; // y1 ho2
	p2z = wallOpnPos[ wIdx ][ oIdx + 2 ]; // z0 pbz
	
	// right
	p3x = wallOpnPos[ wIdx ][ oIdx + 3 ]; // x1 pcx
	p3y = wallOpnPos[ wIdx ][ oIdx + 1 ]; // y0 ho1
	p3z = wallOpnPos[ wIdx ][ oIdx + 5 ]; // z1 pcz
	
	p4x = wallOpnPos[ wIdx ][ oIdx + 3 ]; // x1 pcx
	p4y = wallOpnPos[ wIdx ][ oIdx + 4 ]; // y1 ho2
	p4z = wallOpnPos[ wIdx ][ oIdx + 5 ]; // z1 pcz
	
}

function setWallPositions( i ) {
	
	if ( !openings ) { // without wall openings, wall material mm[ i ][ 0 ]
		
		vt[ walls[ i ][ mi ][ 0 ] ].push( p1x,p1y,p1z, p3x,p3y,p3z, p4x,p4y,p4z );  
		vt[ walls[ i ][ mi ][ 0 ] ].push( p1x,p1y,p1z, p4x,p4y,p4z, p2x,p2y,p2z );
		
	 } else { // with wall openings, wall material mm[ i ][ 0 ], opening material mm[ i ][ 1 ] (first filled) ..
	 	
		ex = ( p3x - p1x ) / wallWidth;
		ez = ( p3z - p1z ) / wallWidth;
		
		mb = ( p3y - p1y ) / wallWidth;	
		mt = ( p4y - p2y ) / wallWidth;
		
		wid = 0;
		
		for ( let j = 1, k = 1; j < openingCount * 4 + 1; j += 4, k ++ ) { // openings [ wo, 4 values each .. (, indent) ]
			
			wid1 = wid + walls[ i ][ opnIdx ][ j ];
			wid2 = wid1 + walls[ i ][ opnIdx ][ j + 1 ];
			
			if ( wid1 > wallWidth || wid2 > wallWidth ) break;
			
			pax = p1x + wid * ex;
			paz = p1z + wid * ez;
			
			pbx = p1x + wid1 * ex;
			pbz = p1z + wid1 * ez;
			
			pcx = p1x + wid2 * ex;
			pcz = p1z + wid2 * ez;
			
			hb = p1y + wid * mb; 
			hb1 = p1y + wid1 * mb;
			hb2 = p1y + wid2 * mb;
			
			ht = p2y + wid * mt;
			ht1 = p2y + wid1 * mt;
			ht2 = p2y + wid2 * mt;
			
			ho1 = p1y + walls[ i ][ opnIdx ][ j + 2 ];
			ho2 = ho1 + walls[ i ][ opnIdx ][ j + 3 ];
			
			wallOpnPos[ i ].push(  pbx, ho1, pbz, pcx, ho2, pcz ); // openings x0,y0,z0,x1,y1,z1
			
			if ( walls[ i ][ opnIdx ][ j ] > 0 ) { // wall width left of opening greater than 0
				
				vt[ walls[ i ][ mi ][ 0 ] ].push( pax,hb,paz, pbx,hb1,pbz, pbx,ht1,pbz, pax,hb,paz, pbx,ht1,pbz, pax,ht,paz );
				
			} 
			
			if ( ho1 > hb1 && ho1 > hb2 ) { // under opening - related to y00 !
				
			    vt[ walls[ i ][ mi ][ 0 ] ].push( pbx,hb1,pbz, pcx,hb2,pcz, pcx,ho1,pcz, pbx,hb1,pbz, pcx,ho1,pcz, pbx,ho1,pbz );
				
			}
			
			if ( m[ getMatIndex( walls, i, mi, k ) ][ 1 ] !== Empty ) { // opening ( other material mm[i][1] ... mm[i][openingCount] )
				
				len =  sqrt( ( pcx - pbx ) * ( pcx - pbx ) + ( pcz - pbz ) * ( pcz - pbz ) );
				dx = indent * ( pcz - pbz ) / len;
				dz = -indent * ( pcx - pbx ) / len;
				
				vt[ getMatIndex( walls, i, mi, k ) ].push( pbx + dx, ho1, pbz + dz, pcx + dx, ho1, pcz + dz, pcx + dx, ho2, pcz + dz );
				vt[ getMatIndex( walls, i, mi, k ) ].push( pbx + dx, ho1, pbz + dz, pcx + dx, ho2, pcz + dz, pbx + dx, ho2, pbz + dz );
			}
			
			if ( ho2 < ht1 && ho2 < ht2 ) { // above opening
				
				vt[ walls[ i ][ mi ][ 0 ] ].push( pbx,ho2,pbz, pcx,ho2,pcz, pcx,ht2,pcz, pbx,ho2,pbz, pcx,ht2,pcz, pbx,ht1,pbz );
				
			}
			
			wid = wid2;
		
		}
		
		if ( wid < wallWidth ) {  // remaining
			
			vt[ walls[ i ][ mi ][ 0 ] ].push( pcx,hb2,pcz, p3x,p3y,p3z, p4x,p4y,p4z, pcx,hb2,pcz, p4x,p4y,p4z, pcx,ht2,pcz );
			
		}
		
	}
	
}

function setThickWallPositions( i ) {
	
	dx = p3x - p1x;
	dz = p3z - p1z;
	len = sqrt( dx * dx + dz * dz );
	
	dx =  depth * dz / len / 2;
	dz = -depth * ( p3x - p1x ) / len / 2;
	
	p1xp = p1x + dx;
	p1xm = p1x - dx;
	p1zp = p1z + dz;
	p1zm = p1z - dz;
	
	p2xp = p2x + dx;
	p2xm = p2x - dx;
	p2zp = p2z + dz;
	p2zm = p2z - dz;
	
	p3xp = p3x + dx;
	p3xm = p3x - dx;
	p3zp = p3z + dz;
	p3zm = p3z - dz;
	
	p4xp = p4x + dx;
	p4xm = p4x - dx;
	p4zp = p4z + dz;
	p4zm = p4z - dz;
	
	// ... front   mm[i] index 0
	
	vt[ walls[ i ][ mi ][ 0 ] ].push( p3xm, p3y, p3zm,  p2xm, p2y, p2zm,  p1xm, p1y, p1zm );
	vt[ walls[ i ][ mi ][ 0 ] ].push( p3xm, p3y, p3zm,  p4xm, p4y, p4zm,  p2xm, p2y, p2zm );
	
	// ... back  mm[i] index 1
	
	vt[ getMatIndex( walls, i, mi, 1 ) ].push( p1xp, p1y, p1zp,  p4xp, p4y, p4zp,  p3xp, p3y, p3zp );
	vt[ getMatIndex( walls, i, mi, 1 ) ].push( p1xp, p1y, p1zp,  p2xp, p2y, p2zp,  p4xp, p4y, p4zp );
	 
	// ... left  mm[i] index 2
	
	vt[ getMatIndex( walls, i, mi, 2 ) ].push( p1xm, p1y, p1zm,  p2xp, p2y, p2zp,  p1xp, p1y, p1zp );
	vt[ getMatIndex( walls, i, mi, 2 ) ].push( p1xm, p1y, p1zm,  p2xm, p2y, p2zm,  p2xp, p2y, p2zp );
	
	// ... right mm[i] index 3
	
	vt[ getMatIndex( walls, i, mi, 3 ) ].push( p3xp, p3y, p3zp,  p4xm, p4y, p4zm,  p3xm, p3y, p3zm );
	vt[ getMatIndex( walls, i, mi, 3 ) ].push( p3xp, p3y, p3zp,  p4xp, p4y, p4zp,  p4xm, p4y, p4zm );
	
	// ... top mm[i] index 4
	
	vt[ getMatIndex( walls, i, mi, 4 ) ].push( p2xp, p2y, p2zp,  p4xm, p4y, p4zm,  p4xp, p4y, p4zp );
	vt[ getMatIndex( walls, i, mi, 4 ) ].push( p2xp, p2y, p2zp,  p2xm, p2y, p2zm,  p4xm, p4y, p4zm );
	
	// ... bottom  mm[i] index 5
	
	vt[ getMatIndex( walls, i, mi, 5 ) ].push( p1xm, p1y, p1zm,  p3xp, p3y, p3zp,  p3xm, p3y, p3zm );
	vt[ getMatIndex( walls, i, mi, 5 ) ].push( p1xm, p1y, p1zm,  p1xp, p1y, p1zp,  p3xp, p3y, p3zp );
	
}

function autoWallUVs( i ) {
	
	idx = 0;
	
	const min = Math.min( p1y, p3y );
	const max = Math.max( p2y, p4y );
	
	const height = max - min;
	
	const btm0 = ( p1y - min ) / height;
	const top0 = ( p2y - min ) / height;
	const btm1 = ( p3y - min ) / height;
	const top1 = ( p4y - min ) / height;
	
	if ( !thick ) { // wall surface, not thick
		
		if ( !openings ) {	// without wall openings
			
			uv[ walls[ i ][ mi ][ 0 ] ].push( 0,btm0, 1,btm1, 1,top1, 0, btm0, 1, top1, 0,top0 );
			
		} else {	// with wall openings
		
			mb = ( p3y - p1y ) / wallWidth;	
			mt = ( p4y - p2y ) / wallWidth;
			
			wid = 0;
			
			u = 0;
			
			vb0 = btm0;
			vt0 = top0;
			
			for ( let j = 1, k = 1; j < openingCount * 4 + 1; j += 4, k ++ ) { // openings [ wo, 4 values each .. (, indent) ]
				
				wid1 = wid + walls[ i ][ opnIdx ][ j ];
				wid2 = wid1 + walls[ i ][ opnIdx ][ j + 1 ];
				
				if ( wid1 > wallWidth || wid2 > wallWidth ) break;
				
				u1 = wid1 / wallWidth;
				u2 = wid2 / wallWidth;
				
				dv2  = ( wid2 - wid1 ) / 2 / height;
				
				vb1 = btm0 + wid1 * mb  / height;
				vb2 = btm0 + wid2 * mb / height;
				
				vt1 = top0 + wid1 * mt / height;
				vt2 = top0 + wid2 * mt / height;
				
				vo1 = btm0 +  walls[ i ][ opnIdx ][ j + 2 ] / height;
				vo2 = btm0 + ( walls[ i ][ opnIdx ][ j + 2 ] + walls[ i ][ opnIdx ][ j + 3 ] ) / height;
				
				wallOpnUVs[ i ].push( u1, vo2 - dv2 , u2, vo2 ); // openings 
				
				if ( walls[ i ][ opnIdx ][ j ] > 0 ) { // before opening
					
					uv[ walls[ i ][ mi ][ 0 ] ].push( u,vb0, u1,vb1, u1,vt1, u,vb0, u1,vt1, u,vt0 );
					
				}
				
				if ( vo1 > vb1 && vo1 > vb2 ) { // under opening
					
					uv[ walls[ i ][ mi ][ 0 ] ].push( u1,vb1, u2,vb2, u2,vo1, u1,vb1, u2,vo1, u1,vo1 );
					
				}
				
				if ( m[ getMatIndex( walls, i, mi, k ) ][ 1 ] !== Empty ) { // opening ( other material mm[i][1] ... mm[i][openingCount] )
					
					uv[ getMatIndex( walls, i, mi, k )  ].push( 0,0, 1,0, 1,1, 0,0, 1,1, 0,1 );
					
				}
				
				if ( vo2 < vt1 && vo2 < vt2 ) { // above opening
					
					uv[ walls[ i ][ mi ][ 0 ] ].push( u1,vo2, u2,vo2, u2,vt2, u1,vo2, u2,vt2, u1,vt1 );
					
				}
				
				wid = wid2;
				u = u2;
				vb0 = vb2;
				vt0 = vt2;
				
			}
			
			if ( wid < wallWidth ) {  // remaining
				
				uv[ walls[ i ][ mi ][ 0 ] ].push( u2,vb2, 1,btm1, 1,top1, u2,vb2, 1,top1, u2,vt2 );
				
			}
			
		}
		
	}
	
	// thick wall, structural component ...
	
	if ( thick ) {
		
		uv[ walls[ i ][ mi ][ 0 ] ].push( 1,btm1, 0,top0, 0,btm0,   1,btm1, 1,top1, 0,top0 ); // front
		
		uv[ getMatIndex( walls, i, mi, 1 ) ].push( 1,btm0, 0,top1, 0,btm1,  1,btm0, 1,top0, 0,top1 ); // back
		
		uv[ getMatIndex( walls, i, mi, 2 ) ].push( 1,btm0, 0,top0, 0,btm0,  1,btm0, 1,top0, 0,top0 ); // left
		
		uv[ getMatIndex( walls, i, mi, 3 ) ].push( 1,btm1, 0,top1, 0,btm1,  1,btm1, 1,top1, 0,top1 ); // right
		
		uv[ getMatIndex( walls, i, mi, 4 ) ].push( 0,0, 1,1, 0,1,   0,0, 1,0, 1,1 ); // top
		
		uv[ getMatIndex( walls, i, mi, 5 ) ].push( 1,1, 0,0, 1,0,   1,1, 0,1, 0,0 ); // bottom
	}
	
}

function setWallUVs( i ) { 
	
	// [ 0,0, 0,1, 1,0, 1,1 ],  //  like  autoUV to    xz0,y0, xz0,y1, xz1,y0, xz1,y1
	
	u = walls[ i ][ uvi ][ 0 ];
	v = walls[ i ][ uvi ][ 1 ];
	
	u1 = walls[ i ][ uvi ][ 4 ];
	v1 = walls[ i ][ uvi ][ 5 ];
	
	u2 = walls[ i ][ uvi ][ 6 ];
	v2 = walls[ i ][ uvi ][ 7 ];
	
	uv[ walls[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
	
	u = walls[ i ][ uvi ][ 0 ];
	v = walls[ i ][ uvi ][ 1 ];
	
	u1 = walls[ i ][ uvi ][ 6 ];
	v1 = walls[ i ][ uvi ][ 7 ];
	
	u2 = walls[ i ][ uvi ][ 2 ];
	v2 = walls[ i ][ uvi ][ 3 ];
	
	uv[ walls[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
	
}

function setThickWallUVs( i ) {
	
	// ... front
	
	u = walls[ i ][ uvi ][ 3 ];
	v = walls[ i ][ uvi ][ 4 ];
	
	u1 = walls[ i ][ uvi ][ 0 ];
	v1 = walls[ i ][ uvi ][ 2 ];
	
	u2 = walls[ i ][ uvi ][ 0 ];
	v2 = walls[ i ][ uvi ][ 1 ];
	
	uv[ walls[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
	
	u1 = walls[ i ][ uvi ][ 3 ];
	v1 = walls[ i ][ uvi ][ 5 ];
	
	u2 = walls[ i ][ uvi ][ 0 ];
	v2 = walls[ i ][ uvi ][ 2 ];
	
	uv[ walls[ i ][ mi ][ 0 ] ].push( u, v, u1, v1, u2, v2 );
	
	// ... back
	
	u = walls[ i ][ uvi ][ 3 ];
	v = walls[ i ][ uvi ][ 1 ];
	
	u1 = walls[ i ][ uvi ][ 0 ];
	v1 = walls[ i ][ uvi ][ 5 ];
	
	u2 = walls[ i ][ uvi ][ 0 ];
	v2 = walls[ i ][ uvi ][ 4 ];
	
	uv[ getMatIndex( walls, i, mi, 1 ) ].push( u, v, u1, v1, u2, v2 );
	
	u1 = walls[ i ][ uvi ][ 3 ];
	v1 = walls[ i ][ uvi ][ 2 ]; 
	
	u2 = walls[ i ][ uvi ][ 0 ];
	v2 = walls[ i ][ uvi ][ 5 ];
	
	uv[ getMatIndex( walls, i, mi, 1 ) ].push( u, v, u1, v1, u2, v2 );
	
	// ... left
	
	uv[ getMatIndex( walls, i, mi, 2 ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
	
	// ... right
	
	uv[ getMatIndex( walls, i, mi, 3 ) ].push( 1,0, 0,1, 0,0,  1,0, 1,1, 0,1 );
	
	// ... top
	
	uv[ getMatIndex( walls, i, mi, 4 ) ].push( 0,0, 1,1, 0,1,   0,0, 1,0, 1,1 );
	
	// ... bottom
	
	uv[ getMatIndex( walls, i, mi, 5 ) ].push( 1,1, 0,0, 1,0,   1,1, 0,1, 0,0 );
	
}

function setSidePositions( cp, i, mi, mNo, leftRight, pax, pay, paz, pbx, pby, pbz, r, dx, dz, tsa, tsb, osx, osz ) {
	
	const x1 = pax - osx;
	const y1 = pay + tsa;
	const z1 = paz - osz;
	
	const x2 = pax + dx ;
	const y2 = pay + tsa;
	const z2 = paz + dz;
	
	const x3 = pbx + dx;
	const y3 = pby - r + tsb;
	const z3 = pbz + dz;
	
	const x4 = pbx - osx;
	const y4 = pby - r + tsb;
	const z4 = pbz - osz;
	
	if ( leftRight === 'left' )  vt[ getMatIndex( cp, i, mi, mNo ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3, x1,y1,z1, x3,y3,z3, x4,y4,z4 );
	if ( leftRight === 'right' ) vt[ getMatIndex( cp, i, mi, mNo ) ].push( x1,y1,z1, x3,y3,z3, x2,y2,z2, x1,y1,z1, x4,y4,z4, x3,y3,z3 );
		
	if ( leftRight === ''  ) vt[ getMatIndex( cp, i, mi, mNo ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3, x1,y1,z1, x3,y3,z3, x4,y4,z4 );
	
}

function setArchawayPositions( i, leftRight, px, py, pz ) {
	
	let x1, y1, z1, x2, y2, z2, x3, y3, z3;
	
	let cosj = 1;
	let apy = cy;
	
	let sinj1, cosj1, apy1;
	
	for( let j = 0; j < 24; j ++ ) {
		
		sinj1 = sin( pi / 2 * ( j + 1 ) / 24 );
		cosj1 = cos( pi / 2 * ( j + 1 ) / 24 );
		apy1 = cy + radius * sinj1 ;
		
		if ( parts.indexOf( 'f' ) !== -1 ) { // front
			
			x1 = px;
			y1 = py;
			z1 = pz;
			
			x2 = cx + cpx * cosj;
			y2 = apy;
			z2 = cz + cpz * cosj;
			
			x3 = cx + cpx * cosj1;
			y3 = apy1;
			z3 = cz + cpz * cosj1;
			
			if ( leftRight === 'left'  ) vt[ getMatIndex( archways, i, mi, fMat ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3 );
			if ( leftRight === 'right' ) vt[ getMatIndex( archways, i, mi, fMat ) ].push( x1,y1,z1, x3,y3,z3, x2,y2,z2 );
			
		}
		
		if ( parts.indexOf( 'a' ) !== -1 ) { // arching
			
			x1 = cx + cpx * cosj;
			y1 = apy;
			z1 = cz + cpz * cosj;
			
			x2 = cx + dx + cpx * cosj;
			y2 = apy;
			z2 = cz + dz + cpz * cosj;
			
			x3 = cx + cpx * cosj1;
			y3 = apy1;
			z3 = cz + cpz * cosj1;
			
			if ( leftRight === 'left'  ) vt[ getMatIndex( archways, i, mi, aMat ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3 );
			if ( leftRight === 'right' ) vt[ getMatIndex( archways, i, mi, aMat ) ].push( x1,y1,z1, x3,y3,z3, x2,y2,z2 );
			
			x1 = cx + dx + cpx * cosj;
			y1 = apy;
			z1 = cz + dz + cpz * cosj;
			
			x2 = cx + dx + cpx * cosj1;
			y2 = apy1;
			z2 = cz + dz + cpz * cosj1;
			
			x3 = cx + cpx * cosj1;
			y3 = apy1;
			z3 = cz + cpz * cosj1;
			
			if ( leftRight === 'left'  ) vt[ getMatIndex( archways, i, mi, aMat ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3 );
			if ( leftRight === 'right' ) vt[ getMatIndex( archways, i, mi, aMat ) ].push( x1,y1,z1, x3,y3,z3, x2,y2,z2 );
			
		}
		
		if ( parts.indexOf( 'o' ) !== -1 ) { // opposite 
			
			x1 = px + dx;
			y1 = py;
			z1 = pz + dz;
			
			x2 = cx + dx + cpx * cosj;
			y2 = apy;
			z2 = cz + dz + cpz * cosj;
			
			x3 = cx + dx + cpx * cosj1;
			y3 = apy1;
			z3 = cz + dz + cpz * cosj1;
			
			if ( leftRight === 'left'  ) vt[ getMatIndex( archways, i, mi, oMat ) ].push( x1,y1,z1, x3,y3,z3, x2,y2,z2 );
			if ( leftRight === 'right' ) vt[ getMatIndex( archways, i, mi, oMat ) ].push( x1,y1,z1, x2,y2,z2, x3,y3,z3 );
		}
		
		cosj = cosj1;
		apy = apy1;
		
	}
	
}

function setArchawayUVs( i, leftRight, u1, v1, u2, v2 ) {
	
	const du = ( u2 - u1 ) / 2;
	const dv = ( v2 - v1 );
	const u  = ( u1 + u2 ) / 2;
	
	let cosj = leftRight === 'left' ? u : u2;
	let sinj = v1;
	
	let ua,va, ub, vb, uc, vc; 
	
	let sinj1, cosj1;
	
	for( let j = 0; j < 24; j ++ ) {
		
		cosj1 = du * cos( pi / 2 * ( j + 1 ) / 24 );
		sinj1 = v1 + dv * sin( pi / 2 * ( j + 1 ) / 24 ) ;
		
		if ( parts.indexOf( 'f' ) !== -1 ) { // front
			
			sign = leftRight === 'left' ? -1 : 1;
			
			ua = leftRight === 'left' ?  u1 : u2;
			va = v2;
			
			ub = u + sign * cosj;
			vb = sinj;
			
			uc = u + sign * cosj1;
			vc = sinj1;
			
			if ( leftRight === 'left'  ) uv[ getMatIndex( archways, i, mi, fMat ) ].push( ua, va, ub, vb, uc, vc );
			if ( leftRight === 'right' ) uv[ getMatIndex( archways, i, mi, fMat ) ].push( ua, va, uc, vc, ub, vb );
			
		}
		
		if ( parts.indexOf( 'a' ) !== -1 ) {// arching
			
			ua = leftRight === 'left' ? 0 : 1;
			va = j / 24;
			
			ub = leftRight === 'left' ? 1 : 0;
			vb = j / 24;
			
			uc = leftRight === 'left' ? 0 : 1;
			vc = ( j + 1 ) / 24;
			
			if ( leftRight === 'left'  ) uv[ getMatIndex( archways, i, mi, aMat ) ].push( ua, va, ub, vb, uc, vc );
			if ( leftRight === 'right' ) uv[ getMatIndex( archways, i, mi, aMat ) ].push( ua, va, uc, vc, ub, vb );
			
			ua = leftRight === 'left' ? 1 : 0;
			va = j / 24;
			
			ub = leftRight === 'left' ? 1 : 0; 
			vb = ( j + 1 ) / 24; 
			
			uc = leftRight === 'left' ? 0 : 1;
			vc = ( j + 1 ) / 24;
			
			if ( leftRight === 'left'  ) uv[ getMatIndex( archways, i, mi, aMat ) ].push( ua, va, ub, vb, uc, vc );
			if ( leftRight === 'right' ) uv[ getMatIndex( archways, i, mi, aMat ) ].push( ua, va, uc, vc, ub, vb );
			
		}
		
		if ( parts.indexOf( 'o' ) !== -1 ) { // opposite
			
			sign = leftRight === 'left' ? 1 : -1;
			
			ua = leftRight === 'left' ? u2 : u1;
			va = v2; //1;
			
			ub = u + sign * cosj;
			vb = sinj;
			
			uc = u + sign * cosj1;
			vc = sinj1;
			
			if ( leftRight === 'left'  ) uv[ getMatIndex( archways, i, mi, oMat ) ].push( ua, va, uc, vc, ub, vb );
			if ( leftRight === 'right' ) uv[ getMatIndex( archways, i, mi, oMat ) ].push( ua, va, ub, vb, uc, vc );
			
		}
			
		sinj = sinj1;
		cosj = cosj1;
		
	}
	
}
