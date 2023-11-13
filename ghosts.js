// By Roni Kaufman
// inspired by https://twitter.com/dmitricherniak/status/1214888292421951488?s=09

let particles = [];
let circles = [];
let squiggliness = 1/500;
let interval;
let margin = 20;
let theEnd = false;
let r = 200;
let noiseFactor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  noStroke();
  
  background(0);
  updateParticles();
	
	noiseFactor = random(10, 50);
  
  interval = setInterval(updateParticles, 2500);
}

function draw() {
	if (theEnd) {
		noLoop();
	} else {
		for (let p of particles) {
			p.draw();
			p.move();
		}
	}
}

function updateParticles() {
  particles = [];
	let xCenter = width/2;
	let yCenter = height/2;
	let n = r*10;
  for (let i = 0; i < n; i++) {
		let theta = map(i, 0, n, -PI, PI);
    let x_ = xCenter + r*cos(theta);
    let y_ = yCenter + r*sin(theta);
		let s_ = 1;
    particles.push(new Particle(x_, y_, s_));
  }
	r -= 20;
	if (r < 40) {
		clearInterval(interval);
		theEnd = true;
	}
}

function Particle(x_, y_, s_) {
  this.x = x_;
  this.y = y_;
  this.size = s_;
	
  this.alpha = 100;
  this.dist = 1.2;
  
  this.move = function() {
    let theta = noise(this.x * squiggliness, this.y * squiggliness)*PI*noiseFactor;
    let v = p5.Vector.fromAngle(theta, this.dist);
    this.x += v.x;
    this.y += v.y;
    //this.dist *= 0.999;
    this.alpha *= 0.985;
		this.size *= 0.985;
  }
  
  this.draw = function() {
    fill(100, this.alpha);
    circle(this.x, this.y, this.size);
  }
}

function intersectsWithOtherCircles(x_, y_, r_) {
	for (let c of circles) {
		if (dist(c.x, c.y, x_, y_) < c.r + r_ + margin) {
			return true;
		}
	}
	circles.push({x: x_, y: y_, r: r_});
	return false;
}
