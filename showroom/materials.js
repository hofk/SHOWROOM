// define colors, materials, multi materials
// write array brackets [ ] ,  optional data in ( ) - do not write these brackets

// colors ( colour scheme for use in m, use there c[.] )

// array of hexadecimal color values,
c = [

	0x000000, //  0 black
	0xffffff, //  1 white
	0xff0000, //  2 red
	0x00ff00, //  3 green
	0x0000ff, //  4 blue
	0xffff00, //  5 yellow
	0x00ffff, //  6
	0xff00ff, //  7
	0xdedede, //  8 light gray
	0x202020, //  9
	,         // 10                      use ,  as placeholder
	0x889999, // 11 mirror color default
	
];

// define materials

// Side: Front (is default), Back, Double, 

// Empty - nothing is generated, usable for wall openings, placeholder,
// Basic or Phong or Lambert, c[.] (, Side )(, opacity )
// Texture, graphic file (, Side )(, [ wrap S, wrap T ] )(, opacity )
// Wireframe, c[.] (, Side )
// Video, video file (, Side )

m = [
	
	[ Empty ],                                       //   0 eventually for wall openings
	[ Texture, 'uvgrid01.png' ],                     //   1
	[ Texture, 'Fliese02.png', Front, [ 40, 32 ] ],  //   2
	[ Texture, 'Granit.jpg', 0.99 ],                 //   3
	[ Texture, 'Backstein.jpg' ],                    //   4
	[ Texture, 'beech.jpg', Double ],                //   5
	[ Texture, 'Marble1K.png' ],                     //   6
	[ Texture, 'paint01.png' ],                      //   7
	[ Texture, 'paint02.png' ],                      //   8
	[ Texture, 'paint03.png' ],                      //   9
	[ Empty ],                                       //  10 as placeholder
	[ Empty ],                                       //  11
	[ Empty ],                                       //  12
	[ Empty ],                                       //  13
	[ Empty ],                                       //  14
	[ Empty ],                                       //  15
	[ Empty ],                                       //  16
	[ Empty ],                                       //  17
	[ Empty ],                                       //  18
	[ Empty ],                                       //  19
	[ Phong, c[1] ],                                 //  20
	[ Basic, c[4] ],                                 //  21
	[ Phong, c[4] ],                                 //  22
	[ Phong, c[5] ],                                 //  23
	[ Phong, c[5] ],                                 //  24
	[ Phong, c[1], 0.3 ],                            //  25
	[ Phong, c[9] ],                                 //  26
	[ Lambert, c[9], 0.33 ],                         //  27
	[ Empty ],                                       //  28
	[ Empty ],                                       //  29
	[ Texture, 'door.png' ],                         //  30
	[ Texture, 'QueenOfNight.png' ],                 //  31
	[ Empty ],                                       //  32
	[ Empty ],                                       //  33
	[ Empty ],                                       //  34
	[ Empty ],                                       //  35
	[ Video, 'Raindrops_Videvo.mp4' ],               //  36 
	[ Empty ],                                       //  37
	[ Empty ],                                       //  38
	[ Empty ],                                       //  39
	[ Wireframe, c[4], Double ],                     //  40
	
];

// multi materials

// arrays of indices of the material array m[ ]

// 1 + openings count materials for walls with openings, index 0 for wall
// 6 materials for thick walls ( ... structural components etc.): front, back, left, right, top, bottom
// 6 materials for archways: front, arching, opposite, left, right,  bottom or sill top, sill front, sill underside, sill left, sill right
// 3 materials for components: mantle (only color as material), top, bottom

// If there are too few materials in [ ], the last material is still used.

mm = [
	
	[ 0 ],                     //  0   always Empty
	[ 1 ],                     //  1   always 'uvgrid01.png'
	[ 1, 0 ],                  //  2
	[ 1, 27, 30, 27 ],         //  3
	[ 4 ],                     //  4   always material 4
	[ 5 ],                     //  5   always material 5
	[ 6 ],                     //  6   always material 6 
	[ 7 ],                     //  7   always material 7
	[ 0 ],                     //  8   placeholder
	[ 0 ],                     //  9
	[ 9, 27, 36 ],             // 10
	[ 0 ],                     // 11   placeholder
	[ 0 ],                     // 12
	[ 0 ],                     // 13
	[ 0 ],                     // 14
	[ 0 ],                     // 15
	[ 0 ],                     // 16
	[ 0 ],                     // 17
	[ 0 ],                     // 18
	[ 0 ],                     // 19
	[ 1, 40, 1, 1, 40, 1 ],    // 20
	[ 0 ],                     // 21
	[ 22, 1  ],                // 22
	
];