let url = 'https://coolors.co/9d5e17-d58b37-e69d4a-ffe3a0-ffefc8';
let palette = url.split('/')[3].split('-').map(c => '#' + c);
let vmin, vmax;
let cx, cy;
let gl, glsl;
let NUM = 9, step;
let RND;

function preload() {
  glsl = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  pixelDensity(2);
  createCanvas(windowWidth, windowHeight, WEBGL);
  vmin = min(width, height);
  vmax = max(width, height);
  cx = width / 2;
  cy = height / 2;
  step = vmax / NUM;
  RND = random();
}

function panel(x, y, sz, i, j) {
  let N = 5;
  let s = sz / N;
  let idx = i * NUM + j;
  let dir = (idx % 2);
  push();
  {
    translate(x, y);
    rotate(dir * PI / 2);
    for (let k = 0; k < N; k++) {
      let x0 = (k - N / 2 + 0.5) * s;
      let c = shuffle(palette);
      let c0 = c[0];
      let c1 = c[1];
      fill(c0);
      push();
      {
        translate(x0, 0);
        
        let uIndex = idx * N + k;
        glsl.setUniform('uIndex', uIndex + RND);
        glsl.setUniform('uColor0', color(c0)._array);
        glsl.setUniform('uColor1', color(c1)._array);
        plane(s, sz);
      }
      pop();
    }
  }
  pop();
}

function draw() {
  background(palette[0]);
  
  push();
  {
    translate(-vmax / 2, -vmax / 2);
    
    shader(glsl);
    
    noStroke();
    fill(palette[1]);
    for (let i = 0; i < NUM; i++) {
      let y = (i + 0.5) * step;
      for (let j = 0; j < NUM; j++) {
        let idx = i * NUM + j;
        let x = (j + 0.5) * step;
        let dir = idx % 2;
        panel(x, y, step, i, j);
      }
    }
  }
  pop();
  
  noLoop();
}

function mousePressed() {
  RND = random();
  redraw();
}
