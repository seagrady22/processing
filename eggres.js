/**
 * This is an entry for @sableRaph's weekly creative code challenge!
 * The theme this week is "break it down," so I wanted to illustrate
 * the layers inside an ogre.
 *
 * This combines p5 (used for framebuffer feedback) with Shader Park
 * to draw a Shrek via an SDF. Now that p5 has WebGL 2 support, you can
 * use Shader Park SDFs in p5 and even have your p5 shapes draw in front
 * of and behind them!
 * 
 * If you want to try Shader Park in a p5 sketch of your own, make sure
 * to add this library to the list of enabled libraries on OpenProcessing:
 * https://cdn.jsdelivr.net/npm/shader-park-core@0.2.5/dist/shader-park-p5.js
 */

let sdf
let prev, next

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)
	
	// Things to make the sketch run less slow. SDFs can get intense
	setAttributes({ antialias: false })
	pixelDensity(1)
	prev = createFramebuffer()
	next = createFramebuffer()
	
	// `createShaderPark` takes in a function that defines a shape using
	// the tools listed in the Shader Park reference here:
	//   https://docs.shaderpark.com/references-js/
	//
	// Shader park helps you create a *signed distance function shader.*
	// These define shapes by calculating, at a given point in space,
	// how close you are to the surface (hence the name.) These are great
	// for defining complex 3D shapes that change topology over time, and
	// for doing Boolean operations on shapes (including smooth blending!)
	//
	// Later on, we draw the SDF into the scene on a sphere. Consider
	// defining your shape as close as possible to (0,0,0) in your SDF,
	// and then later using P5 to position that in your scene so that your
	// SDF doesn't get cut off at the sides of its bounding sphere.
	//
	// Note that this is not a real function: Shader Park compiles this
	// into a shader for you! So you will not be able to access constants
	// you define outside of the function.
	sdf = createShaderPark(function() {
		const shrek = shape(() => {
			color(0.2, 0.9, 0.3)
			blend(0.35)
			sphere(0.5)
			displace(0, -0.35, 0)
			sphere(0.2)

			for (const side of [0, 1]) {
				reset()
				union()
				rotateY(PI * side)
				displace(0, -0.35, 0)
				blend(0.1)
				displace(-0.35, 0, 0)
				rotateZ(-PI*0.3)
				displace(0, -0.1, 0)
				cylinder(0.05, 0.1)
				displace(0, -0.15, 0)
				blend(0.1)
				cylinder(0.08, 0.01)
				displace(0, -0.01, 0)
			}
		})
		
		lightDirection(0, -1, 0)
		shrek()
		let thickness = 0.05
		expand(-thickness * 1.5)
		for (let i = 0; i < 4; i++) {
			shell(thickness)
			thickness /= 2
		}
		
		reset()
		intersect()
		displace(0, 0, (sin(time*0.8)*0.5 - 0.5))
		box(1, 1, 1)
	})
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function draw() {
	[next, prev] = [prev, next]
	
	next.begin()
	clear()
	
	// Do some video feedback
	push()
	imageMode(CENTER)
	scale(1.01)
	image(prev, 0, 0)
	drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT)
	fill(255, 200, 0, 2)
	noStroke()
	plane(width, height)
	pop()
	drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT)

	// Make Shrek bob
	translate(0, sin(millis()*0.0007) * 50, 0)
	rotateY(0.5 + sin(millis() * 0.0009)*PI*0.1)
	scale(min(width, height) / 300)
	rotateZ(sin(millis()*0.0005)*PI*0.1)
	
	// This bit draws the Shader Park SDF. It does so by
	// drawing a sphere with a shader that renders the SDF.
	// It supports depth checking with other p5 shapes if you
	// want!
	sdf.draw()
	
	next.end()
	
	clear()
	imageMode(CENTER)
	image(next, 0, 0)
}
