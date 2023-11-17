// Variables for FFT
let song;
let fft;
let spectra = [];
let mic; 
let index;
let FRAME_RATE = 15;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	
  // Create an Audio input
  mic = new p5.AudioIn();

	// Getting FFT from p5js
	fft = new p5.FFT(0.5, 64);
	
  mic.start();
	mic.connect(fft);
	
  var volume = mic.getLevel();
	
	
	// Runs slower 
	frameRate(FRAME_RATE);
	
}

function draw() {
	circle(mouseX, mouseY, 20);
}
