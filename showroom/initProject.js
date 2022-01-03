// init project showroom

'use strict'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.001, 1000 );

const eyes = new THREE.Group( ); // as cam holder
eyes.add( camera );
scene.add( eyes );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );

window.addEventListener("resize",function ( ) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	} , false );

const container = document.createElement('div');
document.body.appendChild( container );
container.appendChild( renderer.domElement );

const Front =  [ 0 ]; // THREE.FrontSide  0 
const Back =   [ 1 ]; // THREE.BackSide   1
const Double = [ 2 ]; // THREE.DoubleSide 2

const Empty = 'Empty';
const Wireframe = 'Wireframe';
const Basic = 'Basic';
const Phong = 'Phong';
const Lambert = 'Lambert';
const Texture = 'Texture';
const Video = 'Video';

// const Triangle, Rectanle, Circle, Polygon before in showroomAreaControl.js
const WallRectangle = 'WallRectangle';
const WallPolygon = 'WallPolygon';

const Gltf = 'Gltf';
const Obj = 'Obj';
const Ambient = 'Ambient';
const Point = 'Point';
const Spot = 'Spot';
const LongLamp = 'LongLamp';

const wo = 'wo'; // wall openings
const wd = 'wd'; // wall depth
const ti = 'ti'; // tilt

let wallDepthDefault;
let wallIndentDefault;
let soffitPartsDefault;
let soffitSillThicknessDefault;
let soffitSillOverhangDefault;
let archwayPartsDefault;
let archwaySillThicknessDefault;
let archwaySillOverhangDefault;
let roundWallViewDefault;
let dHdefault;
let componentRotationDefault;
let mirrorTiltDefault;
let mirrorColorDefault;
let frameXscaleDefault;
let frameZscaleDefault;
let frameYscaleDefault;
let frameIndentDefault;

let gFrame = []; // defined in frame/frame.js

let lighting = [ ];
let lightings = [];

let floors = [];
let ceilings = [];
let pls = []; // help array for plans (floors, ceilings)
let walls = [];
let wallOpnPos = []; // for wall opening positions
let wallOpnUVs = []; // for wall opening uv's
let wls = [];  // help array for walls
let boxes = [];
let soffits = [];
let archways = [];
let roundWalls = [];
let components = [];
let dH = []; // diameter height functions 
let mirrors = [];
let reflectors = [];
let frames = [];
let frmpos = []; // frame positions,  frmpos[ i ] defined in frame/frame.js
let frmuvs = []; // frame uv's,  frmuvs[ i ] defined in frame/frame.js
let objects3D = [];
let surroundingTexture = [];
let surrTex = [];
let surrounding = [];
let visitor = [];
let walkableAreas = [];

let c = [];  // colors
let m = [];  // materials
let mm = []; // multi materials

animate();

function animate( ) {
	
	requestAnimationFrame( animate );
	
	move( );	
	
	renderer.render( scene, camera );
	
	// console.log(renderer.info.render);

}