const PHI = (1+Math.sqrt(5))*0.5;

var spd = 10;

let XR,YR;

let a,b;

let select,sv,ss,rb,pts,timer=0;

let points = [];
let func = (x)=>{return Complex.sin(x)};

// Variables for FFT
let song;
let fft;
let spectra = [];
let mic; 
let index;

function setup() {
	// Getting microphone input
	mic = new p5.AudioIn();

	// Getting FFT from p5js
	fft = new p5.FFT(0.5, 64);
	
	mic.start();
	mic.connect(fft);
	
	createCanvas(windowWidth, windowHeight);
	XR = width*0.015;
	YR = height*0.015;
	a=new Complex(2,3);
	b=new Complex(-1,4);
	resetPoints();
	strokeWeight(5);
	ss = createSlider(-5,5,1,0.5);
	ss.position(20,185);
	pts = createCheckbox('Colored dots', false);
	pts.position(20,210);
	pts.style('font','20px Arial');
	pts.style('color','white');
	
	rb = createButton('Reset Transformation (R)');
	rb.style('font','15px Arial');
	rb.position(20,250);
	rb.mousePressed(resetPoints);
	
	select = createSelect();
	select.position(20,20);
	select.option("y=x^2");
	select.option("y=x^2+8x");
	select.option("y=x^3");
	select.option("y=x^3/5");
	select.option("y=x^4");
	select.option("y=x^4/50");
	select.option("y=x^5");
	select.option("y=x^5/500");
	select.option("y=x^6");
	select.option("y=x^6/5000");
	select.option("y=x+5");
	select.option("y=sin(x)");
	select.option("y=cos(x)");
	select.option("y=tan(x)");
	select.option("y=sec(x)");
	select.option("y=csc(x)");
	select.option("y=cot(x)");
	select.option("y=sinh(x)");
	select.option("y=cosh(x)");
	select.option("y=tanh(x)");
	select.option("y=sech(x)");
	select.option("y=csch(x)");
	select.option("y=coth(x)");
	select.option("y=cis(x) (y=e^ix)");
	select.option("y=sinc(x)");
	//select.option("y=arctan(x)");
	select.option("y=sin^2(x)");
	select.option("y=tan(x)*sec(x)");
	select.option("y=cos(x)-x");
	//select.option("y=sin(x^2)");
	select.option("y=mag(x)");
	select.option("y=arg(x)");
	select.option("y=ln(x)");
	select.option("y=4ln(x)");
	select.option("y=sqrt(x)");
	select.option("y=sqrt(sin(x))");
	select.option("y=5sqrt(x)");
	select.option("y=cbrt(x)");
	select.option("y=5cbrt(x)");
	select.option("y=real(y)=abs(real(x)),imag(y)=abs(imag(x))");
	select.option("y=real(y)=abs(real(sin(x))),imag(y)=abs(imag(sin(x)))");
	select.option("y=e^x");
	select.option("y=x^x");
	select.option("y=x^x/100");
	select.option("y=x^i");
	select.option("y=i^x");
	select.option("y=2^x");
	select.option("y=e^x-x");
	select.option("y=2^x-x");
	select.option("y=x^-i");
	select.option("y=x^(1+i)");
	select.option("y=(x^(1+i))*0.1");
	select.option("y=(2-i)x");
	select.option("y=ix");
	select.option("y=x/i");
	select.option("y=i/x");
	select.option("y=-x");
	select.option("y=(1+i)x");
	select.option("y=(-1-5i)x")
	select.option("real(y)=imag(x),imag(y)=real(x)");
	select.option("real(y)=2*real(x)");
	select.option("y=x^2/mag(x)");
	select.option("y=1/x");
	select.option("y=e^(-x^2)");
	select.option("y=sqrt(1-x^2)");
	select.option("y=sqrt(x)+sqrt(-x)");
	select.option("y=3(sqrt(x)+sqrt(-x))");
	select.option("y=zeta(x)");
	select.option("y=F_x");
	select.option("y=x! (y=gamma(x+1))");
}

function draw() {
	
	//this will grab our spectrum from the mic input for later mod
  let spectrum = fft.analyze();
	spectra.push(new Spectrum(spectrum));
	if (spectra.length > 30) {
		spectra.splice(0, 1);
	}
	
	spd = 10**ss.value();
	background(0,255);
	noFill();
	if (pts.checked()) {
		colorMode(HSB);
		strokeWeight(10);
	} else {
		stroke(250,245,120,200);
		strokeWeight(7);
	}
	
	// begin complex transformation for each point in the grid:
	for (let i in points) {
		i=Number(i);
		let transformed_c = func(points[i].val);
		points[i].x =	lerp(points[i].x,transformed_c.renderPos().x,min(1,timer**2*0.000001*spd));
		points[i].y =	lerp(points[i].y,transformed_c.renderPos().y,min(1,timer**2*0.000001*spd));
		if (pts.checked()) {
			let col = color( 
				(Complex.arg(points[i].val).re+PI)/TAU*360,
				100-points[i].val.mag().re*14,
				100,
			);
			
			col.setAlpha(0.5);
			stroke(col);
			point(points[i].x, points[i].y);
		} else {
			if (i==0) {beginShape();}
			else if (i%(Math.ceil(XR)*2-1)==0) {
				endShape();
				beginShape();
			}
			vertex(points[i].x, points[i].y);
		}
	}
	
	//end transformation
	
	/*begin FFT Modulation
	for (j = 0; j < spectra.length; j++) {
		let spec = spectra[j].getSpectrum();
		
		for (i = 0; i < 32; i += 1) {
			
			adjust = (i + 1) * (i * 1) / 90; 
			
			let h = map(spec[i] * adjust, 0, 255, 0, hh);
			
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
			
		}
	}
	end fft mod*/
	
	//for lines only:
	colorMode(RGB);
	if (!pts.checked()) {
		for (let i in points) {
			if (i<(ceil(XR)*2-1)) {
				continue;
			}
			line(points[i-(ceil(XR)*2-1)].x, points[i-(ceil(XR)*2-1)].y, points[i].x, points[i].y);
			if (i>points.length-(ceil(XR)*2-1)) 
				line(points[i-1].x, points[i-1].y, points[i].x, points[i].y);
		}
	}
	noStroke();
	a = Complex.reverseRenderPos(mouseX,mouseY);
	b=func(a,2);
	let apos = a.renderPos();
	let bpos = b.renderPos();
	fill(255,100,100);
	ellipse(apos.x,apos.y,20,20);
	fill(100,255,100);
	ellipse(bpos.x,bpos.y,20,20);
	fill(250);
	textSize(25);
	text("Red point: "+a.toString(),20,80);
	text("Green point (transformed): "+b.toString(),20,140);
	textSize(20);
	text("Speed",160,200);
	if (sv!=select.value()) {
		resetPoints();
		switch (select.value()) {
			case "y=x^2":
				func = x=>(Complex.pow(x,2));
				break;
			case "y=x^2/mag(x)":
				func = x=>Complex.div(Complex.pow(x,2), x.mag());
				break;
			case "y=x+5":
				func = x=>(Complex.addnums(x,5,0));
				break;
			case "y=x^2+8x":
				func = x=>(Complex.add(Complex.pow(x,2),Complex.multnums(x,8,0)));
				break;
			case "y=x^3":
				func = x=>(Complex.pow(x,3));
				break;
			case "y=x^3/5":
				func = x=>Complex.mult(Complex.pow(x,3), new Complex(0.2,0));
				break;
			case "y=x^4":
				func = x=>(Complex.pow(x,4));
				break;
			case "y=x^4/50":
				func = x=>Complex.mult(Complex.pow(x,4), new Complex(0.02,0));
				break;
			case "y=x^5":
				func = x=>(Complex.pow(x,5));
				break;
			case "y=x^5/500":
				func = x=>Complex.mult(Complex.pow(x,5), new Complex(0.002,0));
				break;
			case "y=x^6":
				func = x=>(Complex.pow(x,6));
				break;
			case "y=x^6/5000":
				func = x=>Complex.mult(Complex.pow(x,6), new Complex(0.0002,0));
				break;
			case "y=(2-i)x":
				func = x=>(Complex.multnums(x,2,-1));
				break;
			case "y=(1+i)x":
				func = x=>(Complex.multnums(x,1,1));
				break;
			case "y=ix":
				func = x=>(Complex.multnums(x,0,1));
				break;
			case "y=x/i":
				func = x=>(Complex.div(x,Complex.I()));
				break;
			case "y=i/x":
				func = x=>(Complex.div(Complex.I(),x));
				break;
			case "y=-x":
				func = x=>(Complex.multnums(x,-1,0));
				break;
			case "y=(-1-5i)x":
				func = x=>(Complex.multnums(x,-1,-5));
				break;
			case "y=sin(x)":
				func = x=>(Complex.sin(x));
				break;
			case "y=sin^2(x)":
				func = x=>(Complex.pow(Complex.sin(x),2));
				break;
			case "y=sin(x^2)":
				func = x=>(Complex.sin(Complex.mult(x,x)));
				break;
			case "y=cos(x)":
				func = x=>(Complex.cos(x));
				break;
			case "y=tan(x)":
				func = x=>(Complex.tan(x));
				break;
			case "y=sec(x)":
				func = x=>(Complex.sec(x));
				break;
			case "y=tan(x)*sec(x)":
				func = x=>Complex.mult(Complex.tan(x),Complex.sec(x));
				break;
			case "y=csc(x)":
				func = x=>(Complex.csc(x));
				break;
			case "y=cot(x)":
				func = x=>(Complex.cot(x));
				break;
			case "y=sinh(x)":
				func = x=>(Complex.sinh(x));
				break;
			case "y=cosh(x)":
				func = x=>(Complex.cosh(x));
				break;
			case "y=tanh(x)":
				func = x=>(Complex.tanh(x));
				break;
			case "y=sech(x)":
				func = x=>(Complex.sech(x));
				break;
			case "y=csch(x)":
				func = x=>(Complex.csch(x));
				break;
			case "y=coth(x)":
				func = x=>(Complex.coth(x));
				break;
			case "y=arctan(x)":
				func = x=>(Complex.arctan(x));
				break;
			case "y=sinc(x)":
				func = x=>(Complex.sinc(x));
				break;
			case "y=cis(x) (y=e^ix)":
				func = x=>(Complex.cis(x));
				break;
			case "y=mag(x)":
				func = x=>(x.mag());
				break;
			case "y=ln(x)":
				func = x=>(Complex.ln(x));
				break;
			case "y=4ln(x)":
				func = x=>(Complex.multnums(Complex.ln(x),4,0));
				break;
			case "y=e^x":
				func = x=>(Complex.exp(x));
				break;
			case "y=x^x":
				func = x=>(Complex.cPow(x,x));
				break;
			case "y=x^x/100":
				func = x=>Complex.mult(new Complex(0.01,0), Complex.cPow(x,x));
				break;
			case "real(y)=abs(real(x)),imag(y)=abs(imag(x))":
				func = x=>(Complex.abs(x));
				break;
			case "y=arg(x)":
				func = x=>(Complex.arg(x));
				break;
			case "y=real(y)=abs(real(sin(x))),imag(y)=abs(imag(sin(x)))":
				func = x=>(Complex.abs(Complex.sin(x)));
				break;
			case "y=sqrt(x)":
				func = x=>(Complex.cPow(x,new Complex(0.5,0)));
				break;
			case "y=sqrt(sin(x))":
				func = x=>Complex.cPow(Complex.sin(x),new Complex(0.5,0));
				break;
			case "y=5sqrt(x)":
				func = x=>(
					Complex.multnums(
						Complex.cPow(x,new Complex(0.5,0)),5,0
					)
				);
				break;
			case "y=x^i":
				func = x=>(Complex.cPow(x,Complex.I()));
				break;
			case "y=i^x":
				func = x=>(Complex.cPow(Complex.I(),x));
				break;
			case "y=x^-i":
				func = x=>(Complex.cPow(x,Complex.MINUS_I()));
				break;
			case "y=x^(1+i)":
				func = x=>(Complex.cPow(x,new Complex(1,1)));
				break;
			case "y=(x^(1+i))*0.1":
				func = x=>(Complex.multnums(Complex.cPow(x,new Complex(1,1)), 0.1,0));
				break;
			case "y=1/x":
				func = x=>(Complex.div(Complex.ONE(),x));
				break;
			case "y=2^x":
				func = x=>(Complex.cPow(Complex.TWO(),x));
				break;
			case "real(y)=imag(x),imag(y)=real(x)":
				func = x=>(new Complex(x.im,x.re));
				break;
			case "real(y)=2*real(x)":
				func = x=>(new Complex(x.re*2,x.im));
				break;
			case "y=zeta(x)":
				func = x=>(Complex.zeta(x));
				break;
			case "y=x! (y=gamma(x+1))":
				func = x=>(Complex.gamma(Complex.addnums(x,1,0)));
				break;
			case "y=sqrt(1-x^2)":
				func = x=>Complex.sqrt(Complex.sub(
					Complex.ONE(),Complex.pow(x,2)
				));
				break;
			case "y=sqrt(x)+sqrt(-x)":
				func = x=>Complex.add(
					Complex.sqrt(x), 
					Complex.sqrt(
						Complex.multnums(x,-1,0)
					)
				);
				break;
			case "y=3(sqrt(x)+sqrt(-x))":
				func = x=>Complex.multnums(
					Complex.add(Complex.sqrt(x), Complex.sqrt(Complex.multnums(x,-1,0))),
					3,0);
				break;
			case "y=cbrt(x)":
				func = x=>Complex.cPow(x,new Complex(1/3,0));
				break;
			case "y=5cbrt(x)":
				func = x=>Complex.multnums(Complex.cPow(x,new Complex(1/3,0)),5);
				break;
			case "y=2^x-x":
				func = x=>Complex.sub(Complex.cPow(Complex.TWO(),x), x);
				break;
			case "y=e^x-x":
				func = x=>Complex.sub(Complex.exp(x), x);
				break;
			case "y=cos(x)-x":
				func = x=>Complex.sub(Complex.cos(x), x);
				break;
			case "y=e^(-x^2)":
				func = x=>Complex.exp(
					Complex.mult(
						Complex.mult(Complex.MINUS_ONE(),x),
						x
					)
				);
				break;
			case "y=F_x":
				func = x=>Complex.F_(x);
				break;
		}
	}
	sv = select.value();
	timer++;
}

function resetPoints() {
	points = [];
	timer = 0;
	for (let y = Math.ceil(-YR);y<Math.ceil(YR);y++) {
		for (let x = Math.ceil(-XR);x<Math.ceil(XR);x++) {
			let cPoint = new Complex(x*0.3,y*0.3)
			points.push({
				val:cPoint.copy(),
				x:cPoint.renderPos().x,
				y:cPoint.renderPos().y
			});
		}
	}
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

function keyPressed() {
	if (keyCode === 82) {
		resetPoints();
		return false;
	}
}
