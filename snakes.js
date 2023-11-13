var P = []
var t = 0;
var DIV = 30;
function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB)
  rectMode(CENTER)
}

function draw() {
  blendMode(BLEND)
  background(0, .01)
  fill(255)
  noStroke()
  if(t%DIV==0){
    for(y = 0; y < height; y += DIV){
      for(x = 0; x < width; x += DIV){
        P[(y/DIV*int(width/DIV))+(x/DIV)+((t/DIV)%4)*int(width*height/(DIV**2))] = {x:x, y:y, l:0, p:0, c:noise(x,y)*720%360}
      }
    }
  }
  t++
  blendMode(ADD)
  ratio = 1 / 8
  P.forEach(e =>{
    e.l++
    e.p+=random(1)>.95?1:0
    angle = noise(e.x/99, e.y/99, t/999)*9
    X = e.x + cos(e.y * ratio)*cos(angle)
    Y = e.y + sin(e.x * ratio)*sin(angle) + tan(e.p/99)*9
        
    fill(e.c, 60, 100, (e.l/360))
    square(X, Y, max(0,(5 - e.l/30)));
    e.x = X
    e.y = Y
  })
}
