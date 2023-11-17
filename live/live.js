// Variables for FFT
let song;
let fft;
let spectra = [];
let mic; 
let index;
let FRAME_RATE = 60;
let FFP = 1;
let SPEC_MAX_LEN = 30;

//globals
let timeStep = 0;

//the band
let E; let eCount = 0; let eParticles = []; let eRunStep = 0; let eRunning = false; let eRun = 0;
let F; let fCount = 0; let fParticles = []; let fRunStep = 0; let fRunning = false; let fRun = 0;
let W; let wCount = 0; let wParticles = []; let wRunStep = 0; let wRunning = false; let wRun = 0;
let A; let aCount = 0; let aParticles = []; let aRunStep = 0; let aRunning = false; let aRun = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	
  // Create an Audio input
  mic = new p5.AudioIn();

	// Getting FFT from p5js
	fft = new p5.FFT(0.5, 64);
	
	E = new p5.PeakDetect(20,288, 0, FFP);
	F = new p5.PeakDetect(144,720, 0, FFP);
	W = new p5.PeakDetect(570, 1440, 0, FFP);
	A = new p5.PeakDetect(720, 11520, 0, FFP);
	
  E.onPeak(Earth);
	F.onPeak(Fire);
	W.onPeak(Water);
	A.onPeak(Air);
	
  mic.start();
	mic.connect(fft);
	
  var volume = mic.getLevel();
	
	
	// Runs slower 
	frameRate(FRAME_RATE);
	
}

function draw() {
	let spectrum = fft.analyze();
	
  E.update(fft);
	F.update(fft);
	W.update(fft);
	A.update(fft);
	
	//add the new values from the FFT
	spectra.push(new Spectrum(spectrum));
	
	//cap at max len insert new at begin & delete 1
	if (spectra.length > SPEC_MAX_LEN) {
		let deleteCount = 1; let startIndex = 0;
		spectra.splice(startIndex, deleteCount);
	}
	
	//print(timeStep);
	timeStep++;
	
}

function updateParticles(particles, rect)
{
	// update and show the particles
	if (particles.length > 0)
		{
			for(let i=particles.length-2; i>=0; i--) {
			particles[i].update(particles);
			particles[i].show() ;
			if(particles[i].alpha<=2) particles.splice(i, 5); // remove the dead particle
			}
		}
	else
	{
		//create particles in the target area
		for (i = 0; i < rect.width; i++)
			{
				for (j=0; j < rect.height; j++)
					{
						if (getRandomInt(0,100) <12)
							{
							particles.push(new Particle(i, j, 5, 75));	
							}
					}
			} 
		
	}
}

function updateRun(ts, runStep, running, run, particles)
{
	//set prev
	let prev = running;
	
	//but is it running now??
	if ((ts - run) <= 20)
	{
		running = true;
		
		//ok, and if it was, we can add to our run..
		if (running & prev)
		{ 
			run++;
		}
	}
	else
	{
		//otherwise reset
		running = false
		run = 0;
		particles = [];
	}
	
	
	
}

function Earth() {
	//print("Earth" + eCount++ + "  " + eRunStep);
	  //drawRandomShape();
		let rect = retarget();
	  updateParticles(eParticles, rect);
	  updateRun(timeStep, eRunStep, eRunning, eRun, eParticles);
		eRunStep = timeStep;
}

function Fire() {
		//print("Fire"+ fCount++ + "  " + fRunStep);
	  //drawRandomShape();
		let rect = retarget();
		updateParticles(fParticles, rect);
		updateRun(timeStep, fRunStep, fRunning, fRun, fRunStep);
	  fRunStep = timeStep;
}

function Water() {
		//print("Water"+ wCount++ + "  " + wRunStep);
	  //drawRandomShape();
		let rect = retarget();
		updateParticles(wParticles, rect);
	  updateRun(timeStep, wRunStep, wRunning, wRun, wParticles);
	  wRunStep = timeStep;
}

function Air() {
		//print("Air"+ aCount++ + "  " + aRunStep);
	  //drawRandomShape();
		let rect = retarget();
	  updateParticles(aParticles, rect);
	  updateRun(timeStep, aRunStep, aRunning, aRun, aParticles);
	  aRunStep = timeStep;
}

// Define class for Spectrum
class Spectrum {
 constructor(spectrum){
   this.spectrum = spectrum;
 }
 getSpectrum() {
   for(let i=0; i<this.spectrum.length; i++){
     this.spectrum[i]*=0.95;
   }
   return this.spectrum;
 }
}

//particle class
class Particle{
	
	//constructor called when creating an instance of this class
	// x & y are the location, r is the rate of decay, a is the starting alpha value
	constructor(x,y,r,a){
		
		this.location = createVector(x,y) ;
		this.velocity = createVector(random(-1,1),random(-1,1));
		this.acceleration = createVector();
		this.alpha = this.palpha=a ;
		this.amp=3; // size of the particle
		this.rate = r;
	
	}
	
	//update the velociy and location of particle
	update(p){
		this.acceleration.add(createVector((noise(this.location.x)*2-1), (noise(this.location.y)*2-1)));
		this.velocity.add(this.acceleration);
		this.acceleration.set(0,0);
		this.location.add(this.velocity);
		this.alpha -= this.rate ;
		//this.amp-= this.rate ;
		// here is the recursion condition
		//if(this.alpha<=this.palpha*0.25 && this.palpha>10) {
		//	p.push(new Particle(this.location.x, this.location.y, this.rate*0.25, this.palpha*0.5));
		//}
	}
	
	//show the particles
	show(){
		noStroke() ;
		fill(0,35,25, this.alpha) ;
		ellipse(this.location.x, this.location.y, this.amp);
	}
	
} // end Particle class

class Target {
  constructor(xcoord, ycoord, height, width) {
		this.x = xcoord;
		this.y = ycoord;
    this.height = height;
    this.width = width;
  }
}

//let t = new Target(0,0, 1, 1); // creating new instance of Polygon Class.
//console.log(t.width); // prints '1' to the console

function retarget(choice) {
  x = random(width);
  y = random(height);
  w = random(width);
  h = random(height);
  
  return new Target(x, y, w, h);
  
}
	
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
