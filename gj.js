let vs = 'precision highp float; varying vec2 vPos;' +
  'attribute vec3 aPosition;' +
  'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';

let fs = `precision highp float;

uniform float time;
uniform vec2 resolution;

float saturate(float x) { return clamp(x, 0., 1.); }

void main(void)
{
    float scale = resolution.y / 3.;
    vec2 p = gl_FragCoord.xy / scale;
    vec2 P = fract(p) - 0.5;
    float z = 7.0 * sin(float(time) + float(p));
    float r = 0.9 * cos(time + z);
    float c = saturate(sin(r - length(P*2.0) * z * (sin(time/9.0) * z * 2.0)) * scale);
    gl_FragColor = vec4(c, c, c, 1);
}`;

let kts;
function setup() {
	createCanvas(400, 400, WEBGL);
	kts = createShader(vs, fs);
  shader(kts);
  noStroke();
	kts.setUniform("resolution",[windowWidth, windowHeight]);
}

function draw() {
  kts.setUniform("time",frameCount/50);
	quad(-1, -1, 1, -1, 1, 1, -1, 1);
	// sphere(10);
}
