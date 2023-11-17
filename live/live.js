// Variables for FFT
let song;
let fft;
let spectra = [];
let mic; 
let index;
let FRAME_RATE = 15;
let FFP = 40;
		
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
	
	E = new p5.PeakDetect(20,288,0.35, FFP);
	F = new p5.PeakDetect(144,720, 0.35, FFP);
	W = new p5.PeakDetect(570, 1440, 0.35, FFP);
	A = new p5.PeakDetect(1440, 11520, 0.35, FFP);
	
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
	circle(mouseX, mouseY, 20);
}

function Earth() {

}

function Fire() {

}

function Water() {

}

function Air() {

}
