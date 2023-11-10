// Page is black
document.getElementsByTagName("BODY")[0].style.backgroundColor="#000"

let f = 0;
const W = 400;
OPC.slider('radius', 117, 40, 200);
OPC.slider('net', 300, 200, 400);
OPC.slider('mySpeed', 3, 1, 9);
setup = _ => {
	createCanvas(W, W);
}

draw = _ => {
	background(0, 44);
	stroke(W, 77);
	let a = [];
	for (let j = 0; j <= TAU; j += PI / 8) {
		//P(a, j, W);
		//P(a, j, 150);
		a.push([X = sin(j + noise(j - f * (mySpeed + 1)) + f) * W + 200, Y = cos(j + noise(j + f * mySpeed) + f) * W + 200]);
		a.push([X = sin(j + noise(j - f * (mySpeed + 1)) + f) * radius + 200, Y = cos(j + noise(j + f * mySpeed) + f) * radius + 200]);
		a.forEach(Q => {
			if (dist(X, Y, A = Q[0], B = Q[1]) < net) line(X, Y, A, B);
		})
	}
	f += 0.01;
}

// f=0
// draw=_=> {
//   f||createCanvas(W=400,W,N=noise)
//   background(0,44)
//   stroke(W,77)
//   a=[]
//   for(j=0;j<=TAU;j+=PI/8){
//     P(W)
//     P(150)
//     a.forEach(Q=>{
//      if(dist(X,Y,A=Q[0],B=Q[1])<300) line(X,Y,A,B)
//    })
//   }
//   f+=.01
// }
// P=p=>a.push([X=sin(j+N(j-f*4)+f)*p+200,Y=cos(j+N(j+f*3)+f)*p+200])

// ----------------------------------------
// Minimized
// ----------------------------------------
// f=0,draw=s=>{for(f||createCanvas(W=400,W,N=noise),background(0,44),stroke(W,77),a=[],j=0;j<=TAU;j+=PI/8)P(W),P(150),a.forEach(a=>{dist(X,Y,A=a[0],B=a[1])<300&&line(X,Y,A,B)});f+=.01},P=s=>a.push([X=sin(j+N(j-4*f)+f)*s+200,Y=cos(j+N(j+3*f)+f)*s+200]);
