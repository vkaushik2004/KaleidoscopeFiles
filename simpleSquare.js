//
// simpleSquare.js
//
// Demonstration of a webgl program built with html and javascript.
// This program displays a square.
// Also needed: simpleSquare.html and the Common folder (and files)
//

// global variable for the drawing area and webgl context
var canvas;
var gl;

var justOne = 0;
 
// When all the files have been read, the window system call the init function that holds our program
// This is an example of an event listener/handler
window.onload = function init()
{
	// document is refering to the document object model (DOM)
	// This allows us to communicate with the HTML web page
	// We are creating a short name for the canvas/drawing space
    canvas = document.getElementById( "gl-canvas" );
    
	// set up to use webgl in the canvas
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
	// webgl functions start with "gl." indicating that they belong to the canvas
	
	// Define part of canvas to draw to using viewport
    // Lower-left in canvas is (0,0) 
	// and grab width and height from HTML document
    gl.viewport( 0, 0, canvas.width, canvas.height);
	// Try this: divide the width and height in half
	
	// background color of canvas
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	//  Load shaders (defined in GLSL code in HTML file)
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	// We will use these shaders from now on
    gl.useProgram( program );
    
	
	// This is the best way to debug -- print to the browser console (F12 to open)
	console.log("create vertices array");
	
	//  Create the square 
	//(The order of the vertices is a little unusual. Explained in render() function below)
	// To start, we will define coordinates within [-1,1] in x and y
	
    var vertices = [
        // vec2(0, 1),
        // vec2(-1, 0),
        // vec2(1, 0),
        // vec2(0, -1)
		//tri one
		vec2(0,-0.15),
		vec2(0,-0.05),
		vec2(-0.05,-0.105),

		//tri2
		vec2(0,-0.05),
		vec2(-0.05,-0.105),
		vec2(-0.05, 0),

		//tri3
		vec2(-0.05,-0.105),
		vec2(-0.05, 0),
		vec2(-0.15,0),

		//tri 4
		vec2(0,-0.15),
		vec2(0,-0.05),
		vec2(0.05,-0.105),
	
		//tri5
		vec2(0,-0.05),
		vec2(0.05,-0.105),
		vec2(0.05, 0),
	
		//tri6
		vec2(0.05,-0.105),
		vec2(0.05, 0),
		vec2(0.15,0),

		//tri 7
		vec2(-0.15,0),
		vec2(-0.05,0),
		vec2(0.15,0.35),

		//tri 8
		vec2(0.15, 0),
		vec2(0.05, 0),
		vec2(-0.15, 0.35),

		//tri 9
		vec2(-0.15, 0.35),
		vec2(-0.11, 0.55),
		vec2(-0.1, 0.29),

		//tri 10 
		vec2(0.15, 0.35),
		vec2(0.11, 0.55),
		vec2(0.1, 0.29)
    ];
	
	// Define colors for each vertex (RGB format)
	var colors = [
		// Triangle 1 (Red)
		vec3(1.0, 0.0, 0.0), // Red for Vertex 1
		vec3(1.0, 0.0, 0.0), // Red for Vertex 2
		vec3(1.0, 0.0, 0.0), // Red for Vertex 3
	
		// Triangle 2 (Green)
		vec3(0.0, 1.0, 0.0), // Green for Vertex 4
		vec3(0.0, 1.0, 0.0), // Green for Vertex 5
		vec3(0.0, 1.0, 0.0), // Green for Vertex 6
	
		// Triangle 3 (Blue)
		vec3(0.0, 0.0, 1.0), // Blue for Vertex 7
		vec3(0.0, 0.0, 1.0), // Blue for Vertex 8
		vec3(0.0, 0.0, 1.0)  // Blue for Vertex 9
	];

	// // Here is an example of how to debug with print statements
	// // Hit F12 in the browser to open the debug window
	// console.log("vertices = ",vertices);
	// console.log("vertex[0] = ",vertices[0]);
	// console.log("vertex[0][0] = ",vertices[0][0]);
	// console.log("vertex[0][1] = ",vertices[0][1]);

    
    // Load the data into the GPU
	// Create memory (buffer) to hold data -- here vertices
	// Bindbuffer identifies that "bufferId" is vertex information
	// Takes 2d vertices and flattens them into a 1d array
	// gl.STATIC_DRAW is an example of a webgl constant
	//    It means we intend to specify data once here and use repeatedly for webgl drawing
	//
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	// Create and bind a buffer for vertex positions
var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

// Associate vertex position buffer with the shader attribute
var vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// Create and bind a buffer for vertex colors
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

// Associate vertex color buffer with the shader attribute
var vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vColor);

    // Associate out shader variables with our data buffer
	// Note that in the vertex shader, the vertex is called vPosition.
	// The var here is the same name to keep the association simple, but it is not necessary
	// 2d points being loaded
	//
    
    // draw 

    justOne = 0;
	render();
	
    /* this is a little play to demo double buffering that occurs when call render -- revisit after doublebuffer ppt */
	/*
	console.log("displayed initially -- wait  and do again")
	setTimeout(function(){render();}, 5000);
	console.log("did it");
	*/
};

function render() {
    // clear the background
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the first triangle (vertices 0, 1, 2)
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // Draw the second triangle (vertices 3, 4, 5)
    gl.drawArrays(gl.TRIANGLES, 3, 3);
    // Draw the third triangle (vertices 6, 7, 8)
    gl.drawArrays(gl.TRIANGLES, 6, 3);
	gl.drawArrays(gl.TRIANGLES, 9, 3);
	gl.drawArrays(gl.TRIANGLES, 12, 3);
	gl.drawArrays(gl.TRIANGLES, 15, 3);
	gl.drawArrays(gl.TRIANGLES, 18, 3);
	gl.drawArrays(gl.TRIANGLES, 21, 3);
	gl.drawArrays(gl.TRIANGLES,24 , 3);
	gl.drawArrays(gl.TRIANGLES,27 , 3);
}
