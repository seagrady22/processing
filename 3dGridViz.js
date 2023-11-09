let cam;
let boxSideSize = 4;
let boxesNumber = 40;
let zNoise = 0;
let glContext;
let shadow;
let locations = [];
let names = [
	"les Dômes du Canoît", "The Homeless Tops", "le Dôme du Coloves", "Whitronto Forest",
	"les Puys du Channe", "les Montagnes Flétries", "Blóðgarðr", "les Monts Arides", "Mærland",
	"Thick Range Woodland", "Collared Pygmy Owl Timberland", "Effingset Mountains", "Ámáttrverǫld",
	"Detailed Woodland", "le Puy de Nansart", "Groovy Maple Covert", "Battlerial Heights",
	"Hjǫrrbiǫð", "The Neverending Highlands", "Feigrheimr", "The Grim Hill", "Plarock Hillside",
	"le Dôme Sinistre", "Salisfell Wilds", "Stórrvǫllr", "Corris Hills", "Vauxnigan Grove",
	"Collared Pygmy Owl Forest", "íttbjǫð", "The Severed Pinnacle", "le Puy de la Champimasse",
	"le Piton de la Beaunnet", "Delisrial Woodland", "Nottingholm Bluff", "Chiboucouche Bluff",
	"Freistaknǫttr", "Rúmknǫttr", "le Mont Muet", "Glorious Woodland", "Fǫgnuðrvegr"];
let colors = [
	"#FA0000", "#FA0000", "#FA0000", "#FA0000", "#FA0000", "#FA0000", "#FA0000", "#FA0000",
	"#FA0000", "#FA0000", "#FB2A00", "#FD5500", "#FF8000", "#FFA200", "#FFC400", "#FFE600",
	"#AADC00", "#55D200", "#00C800", "#00DA55", "#00ECAA", "#01FFFF", "#00BFFF", "#0080FF",
	"#0040FF", "#0000FF", "#0000FF", "#0000FF", "#0000FF", "#0000FF", "#0000FF", "#0000FF",
	"#0000FF"];

let colorsLen = colors.length;
let namesLen = names.length;
let myFont;
let waterLevel = 40;
let ground;
let elevation;
let zSpeed = 1; // 1, 0.5, 0.25...
let imgFG;

p5.disableFriendlyErrors = true; // disables FES

function preload () {
	myFont = loadFont("quicksand-book-regular.otf");
	ground = loadImage("texture.png");
	// elevation = loadImage("elevation.png");
	shadow = loadImage("shadow.png");
	imgFG = createImg('elevation.png', 'Elevation Map');
}

function setup () {
	let c = createCanvas(600, 600, WEBGL);
	glContext = c.GL;
	cam = createCamera();
	cam.setPosition(-125, -300, -200);
	cam.lookAt(0, -60, 0);
	textFont(myFont);
	textSize(4);
	textAlign(CENTER, BOTTOM);
	colors.reverse();
	frameRate(30);
	
	// HTML&CSS stuff
	document.body.style.backgroundColor = "rgb(200, 200, 200)";
	document.querySelector("main").style.position = "relative";
	document.querySelector("main").style.marginTop = "0";
	
	// imgFG = createImg('elevation.png', 'Elevation Map');
	let myParent = select('main');
	imgFG.parent(myParent);
	
	const styles1 = {
		position: "absolute",
		width: "200px",
		bottom: "0",
		pointerEvents: "none",
		left: "200px",
		zIndex: "10000"
	}
	Object.assign(document.querySelector('img').style, styles1);
}

function draw () {
	background(200);

	orbitControl(2, 2, 0);
	rotateY(frameCount * 0.002);

	// Shadow
	noStroke();
	push();
	texture(shadow);
	rotateX(PI * 0.5);
	translate(0, 0, -20);
	plane(250);
	pop();
	glContext.clear(glContext.DEPTH_BUFFER_BIT);

	// Locations
	if (Math.random() * 120 > 119) {
		locations.push(new Location(names[Math.floor(Math.random() * namesLen)]));
	}
	let locLen = locations.length - 1;
	for (let i = locLen; i > -1; i -= 1) {
		locations[i].update();
		let isDelete = locations[i].render();
		if (isDelete) {
			locations.splice(i, 1);
		}
	}

	lightFalloff(0.9, 0.001, 0);
	ambientLight(90);
	pointLight(255, 255, 255, 0, -170, 0);

	let zMove = (frameCount * zSpeed) % boxSideSize;
	zNoise = zMove === 0 ? zNoise + 1 : zNoise;
	for (let z = 0; z <= boxesNumber; z += 1) {
		for (let x = 0; x < boxesNumber; x += 1) {
			// The only place worth tweaking (map start/end values)
			let noiseVal = map(
				noise(x * 0.1, (z + zNoise) * 0.1),
				0.1, 0.9, 0, 120, true);

			push();

			let zSizeFront = boxSideSize - zMove;
			let zSizeBack = zMove;

			fill(colors[floor(map(noiseVal, 0, 120, 0, colorsLen - 1))]);
			noiseVal = noiseVal > waterLevel ? noiseVal : waterLevel;

			if (noiseVal > waterLevel) {
				if (z === 0) {
					translate((x * boxSideSize) - (boxesNumber * 0.5) * boxSideSize,
						-noiseVal / 2,
						-(boxSideSize * (boxesNumber * 0.5)) - zMove * 0.5);
					box(boxSideSize, noiseVal, zSizeFront);
					// fill(200);
					rectMode(CORNER);
					translate(-boxSideSize * 0.5, 0, zMove * 0.5 - 2.01);
					texture(ground);
					rect(0, -noiseVal / 2, boxSideSize, noiseVal);

					// Side cross section
					if (x === 0) {
						push();
						// fill(200);
						rectMode(CORNER);
						rotateY(PI * 0.5);
						translate(0.1, 0, -0.1);
						texture(ground);
						rect(0, -noiseVal / 2, -zSizeFront - 0.1, noiseVal);
						pop();
					} else if (x === boxesNumber - 1) {
						push();
						// fill(200);
						rectMode(CORNER);
						rotateY(PI * 0.5);
						translate(0.1, 0, 4.01);
						texture(ground);
						rect(0, -noiseVal / 2, -zSizeFront - 0.1, noiseVal);
						pop();
					}

				} else if (z === boxesNumber) {
					translate((x * boxSideSize) - (boxesNumber * 0.5) * boxSideSize,
						-noiseVal / 2,
						((z - boxesNumber * 0.5) * boxSideSize) - (zMove * 0.5) -
						(boxSideSize * 0.5) -
						0.1);
					box(boxSideSize, noiseVal, zSizeBack);
					// fill(200);
					rectMode(CORNER);
					translate(-boxSideSize * 0.5, 0, zMove * 0.5 + 0.2);
					texture(ground);
					rect(0, -noiseVal / 2, boxSideSize, noiseVal);

					// Side cross section
					if (x === 0) {
						push();
						// fill(200);
						rectMode(CORNER);
						rotateY(PI * 0.5);
						translate(0.1, 0, -0.1);
						texture(ground);
						rect(0, -noiseVal / 2, zSizeBack, noiseVal);
						pop();
					} else if (x === boxesNumber - 1) {
						push();
						// fill(200);
						rectMode(CORNER);
						rotateY(PI * 0.5);
						translate(0.1, 0, 4.01);
						texture(ground);
						rect(0, -noiseVal / 2, zSizeBack, noiseVal);
						pop();
					}

				} else {
					translate((x * boxSideSize) - (boxesNumber * 0.5) * boxSideSize,
						-noiseVal / 2,
						((z - boxesNumber * 0.5) * boxSideSize) - zMove);
					box(boxSideSize, noiseVal, boxSideSize);

					// Side cross section
					if (x === 0) {
						push();
						// fill(200);
						rectMode(CORNER);
						rotateY(PI * 0.5);
						translate(-boxSideSize * 0.5, 0, -2.1);
						texture(ground);
						rect(0, -noiseVal / 2, boxSideSize, noiseVal);
						pop();
					} else if (x === boxesNumber - 1) {
						push();
						// fill(200);
						rectMode(CORNER);
						rotateY(PI * 0.5);
						translate(-boxSideSize * 0.5, 0, 2.1);
						// ambientMaterial(255)
						texture(ground);
						rect(0, -noiseVal / 2, boxSideSize, noiseVal);
						pop();
					}
				}
			}
			pop();
		}
	}

	// if(noiseVal === waterLevel){
	push();
	translate(-boxSideSize * 0.5 + 0.5, -waterLevel * 0.5 - 0.5, -boxSideSize * 0.5);
	lightFalloff(0.1, 0.01, 0);
	specularMaterial(0, 50, 200, 110);
	fill(0, 0, 200, 150);
	let waterSize = boxSideSize * boxesNumber - 2;
	stroke(0, 200, 255);
	box(waterSize, waterLevel - boxSideSize, waterSize);
	pop();

	// Wireframe Box
	noFill();
	strokeWeight(0.5);
	stroke(100);
	push();
	translate(-boxSideSize * 0.5, -boxSideSize * boxesNumber * 0.5, -boxSideSize * 0.5);
	box(boxesNumber * boxSideSize, boxesNumber * boxSideSize, boxesNumber * boxSideSize);
	pop();
}

class Location {
	constructor (pName) {
		this.z = (boxesNumber * boxSideSize) / 2;
		this.y = -(boxesNumber * boxSideSize) + 30;
		this.x = random(boxesNumber * boxSideSize) - ((boxesNumber * boxSideSize) / 2);
		this.name = pName;
	}

	update () {
		this.z -= zSpeed;
		this.y += 0.1;
	}

	render () {
		let toDelete = false;
		push();
		translate(this.x, this.y, this.z);
		noFill();
		stroke(255);
		strokeWeight(0.5);
		triangle(-2, 2, 0, -2, 2, 2);
		line(0, 2, 0, 80);
		noStroke();
		rotateY(PI);
		fill(255, 255);
		text(this.name, 0, -5);
		pop();
		if (this.z < -(boxesNumber * boxSideSize) * 0.5) {
			toDelete = true;
		}
		return toDelete;
	}
}
