# KineticJs Extended (kinetic-ext) Javascript Library
KineticJs Extended "extends" KineticJs, an HTML5 Canvas JavaScript library.

## Key Features
- Layer scene culling support
- Custom draw sort control
- Automated redraws when node's are marked for redraw
- Node transform retrieval capability
- Overridable drag behavior
- Stage view bounds limiting


## Attribution
The library also includes substantial portions of Simon Sarris's Transform Javascript class 

## Licensing
This project is licensed under the MIT license and/or GPL v2 license.

## Contributors
- Eric Rowell and Antoine Proulx for the original KineticJS GitHub source (http://www.kineticjs.com/)
- Simon Sarris for a substantial part of the Kinetic.Transform source code (www.simonsarris.com)
- Yusuf Sasak for the functionality to override default mouse detection methods
- Chris Khoo ([Wappworks Studio](http://www.wappworks.com))

## Build environment
### Requirements
- Apache Ant (http://ant.apache.org/)

### Notes
- The build environment is found under the 'tools' subdirectory. 
- The build pipeline relies on YUI3 compressor (http://yuilibrary.com/projects/yuicompressor/). 
  A version of YUI3 compressor has been integrated into the source package to create an standalone 
  build environment package. 
- By default, the Ant build script 'build/antbuild.xml' builds all the library packages.
  - To build just the source files, use the 'buildcode' target instead.

