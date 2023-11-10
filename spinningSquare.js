var a = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	noFill();

}

function draw() {
	background(0);
	stroke(255, 127);
	translate(width / 2, height / 2);

	for (let i = 0; i < 640; i++) {
		rectMode(CENTER);
		rotate(PI * a);
		rect(i, i, 200);
		a+=0.0000001;
	}
}
