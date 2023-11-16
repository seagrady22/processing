/*
	Submission for @sableRaph's #WCCChallenge
	Topic: Stained Glass
	
	Author: Ahmad Moussa || Gorilla Sun
	

	!!!! It can take a couple of seconds to generate an Image !!!!

	A short note:
  I didn't write all of this code for the challenge specifically,
	but having worked on the bowyer-watson algo for Delaunay Triangulation coincidentally came in very useful.

  While working on the Delaunay triangulation code I also learned that you can
	at the same time derive a Voronoi tesselation. Both of which make for a great stained glass effect.
	
	A quick google of 'p5js stained glass' also led me to find
	this resource:

  https://www.deconbatch.com/2020/06/looking-through-stained-glass-darkly.html

  Which does a formidable job at recreating stained glass! So here's my attempt with the code I've written!
*/


// set to true for delaunay triangulation, otherwise uses voronoi tesselation
let delaunayMode = false

// set to true to ignore underlying image and color at random from palette
// makes for more of a paper-like effect
let colorMode = false

// specifies if the tiles have a gradient or only a single color
let gradientMode = true

// Roni's TEN palette (just works well with everything)
palette = ["#fffbe6", "#050505", "#abcd5e", "#29ac9f", "#14976b", "#b3dce0", "#62b6de", "#2b67af", "#f589a3", "#ef562f", "#fc8405", "#f9d531"]


// load in an image so we can get the underlying colors [img5, img6, img7, img8]
let img;
function preload(){
  img = loadImage('img8.jpg')
}


function setup(){
  w = min(windowWidth, windowHeight)
  wx = w*1
  wy = w*1
  createCanvas(wx, wy)

  ctx = canvas.getContext('2d')

  ctx.shadowColor = 'black';
  ctx.shadowBlur = 25;

  // create a large initial super triangle in which all the points
  // will be contained. Needed for Delaunay triangulation
  A = {x: -wx, y: -wy}
  B = {x: wx*2, y: -wy}
  C = {x: wx/2, y: wy*2}

  superT = new makeTriangle([A, B, C], true)
  superT.makeEdges()

  // add lots of points inside the triangle
  pointList = []
  for(let n = 0; n < 1000; n++){
    pointList.push(randomInTriangle(A, B, C))
  }

  // draw image to canvas so we can get colors
  image(img,-100,-100,w+100,w+100)

  // apply blur filter to soften the colors a bit
  filter(BLUR, 5)

  // create Delaunay Triangulation
  noFill()
  noStroke()
  strokeJoin(ROUND)
  triangleList = []
  triangleList = bowyerWatson(pointList, superT)

  if(delaunayMode){
    triangleList.forEach(
      (tri, i) => {
        genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        //fill(random(palette))
        noFill()
        tri.display()
      }
    )
  }else{
    makeVoronoi2(pointList, triangleList)
    makeVoronoi(triangleList)
  }

  filter(BLUR, 2)

  granulate(50)
  noLoop()
}


/* ~~~ END SETUP ~~~ */


// helper function that returns a random coordinate within a given triangle
// needed to place the initial points
function randomInTriangle(p1,p2,p3){
  let r1 = random(), r2 = random()
  let x = (1 - sqrt(r1)) * p1.x + (sqrt(r1) * (1 - r2)) * p2.x + (sqrt(r1) * r2) * p3.x
  let y = (1 - sqrt(r1)) * p1.y + (sqrt(r1) * (1 - r2)) * p2.y + (sqrt(r1) * r2) * p3.y

  return {x: x, y: y}
}

// El-granulator
function granulate(gA) {
  loadPixels();
  let d = pixelDensity();
  let halfImage = 4 * (width * d) * (height * d);
  for (let ii = 0; ii < halfImage; ii += 4) {
    grainAmount = random(-gA, gA);
    pixels[ii] = pixels[ii] + gA;
    pixels[ii + 1] = pixels[ii + 1] + grainAmount;
    pixels[ii + 2] = pixels[ii + 2] + grainAmount;
    pixels[ii + 3] = pixels[ii + 3] + 255;
  }
  updatePixels();
}

