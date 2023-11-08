function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
}

function draw() {
	//background(0,10)
}
let mode = 1;

function mousePressed(){
	mode ++
	if(mode>3){
	mode=1
	}
}

function mouseMoved(){
	let count = int(random(100,350))
	let r = random(2,20)
	//let delta = abs(pmouseX - mouseX) //絕對值
	//let delta = dist(pmouseX ,pmouseY,mouseX, mouseY)  //兩點之間的距離
	let delta = sqrt(dist(pmouseX ,pmouseY,mouseX, mouseY))*5 //平方根後*5
	for(let i = 0; i<count; i++){
		noStroke()
		if(mode==1){
		fill(random(255),random(200,255), random(100,200))
		}
		else if(mode==2){
		fill(random(200,255),random(255), random(100,200))
		}
		else{
		fill(random(200),random(200), random(100,200))
		}
	
  ellipse(mouseX+random(-delta,delta), mouseY+random(-delta,delta), r)
		r*=0.9
	}
}
