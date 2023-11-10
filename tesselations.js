f=0
draw=_=>{
  f++||(createCanvas(W=400,W,WEBGL),ortho())
  n=-12
  for(y=-W; y<W; y+=43){
    for(x=-W; x<W; x+=50){
      Z(n,Y=y+sin(F=f/30)*99,sin(F)*35)
      Z(-n,Y+20,cos(F)*35)
    }
    n=-n
  }
}

Z=(n,y,s)=>{
push(pointLight([99],W,n,W))
translate(x+n,y,s)
rotateX(r=.8)//PI/4
rotateY(-r)
pop(box(36))
}

// ----------------------------------------
// Minimized
// ----------------------------------------
// f=0,draw=o=>{for(f++||createCanvas(W=400,W,WEBGL),ortho(),n=-12,y=-W;y<W;y+=43){for(x=-W;x<W;x+=50)Z(n,Y=y+99*sin(F=f/30),35*sin(F)),Z(-n,Y+20,35*cos(F));n=-n}},Z=(n,o,t)=>{push(pointLight([99],W,n,W)),translate(x+n,o,t),rotateX(r=.8),rotateY(-r),pop(box(35))};//#つぶやきProcessing
