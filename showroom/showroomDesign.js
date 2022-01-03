// ----------- SHOWROOM DESIGN -------------------------
 
// Materials m[.] multi-materials  mm[.] and colors c[.] must be defined in the file materials.js.

// x to right, z to front
// y to top,  ( y0 bottom, y1 top )

// write array brackets [ ] ,  optional data in ( ) - do not write these brackets
// define your defaults for optional data   ...Default =

// Use placeholders [], to enable later insertion without changing the index, e.g. for wall index. 

// ................................................................................................

// lightings 
// Ambient,  color, intensity  - should be available as basic lighting
// Point, x,z, y -position,  color, intensity 
// Spot, x,z, y -position, x,z,y -target position,  color, intensity, angle°, penumbra
// LongLamp, x,z, y -position, color, intensity

lightings = [
	
	[ Ambient, c[9], 0.8 ],                                   // 0
	[ Point, 5,  3, 2.9, c[8], 0.3 ],                         // 1
	[ Point, 3, 22, 2.9, c[8], 0.6 ],                         // 2
	[],                                                       // 3 placeholder
	[ Spot, 6, 20.21, 3,  7, 24.9, 2.3, c[1], 0.5, 20, 0.6 ], // 4
	[ LongLamp, 7, 15, 4.5, c[8], 0.13 ],                     // 6 
	//[ LongLamp, 7, 22, 3.7, c[8], 0.13 ],                   // 7 don't use too much lights
	//[ LongLamp, 4, 3, 3.4, c[8], 0.10 ],                    // 5
	
];

//..................................................................................................
 
// ground plan x,z coordinates, floor and  ceiling 
// Points ground plan lines (clockwise), lines corner to centre of gravity within the surface!  
// Last point is connected to the first.

// variant (a) with individual level.
//   x,z,  y ..  m[i] (,[ uv's ] )       // uv's according to the circulation of the plan line
// variant (b) with uniform level [y].  
//   x,z, .. [ y ], m[i]  (,[uv's] )     // uv's according to the circulation of the plan line


floors  = [
 
	[  0,-2, 2,-2, 11,3, 11,5, 0,5, [ 0.3 ], m[2] ],                                                        // 0 (b)
	[],                                                                                                     // 1 placeholder
	[ 0.0,8.0,0.0,  0.0,5.0,0.3,  3.0,5.0,0.3, 3.0,8.0,0.0, m[1], [ 0.3,0.2, 0.3,0.5, 0.6,0.5, 0.6,0.2 ] ], // 2 (a)  compare uvs to ceiling
	[ 0,25, 0,16, -1,16, -1,13, 0,13, 0,8, 15,8, 15,15, 10,20, 10,25, [ 0 ], m[6] ],                        // 3 (b)
	
	
];

ceilings  = [
	
	[  0,-2, 2,-2, 11,3, 14,5, 0,5, [ 4.5 ], m[1] ],                                                        // 0 (b)
	[],                                                                                                     // 1 placeholder
	[ 0.0,8.0,4.5,  0.0,5.0,4.5, 3.0,5.0,4.5, 3.0,8.0,4.5, m[1], [ 0.6,0.2, 0.6,0.5, 0.3,0.5,  0.3,0.2 ] ], // 2 (a) compare uvs to floor
	[ 0,25,  0,16, -10,16, -10,13, 0,13, 0,8, 15,8, 15,15, 10,20, 10,25,[ 5.3 ], m[20] ],                   // 3 (b)
	[ 3.2,5,4.5, 11,5,4.5, 11,8,0.9, 3.2,8,0.9, m[20] ],                                                    // 4 (a)
	[ -10,10, -3.85,10,-3.85,16, -10,16, [ 2.5], m[3] ],                                                    // 5 (b)
	
];
//..................................................................................................

// walls
// structural components, interior walls, thick partition walls,  blockings, platforms -without depth only visible from inside!

// x0,z0, (y00,y01,) x1,z1, y10,y11 (, [ wd (, wall depth ) ]  ) or (, [ wo, wall opening, .. (, indent)] ), m[.] or mm[.] (, [ uv's front ] )

// several wall openings, each: distance (from the left), width, level lower edge, height  
// uv's front: [ u0,v00,v01, u1,v10,v11 ]  suitable to the dimensions

wallDepthDefault = 0.2;
wallIndentDefault = 0.15;

walls = [
	
		  // walls with opening for archways
	[ 0,8.5, 15,8.5, 0,5.3, [ wo, 0.6,2,0,2.5 ], mm[2] ],                                      //  0
	[ 3,8.0,  0,8.0, 0,4.5, [ wo, 0.4,2,0,2.5 ], mm[2] ],                                      //  1
	      // thick walls
	[ 5,20.1, 10,20.1, 0,5.3, [ wd ], mm[7] ],                                                 //  2
		// thin walls [ wo openings]
	[  0,-2, 2,-2, 0.3,4.5, m[1], [ 0.1,0.1, 0.1,0.7, 0.4,0.1, 0.4,0.7 ] ],                    //  3
	[  2,-2, 11,3, 0.3,4.5, [ wo, 1.5,1.5,1,2, 1,1.5,0,3, 1,1.5,1,2, 0.2  ], mm[3] ],          //  4	
	[],                                                                                        //  5  placeholder
	[],                                                                                        //  6
	[],                                                                                        //  7	
	[ 11,3, 11,5, 0.3,4.5,  m[1] ],                                                            //  8
	[ 15.0, 8.5, 15,15, 0,5.3, m[1] ],                                                         //  9
	[ 15.0,15.0, 10,20, 0,5.3, [ wo, 1.5,4,1,2.5, 0.2 ], mm[3] ],                              // 10
	[ 10.0,25.0,  2,25, 0,5.3, m[7] ],                                                         // 11
	[  0,13, 0,8.5, 0,5.3, m[1], [ 0.1,0, 0.1,1, 0.8,0, 0.8,1 ] ],                             // 12
	[  0,8, 0,4.5, 0,-2, 0.3,4.5, [ wo, 1,1.25,1.3,1.35, 2.7,2,1.2,1.5,  0 ], mm[10] ],        // 12
	[  3.15,5, 0.3,4.5, 3.15,8, 0,4.5, [ wd, 0.3 ], mm[4] ],                                   // 13
	     // imagery
	[ 8.0,24.95 , 6.0,24.95, 1.25,2.95, m[31] ],                                               // 14
	     // diverse elements
	[  7,16,  0.5,0.75, 9,17,  0,1.25, [ wd, 1.1 ], mm[1], [ 0.1, 0.4,0.6, 0.9, 0.05,0.95 ] ], // 15
	[  5,9.01, 10,9.01, 2.1,2.16, [ wd, 0.8 ], mm[1] ],                                        // 16
	[  6,8.51,  0,2.1,  6,9.3, 1.9,2.1, [ wd, 0.05 ], mm[1] ],                                 // 17
	
];

//..................................................................................................

// soffits  IMPORTANT: define after walls
// wall index, opening index, depth, mm[.] (, 'soffit parts' )(, sill thickness,  sill overhang ) 
// parts: l left, r right, t top, b bottom, s sill

soffitPartsDefault = 'lrts';
soffitSillThicknessDefault = 0.02;
soffitSillOverhangDefault =  0.025;

soffits = [
	
	[ 4, 0, 0.4,  mm[5], 'lrts', 0.03, 0.04 ],    //  0
	[ 4, 2, 0.4,  mm[1] ],                        //  1
	[ 10, 0, 0.35, mm[1], 'lrb' ],                //  2 
	
];

//.................................................................................................

// archways

// variant (a)
// x0,z0, x1,z1, y0,y1, depth, mm[.]  ( archway parts )(, sill thickness, sill overhang )

// variant (b)   IMPORTANT! define after walls
// wall index, opening index, depth, mm[.] (, parts )(, sill thickness, sill overhang )

// Parts for both variants: f front, o opposite, a curvature, l left, r right, b bottom, s sill

archwayPartsDefault = 'flras';
archwaySillThicknessDefault = 0.03;
archwaySillOverhangDefault  = 0.04;

archways = [ 
	
	[ 11,23.5, 10,24.8, 0,3.4, 0.45, mm[1], 'faolrbs ',  0.14, 0.2 ],	
		// for wall openigs	
	[ 0, 0, 0.5, mm[1], 'falr' ],                // 0 (b)
	[ 1, 0, 0.0, mm[1], 'lraf' ],                // 1 (b)
	[ 4, 1, 0.5, mm[1], 'faolrs', 0.05 , 0.2 ],  // 2 (b)

];

//.................................................................................................

// round walls (polygon)
// x,z -center, y0, y1, radius, radius segments, start angle°, angle°, m[.] (,'e' external or 'c' centers -view )

roundWallViewDefault = 'c';

roundWalls = [
	
	 [ 2,23, 0,5.3, 2, 16, 270, 90, m[5] ], //  0
	
];

//.................................................................................................
// shell functions for components ( height => diameter ) 
// functions:  dH[i] = h => term;   def[0,1] => value[0,1] 

dHdefault = h => 1; // don't change, diameter is constant
 
dH[0] = h => 0.5 + 0.25 * sin( 10 * h );    // use ; at end of lines
dH[1] = h => 2 - 1.55 * h;
dH[2] = h => 0.2 + sqrt( h );
dH[3] = h => tan( 1 - 0.7 * h );

// components 
// x,z -center,  y0,y1, radial detail, height detail, diameter,  mm[.] (,dH[.] ) (,rotation° )
// mm[.] sequence: mantle ( if not dHdefault only color as material ), top, bottom 

componentRotationDefault = 0;

components = [
	
	[ 7,13, 0.2,1.2, 5,36, 1.9, mm[22], dH[0], 45  ], //  0
	[ 4,12, 0,0.7, 3,1, 0.9, mm[1] ],                 //  1 
	[ ],                                              //  2 placeholder
	[ 12,23, 0,1.5, 36,12, 1.2, mm[22], dH[2] ]       //  3
	
];

//.................................................................................................

// mirrors 

// Rectangle, x,z, y, width, heigt,        y-rotation° (, [ti, tilt°] )(, color ) 
// Polygon,   x,z, y, radius, n.rotation°, y-rotation° (, [ti, tilt°] )(, color )  

// IMPORTANT! define after walls
// WallRectangle, wall index, left, botom,  width,      heigt,  wall spacing (, [ti, tilt°] )(, color )
// WallPolygon,   wall index, left, botom, radius, n.rotation°, wall spacing (, [ti, tilt°] )(, color )

// n.rotation°    integer part of the number is corner number, 3 digits behind the point is rotation of the corners

mirrorTiltDefault = 0;
mirrorColorDefault = c[11];  // see colors in material.js

mirrors = [
	
	[ WallPolygon, 9, 2.9, 0.9, 1.6, 6.030, 0.2, [ ti, 4.5 ] ],            // 0 define after wall
	// [ Rectangle, 13,11, 2.5,  3.2, 2.12, -45, c[2] ]                    // 1                   don't use too much mirrors
	// [ Polygon,    10,10, 1.2,  1.8, 18.025 , 60, [ ti, 25 ] ],          // 2
	// [ WallRectangle, 9, 1.9, 0.01, 2.6,3.1, 0.55   ],                   // 3 define after wall
	
];

//.................................................................................................

// frames / Rahmen   (js in subfolder frames)
// frame geometries gFrame[.] defined in frames/ frames.js ( created with ConstructFrameShowroom.html )

// variant (a)	
// frameID, x,z,  y, y-rotation°, mm[.](, xScale (, zScale(, yScale)))

// variant (b)	  IMPORTANT! define after walls
// frameID, wallindex, opening index (,indent), mm[.] (,xScale (, zScale(, yScale)))

frameIndentDefault = 0.15;
frameXscaleDefault = 1;
frameZscaleDefault = 1;
frameYscaleDefault = 1;

frames = [
 
	[ 0, 10.8, 21 , 1.5, 45, mm[5], 1.5, 1, 1.5 ],          // 0 (a)
	[ 0, 4, 0, 0.18, mm[6] ],                               // 1 (b)
	[ 0, 4, 2, mm[1] ],                                     // 2 (b)
	
];

//.................................................................................................

// objects
// 3D-formats: Gltf, Obj in subfolder  objects3D/filename

//  3D-format, filename, x,z, y -scaling, x,z, y -position,  x,z, y -rotation°

// For Obj, a .mtl with the same name must exist in the folder.

objects3D = [
	
	[ Gltf, 'girl1', 1.02, 1.02, 1.02,  -0.4, 13.5, 0,  0, 0, 30 ],	
	[ Obj, 'flower', 0.01, 0.01, 0.01,  -0.5, 14.5, 0.01,  20, 0, 45 ],  // flower.mtl (material) must exist! 
	// [ Obj, 'Spiral_Stairs-Cherry', 0.015, 0.015, 0.015,  1, 18.0, 4.2 ,  0, 0, 0 ],
	[ Obj, 'Straight_Stairs', 0.01, 0.01, 0.01,  -2, 15.2, 1.05,   270,  90, 0 ],
	
];

//.................................................................................................

// surrounding 

// textures for  +x,-x,+y,-y,+z,-z, stored in subfolder CubeMap - NOTE: three.js order x,y,z
// The file names are freely selectable, the order is important.
surroundingTexture = [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];

//.................................................................................................

// visitor
// only 3D-format Gltf, in subfolder objects3D/filename

// filename (type Gltf), x,z, y-scaling, eye height, x,z-start position, y-start rotation°

visitor = [ 'girl', 1.02, 1.02, 1.1,  1.6,   12, 12.5,  -85 ];

//.................................................................................................

// walkableAreas

// Rectangle, xMin, zMin, xMax, zMax
// Circle,  x, z, radius
// Triangle,  xa, za,   xb, zb,  xc, zc (clockwise)
// The areas should touch or overlap sufficiently to allow a passage.

walkableAreas = [
	
	// [ Rectangle, -30, -30, 30, 30 ], //  test  
	
	[ Rectangle, 0.5, -1.5,    2,    5   ],
	[ Rectangle, 0.5,    3,   10.5,  4.5 ],
	[ Rectangle, 0.5,    5,    2.5,  7.5 ],
	[ Rectangle, 0.5,    5,    2.5,  7.5 ],
	[ Rectangle, 0.9,    7,    2.4,  9 ],
	[ Rectangle, 0.5,    9,   14.5, 14.5 ],
	[ Rectangle, 0.5,   14,    4,   24 ],
	[ Circle, 7, 13.5, 5 ],
	[ Triangle, 1.5,-1.5, 10.5,3.5, 1.5,5 ],
	[ Triangle, 3,20, 9,24, 3,24 ],
	
];

// --------------  end of showroom design --------------------