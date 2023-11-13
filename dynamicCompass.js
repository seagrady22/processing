// By Roni Kaufman
// inspired by the artwork on Coldplay's album "A Heart Full of Dreams"

//noprotect

let radius = 30; // radius of the circles
let N = 6;
let nCircles = 9;
let count;
let arcLengths = [];
let arcSpeeds = [];
let colorWheel; // a p5.Render object used to store and display a color wheel

function setup() {
  createCanvas(600, 600);
  stroke(255);
  strokeWeight(3);
  noFill();
  
  createArcs();
  createColorWheel();
}

function draw() {
  background(30);
  
  count = 1;
  
  translate(width/2, height/2);
  let start = arcSpeeds[0]*frameCount;
  let end = start + arcLengths[0];
  arc(0, 0, 2 * radius, 2 * radius, start, end);
  count++;
  for (let i = 0; i < nCircles; i++) {
    drawCircles(i);
  }
  
  addColor();
}

// Draws the (N*n) circles on the nth hexagon
function drawCircles(n) {
  let X = [];
  let Y = [];
  
  for (let i = 0; i < (N+1); i++) {
    let v = p5.Vector.fromAngle((i*2*PI)/N, n*radius);
    X.push(v.x);
    Y.push(v.y);
  }
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < n; j++) {
      let t = j/n;
      let x = t*X[i] + (1-t)*X[i+1];
      let y = t*Y[i] + (1-t)*Y[i+1];
      let start = arcSpeeds[count]*frameCount;
      let end = start + arcLengths[count];
      arc(x, y, 2 * radius, 2 * radius, start, end);
      count++;
    }
  }
}

// Initializes the parameters for the arcs
function createArcs() {
  for (let i = 0; i < (2 + N*nCircles*(nCircles-1)/2); i++) {
    arcLengths.push(random(PI/6, 11*PI/6));
    arcSpeeds.push(random(-0.08, 0.08));
  }
}

// Creates a color wheel and stores it
// in the global variable colorWheel
function createColorWheel() {
  colorWheel = createGraphics(width, height);
  var hue, sat;
  var v;
  var xCenter = width/2;
  var yCenter = height/2;
  colorWheel.noStroke();
  colorWheel.colorMode(HSB, 100);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      v = createVector(i-xCenter, j-yCenter);
      hue = map(v.heading(), -PI, PI, 0, 100);
      sat = 85;
      colorWheel.stroke(hue, sat, 100);
      colorWheel.point(i, j);
    }
  }
  colorWheel.filter(BLUR, 3);
}

// Adds the color wheel as background
function addColor() {
  blendMode(DARKEST);
  
  image(colorWheel,-width/2,-height/2);
  
  blendMode(BLEND);
}
