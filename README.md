# SHOWROOM
 # Showrooms easy to generate from data of a construction drawing or dimensional sketch - uses three.js 
 


See also https://discourse.threejs.org/t/showrooms-easy-to-generate-from-data-of-a-construction-drawing-or-dimensional-sketch/19994


You will find a whole range of tools for displaying buildings and rooms along with their furnishings. Among them are both firmly defined and interactive ones.

In this case, the basis for the design of flexibly configurable rooms is a  construction drawing  or a  simple dimensional sketch.

The data is written in compact form in a simple text file (.js) according to a given scheme. For optional values you can define the defaults yourself. After each new entry you can see the result immediately after updating the page. So you can react immediately in case of an incorrect entry.

On the other hand you can simply put two slashes // in front of a line and remove elements temporarily.

The compact form of the data initially requires increased concentration during input. After a little bit of practice you can quickly play through different scenarios.

By specifying less data, lighting, mirrors and 3D models are also integrated.
With the definition of colors and the assignment of materials and multi-materials, the rooms can be designed individually.


The program has a modular structure and can easily be expanded with additional elements and effects as required. Most things are implemented as self defined non-indexed BufferGeometry.

So far the following things are available:
lighting, floors and ceilings (with individual level also ramps and roof slopes), walls with openings (extra materials) and soffits, archways, round walls, components with variable shell function, mirrors, frames (to be generated with ConstructFrameShowroom.html, an adjusted Vaiante of ConstructFrame.html, see https://discourse.threejs.org/t/construction-of-frames-with-contour-profile/13490 , placement of 3D objects (Gltf and Obj/Mtl), environment texture.

The movement of an viewer in the showroom is done with a specially designed control or the keyboard (cursor keys, number pad). The gaze can be directed up and down. You define the accessible areas in the form of adjoining or overlapping rectangles, circles and triangles.

See https://discourse.threejs.org/t/circular-control-used-for-walkable-areas-control/14057

The absolute size of the control can be changed with the display size of the browser. The 3D scene is not affected. The center circle of the control is used to move the control. A double click on it shows the forward speed in the new version. This can be changed with the slider. Another double-click on the center of the control hides the speed again.

The Gltf 3D model of the viewer can look at his feet and see himself completely in the mirror.

Separate folders are available for materials, 3D objects, frames, environment texture.

The sample images often show the control texture. Here you can see the variants of the determination of the uv-values for the use of sections of a texture. The few other textures were either downloaded (free), photographed by myself or created with the graphics program Krita https://krita.org/ . Since I am not a painting artist, they are quite simple.

Read the docs 
showroomDesignEN.pdf or  showroomDesignDE.pdf in the folder.


