let x = y = 0;
const fontSize = 16;
const noiseScale = 0.0004;
const lower = 0x1f300;
const upper = 0x1f9ff;

function draw() {
  createCanvas(windowWidth, windowHeight);
  textSize(fontSize);
  let t = frameCount * noiseScale;
  for (i = 0; i < width; i += fontSize) {
    for (j = 0; j < height; j += fontSize) {
      const n = noise((i + x) * noiseScale, (j + y) * noiseScale, t);
      const code = int(map(n, 0, 1, lower, upper));
      const chr = String.fromCodePoint(code);
      text(chr, i, j);
    }
  }
}

function mouseDragged() {
  x += pmouseX - mouseX;
  y += pmouseY - mouseY;
};
