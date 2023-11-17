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
	
	E = new p5.PeakDetect(20,288,0.35, FFP);
	F = new p5.PeakDetect(144,720, 0.35, FFP);
	W = new p5.PeakDetect(570, 1440, 0.35, FFP);
	A = new p5.PeakDetect(1296, 11520, 0.35, FFP);
	
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
	
	//add the new values from the FFT
	spectra.push(new Spectrum(spectrum));
	
	//cap at max len insert new at begin & delete 1
	if (spectra.length > SPEC_MAX_LEN) {
		let deleteCount = 1; let startIndex = 0;
		spectra.splice(startIndex, deleteCount);
	}
	
		//strokeWeight(1);
	//noStroke();
	for (j = 0; j < spectra.length; j++) {
		let spec = spectra[j].getSpectrum();
		
		for (i = 0; i < 128; i += 1) {
			
			adjust = (i + 1) * (i * 1) / 90; 
			
			let hh = 3;
			let h = map(spec[i] * adjust, 0, 255, 0, hh);
			
			print(h);
			
			if (h > 10)
				{
					drawRandomShape();
					
				}
			/*
			stroke(100, 0, 0);
			fill((i)*2, 100, 100);
			//ambientMaterial();
			// use specular material with high shininess
  		//specularMaterial((i+2)*10,  0, 0);
 			//shininess(50);
			push();
			//noStroke();
			translate(i, j, h/2);
			//rotateX(PI/2);
			//rotateZ(PI/2);
			//cylinder(0.5, h);
			box(0.85, 0.85, h)
			pop();
			*/
		}
	}
	
}

function Earth() {

}

function Fire() {

}

function Water() {

}

function Air() {

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
