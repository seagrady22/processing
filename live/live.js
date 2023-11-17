// Variables for FFT
let song;
let fft;
let spectra = [];
let mic; 
let index;
let FRAME_RATE = 15;
let FFP = 40;
let SPEC_MAX_LEN = 30;
//the band
let E;
let F;
let W;
let A;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	
  // Create an Audio input
  mic = new p5.AudioIn();

	// Getting FFT from p5js
	fft = new p5.FFT(0.5, 64);
	
	E = new p5.PeakDetect(20,288, 0, 1);
	F = new p5.PeakDetect(144,720, 0, 1);
	W = new p5.PeakDetect(570, 1440, 0,1);
	A = new p5.PeakDetect(1296, 11520, 0, 1);
	
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
	
}

function Earth() {
		print("Earth")
    drawRandomShape();
}

function Fire() {
			print("Fire")
		drawRandomShape();
}

function Water() {
			print("Water")
		drawRandomShape();
}

function Air() {
		print("Air")
		drawRandomShape();
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

function drawRandomShape(choice) {
  x = random(width);
  y = random(height);
  w = random(5, 100);
  h = random(5, 100);
  
  if (choice == "ellipse") {
    noStroke();
    fill(random(25), random(5), random(255), 50);
    ellipse(x, y, w, h);
  }
  else {
    noStroke();
    fill(random(255), random(255), random(255), 90);
    rect(x, y, w, h);
  }
}
