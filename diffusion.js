let particles = [];
let fade;
let fadeAmount = 1;
let img;
let h = 500;
let w = 500;
let imgs = ['texture 1.jpg', 'tex 2.jpg', 'tex 3.jpg', 'tex 4.jpg']
function preload() {
  //load the image.
  i = random(imgs)
  img = loadImage(i);
}

function setup() {
  createCanvas(h, w);
  background(200, 200, 200);
  fade = 0;

  //resize the image to match the canvas dimensions.
  img.resize(h, w);

  //initialize particles with initial positions and colors.
  for (let i = 0; i < w + 10; i += 5) {
    for (let j = 0; j < h + 10; j += 5) {
      let c = img.get(i, j);

      particles.push({
        x: i - w / 2, //adjust the initial x position.
        y: j - h / 2, //adjust the initial y position.
        clr: color(c) //set the color of the particle.
      });
    }
  }
}

function draw() {
  background(100, 70, 40, 0.07);

  //iterate over the particles array.
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(p.clr);
    ellipse(p.x + width / 2, p.y + height / 2, 0.5);
    p.x += (noise(p.x / 200, p.y / 200, 3000) - 0.6) * 0.5;
    p.y += (noise(p.x / 200, p.y / 200, 30000) - 0.5) * 0.5;
  }
}
function mouseClicked() {
  saveCanvas('screenshot', 'png');
}


