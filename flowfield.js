ArrayList<Particle> particles;

float xoff, yoff, zoff, inc, col;

int spread, cols, rows, num;
int offset = 2;
//ىه
PImage img;
PVector[] vectors;


void setup() {
  size(520, 737, P2D);
  background(0);
  frameRate(100);
  img = loadImage("brain-xray.jpg");
  init();
}


void init() {
 
  spread  = 10;
  inc  = random(0.1,0.8);
  num  = 4000;
  col  = random(255);
  cols = floor(width / spread) + 1;
  rows = floor(height / spread) + 1;
  vectors   = new PVector[cols * rows];
  particles = new ArrayList<Particle>();

  for (int i=0; i<num; i++)
    particles.add(new Particle());
}

void draw() {
  fill(0,20);
  rect(0,0,width,height);
  filter(DILATE,2);
  
  yoff = 0;
  for (int y = 0; y < rows; y++) {
    xoff = 0;
    for (int x = 0; x < cols; x++) {
      float angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      PVector v = PVector.fromAngle(angle);
      v.setMag(1);
      vectors[x + y * cols] = v;
      xoff += inc;
    }
    yoff += inc;
  }
  zoff += 0.0005;
  if (col < 255)col += 0.5;
  else col = 0;
  for (Particle p : particles)p.run();
}
void mousePressed()
{
  background(255);
  init();
}
