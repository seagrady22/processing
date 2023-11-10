//jeff jones

//cells need to move forward
//and be able to "deposit"
//position, direction,

function rotate2D(v, theta) {
  return createVector(
    v.x * cos(theta) - v.y * sin(theta),
    v.x * sin(theta) + v.y * cos(theta)
  )
}

function WrapValue(n, mod) {
  return (n + mod) % mod;
}


class Cell {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.dir = p5.Vector.random2D().setMag(1);
    this.angle = PI / 4;
    this.size = 1;
  }

  Update() {
    let found = this.Smell();
    this.Move();
  }

  Smell() {
    let i;//index of pixel 'smell' position
    let F, FL, FR;
    
    //Front direction, left and right offset by distance
    let offsetDirection = this.dir.copy().setMag(offsetLength);
    const leftVector = rotate2D(offsetDirection, -PI * .25);
    const rightVector = rotate2D(offsetDirection, PI * .25);
    const Fdir = createVector(WrapValue(this.pos.x + offsetDirection.x, width), WrapValue(this.pos.y + offsetDirection.y, height));
    const FLdir = createVector(WrapValue(this.pos.x + leftVector.x, width), WrapValue(this.pos.y + leftVector.y, height));
    const FRdir = createVector(WrapValue(this.pos.x + rightVector.x, width), WrapValue(this.pos.y + rightVector.y, height));

    //get pixel values from the texture
    //uses the pixel density offsets to get the values
    i = 4 * d * (floor(Fdir.y) * d * width + floor(Fdir.x));
    F = pixels[i];

    i = 4 * d * (floor(FLdir.y) * d * width + floor(FLdir.x));
    FL = pixels[i];

    i = 4 * d * (floor(FRdir.y) * d * width + floor(FRdir.x));
    FR = pixels[i];

    //This is directly from the paper
    if (F > FL && F > FR) {
      return true;
    } else if (F < FL && F < FR) {
      if (random() < .5) {
        this.TurnLeft();
        return true;
      } else {
        this.TurnRight();
        return true;
      }
    } else if (FL < FR) {
      this.TurnRight();
      return true;
    } else if (FR < FL) {
      this.TurnLeft();
      return true;
    } else {
      return false;
    }
    return false;

  }
  TurnLeft() {
    this.dir.rotate(-this.angle);
  }

  TurnRight() {
    this.dir.rotate(this.angle);
  }

  Move() {
    this.pos.x = (this.pos.x + this.dir.x + width) % width;
    this.pos.y = (this.pos.y + this.dir.y + height) % height;
  }
}

let c = [];
let d;

let offsetLength;
let rectSize;

let tContext;
let tScreen;
let sourceBlack;
function preload(){
  
  sourceBlack = loadFont('SourceSerifPro-Black.ttf');
}

function setup() {
  d = pixelDensity();
  createCanvas(450, 450);
  
  tContext = createGraphics(width,height);
  tContext.background(0);
  tContext.fill(255,240);
  tContext.noStroke();
  tContext.textFont(sourceBlack);
  tContext.textSize(height);
  tContext.textAlign(CENTER);
  tContext.text("A",width*.5,height*.8);
  
  
  background(0);

  for (let i = 0; i < 4000; i++) {
    c.push(new Cell(random(width), random(height)));
  }
  
  
  offsetSlider = createSlider(0, 50, 5);
  rectSize = createSlider(0, width,0);

  letterSlider = createSlider(0,25,0);
  prevLetter = letterSlider.value();
}


/* The annoying as fuck pixel array reference code
  where d is density
  const i = 4 * d*(mouseY * d*width + mouseX);
  console.log(pixels[i],pixels[i+1],pixels[i+2]);
*/
function draw() {
 // background(0, 2);
  loadPixels();
  offsetLength = offsetSlider.value();

  for (let i = 0; i < c.length; i++) {
    c[i].Update();
  }

  drawCells(c);
  
  if ( mouseIsPressed){
    push();
    fill(0);
    circle(mouseX,mouseY,50)
    pop();
  }
  
  push();
  rectMode(CENTER);
  fill(0,200);
  translate(width*.5,height*.5);
  rotate(frameCount*.005);
  rect(0,0, rectSize.value());
  pop();
  
  blendMode(MULTIPLY);
  image(tContext,0,0);
  blendMode(BLEND);
  
  //do a slider check, messy
  if (prevLetter != letterSlider.value()){
    prevLetter = letterSlider.value();
    changeLetter(tContext,letterSlider.value());
  }

}

//65 is A
function changeLetter(ctx,value){
  const character = char(65+value);
  background(0);
  ctx.background(0);
  ctx.text(character,width*.5,height*.8);
}

function drawCells(cells) {
  fill(240,252,17);
  noStroke();
  for (let i = 0; i < cells.length; i++) {

    circle(c[i].pos.x, c[i].pos.y, c[i].size+1);
  }
}
