let f = 0;

function setup() {
	createCanvas(400, 400, WEBGL);
	noStroke();
}

function draw() {
	let n = 0;
	let m = 0;
	let i = TAU;
	background(0);
	rotateX(f);

	while (i > 0) {
		push();
		i -= PI / 256;
		let C = (f - i) * 2;
		let Q = abs(sin(C + f)) * 400;
		rotate(i);
		translate(90, 0, 0);
		rotateY(C);
		fill(Q);
		if (n++ % 4 === 0) {
			torus(40, 1, 36);
			fill(0);
			torus(35, 2)
		}
		fill(Q, 12);
		if (m++ % 99 === 0) sphere(1000, 4, 26); // Dynamic background
		pop();
	}

	f += 0.01;
}
