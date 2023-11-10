// Copyrigths PIZZA PUNK Jerome Mercier 
// art@pizza-punk.com

let x=0;
function setup() {
  createCanvas(510, 990);
  background(10);
}

function display(a,b,t){
  stroke(255,200);
  line(a,b+20,a+3,b+20);
  noStroke();
  fill(80);
  rect(-10,50,420,15);
  fill(255);
  textAlign(RIGHT);
  text('y = '+t,0,52,400);
  translate(0,60);
  fill(255);
  stroke(255);
}

function oscillMath(){
  t = 'sin(x*.1)*20';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'x%10+2';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = '-x%10+10';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'abs(sin(x*.1))*20-5';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'abs(sin(PI/2 + x*.1))*20';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'ceil(sin(x*.1))*10';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'log(x)*3';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'abs(cos(x*.1))*15+sin(x*.1)*10';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = '8+sin(x*.1)*10 % 5';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = '8 + sin(x*.1)*10 + -cos(x*.1)*10 % 5';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'abs(sin(PI/3 - x*.1))*20';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'ceil(cos(x*.1))*10 - sin(x*.1)*10';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'ceil(sin(x*.1))*10';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'round(sin(-x*.1))*10';
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'constrain(sq(sin(PI/2+x*.1))*10,3,7)' ;
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
  
  t = 'constrain(ceil(cos(x*.1))*10 - sin(x*.1)*10,2,8)' ;
  posy = eval(t);
  t = new String(t);
  display(posx,posy,t);
}

function draw() {
  x++;
  if(x>400) x=0;
  background(10,1);
  
  stroke(255,250);
  
  strokeWeight(1);
  translate(20,20);
  push();
  translate(30,0);
  posx = cos(x*.1)*10;
  oscillMath();
  pop();
  
  push();
  translate(50,0);
  posx = x;
  oscillMath();
  pop();
}
