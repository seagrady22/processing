let x = [];
let fourierX;
let time = 0;
let path = [];

function start() {
  const skip = 1;
  for (let i = 0; i < drawing.length; i += skip) {
    const c = new Complex(drawing[i].x, drawing[i].y);
    x.push(c);
  }

  fourierX = dft(x);

  fourierX.sort((a, b) => b.amp - a.amp);
}

function epiCycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;

    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    strokeWeight(1);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {
  background(0);

  let v = epiCycles(width / 2, height / 2, 0, fourierX);
  path.unshift(v);
  
  // beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    strokeWeight(3);
    // vertex(path[i].x, path[i].y);
    point(path[i].x, path[i].y);
  }
  // endShape();

  const dt = TWO_PI / fourierX.length;
  time += dt;
  
  if (time > TWO_PI) {
    time = 0;
    path = [];
  }

  // if (wave.length > 250) {
  //   wave.pop();
  // }
}
