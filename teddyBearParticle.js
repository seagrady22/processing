/*Originally created in late 2012 (https://www.openprocessing.org/sketch/84094) as a Processing porting of Robert Hodgin (http://roberthodgin.com/)'s
particle engine example in Cinder Introduction (https://libcinder.org/docs/guides/tour/hello_cinder.html).
Since the old sketch is archived and doesn't work on browsers no more, this updated version is uploaded. I also did some minor revision, inspired by
JaredCounts (https://www.openprocessing.org/user/3044)'s dough (https://www.openprocessing.org/sketch/65193).*/

/* @pjs preload="bearyBear300.jpg"; */

boolean showGrid, showSrcImg, showSubtitle = true;
PImage srcImg;

void setup(){
  size(600, 600, P2D);
  smooth();
  textAlign(CENTER, CENTER);
  textSize(24);
  
  srcImg = loadImage("bearyBear300.jpg");
  
  initGrid();
  initPtcs();
}

void draw(){
  
  updatePtcs();
  
  background(0);
  //if(showSrcImg)image(srcImg, 0, 0, 600, 600);
  //if(showGrid) drawGrid();
  drawPtcs();
  if(showSubtitle){
    fill(255);
    text("Click & Drag!", width*.5, height*.5);
  }
}
