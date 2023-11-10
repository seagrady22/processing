T = 0;

function draw() {
  T||createCanvas(W=400, W);
  background(0,20);
  for(t=-8; t<8; t+=.001){
    x = 6 * sin(13.58 * (t+T)) * round(sqrt(cos(7.4 * (t+T))))*20+200;
    y = 6 * pow(cos(13.58 * (t+T)), 4) * sin(sin(7.4 * (t+T)))*20+200;
    if(x!=200){
      stroke(255,x,y)
    	point(y,x)
      rect(x*1.65%t*50,T%W,1)
    }
  }
  T+=3
}
