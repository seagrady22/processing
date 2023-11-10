let f=0;
let W=400;

//Read full documentation at https://github.com/msawired/OPC
OPC.slider('complexity', 64, 16, 128, 1);
OPC.slider('frequency', 100, 50, 150, 1);
OPC.slider('velocity', 12, 1, 30, 1);
OPC.slider('displacement', 30, 1, 100, 1);

setup=_=>{
	createCanvas(W,W,WEBGL);
}
draw=_=>{
  background(0);
  let r=100;
  for(let u=0;u<TAU;u+=PI/complexity){ // Play with the following values for speed: 16,32,64,128...
    let U=u+f;
    for(let v=0;v<PI;v+=PI/complexity){ // Play with the following values for speed: 16,32,64,128...
      let R=sin(v*abs(atan(tan(f/frequency)))*velocity+f)*displacement+r;
			let Z=cos(U)*sin(v)*R;
      stroke(Z*2)
      point(sin(U)*sin(v)*r,cos(v)*r,Z);
    }
  }
  f+=.2
}

// ----------------------------------------
// Minimized
// ----------------------------------------
// f=0,draw=a=>{for(f||createCanvas(W=400,W,WEBGL),background(0),r=99,u=0;u<TAU;u+=PI/64)for(U=u+f,v=0;v<PI;v+=PI/64)R=30*sin(v*abs(atan(tan(f/99)))*12+f)+r,stroke(2*(Z=cos(U)*sin(v)*R)),point(sin(U)*sin(v)*r,cos(v)*r,Z);f+=.2};
