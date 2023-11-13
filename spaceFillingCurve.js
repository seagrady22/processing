// By Roni Kaufman
// https://ronikaufman.github.io

let paths = [], points = [], pointIdx = 0, pointsPerFrame = 1;
const MAX_DEPTH = 2, N = 5;

function setup() {
  createCanvas(600, 600);
	noFill();
	strokeWeight(2.5);
  
  findPaths([0, 0], [[0, 0]]);
  
  rsfc(0, 0, 1, true, true, 0);
	let delta = 1-points[points.length-1].x;
	points.push({x: 1-delta, y: 1+delta});
  
  background(5);
}

function draw() {
	let r0 = 50, rDelta = 200;
	
  for (let k = 0; k < pointsPerFrame; k++) {
    let p1 = points[pointIdx], p2 = points[pointIdx+1];
		
		let r1 = p1.x*rDelta + r0, r2 = p2.x*rDelta + r0;
		let theta1 = p1.y*PI, theta2 = p2.y*PI;
		let x1 = width/2 + r1*cos(theta1), y1 = height/2 + r1*sin(theta1);
		let x2 = width/2 + r2*cos(theta2), y2 = height/2 + r2*sin(theta2);
    stroke(rainbow(pointIdx/(2*points.length)));
		if (p1.y == p2.y) {
			line(x1, y1, x2, y2);
		} else {
			if (theta1 > theta2) [theta1, theta2] = [theta2, theta1];
			arc(width/2, height/2, 2*r1, 2*r2, theta1, theta2);
		}
		
		r1 = (1-p1.x)*rDelta + r0, r2 = (1-p2.x)*rDelta + r0;
		theta1 = p1.y*PI + PI, theta2 = p2.y*PI + PI;
		x1 = width/2 + r1*cos(theta1), y1 = height/2 + r1*sin(theta1);
		x2 = width/2 + r2*cos(theta2), y2 = height/2 + r2*sin(theta2);
    stroke(rainbow(1/2+pointIdx/(2*points.length)));
    if (p1.y == p2.y) {
			line(x1, y1, x2, y2);
		} else {
			if (theta1 > theta2) [theta1, theta2] = [theta2, theta1];
			arc(width/2, height/2, 2*r1, 2*r2, theta1, theta2);
		}
    
    pointIdx++;
    if (pointIdx == points.length-1) {
      noLoop();
      break;
    }
  }
  
  pointsPerFrame += 0.01;
}

function possibleNeighbors([i, j]) {
  let possibilities = [];
  if (i % 2 == 0 && j < N-1) possibilities.push([i, j+1]);
  if (i % 2 == 1 && j > 0) possibilities.push([i, j-1]);
  if (j % 2 == 0 && i < N-1) possibilities.push([i+1, j]);
  if (j % 2 == 1 && i > 0) possibilities.push([i-1, j]);
  return possibilities;
}

function inArray([i, j], arr) {
  for (let e of arr) {
    if (e[0] == i && e[1] == j) return true;
  }
  return false;
}

// find all paths in a N*N grid, going from top-left to bottom-right and through all points
function findPaths(p, visited) {
  let neighbors = possibleNeighbors(p);
  if (neighbors.length == 0) {
    if (visited.length == sq(N)) paths.push(visited);
    return;
  }
  for (let neigh of neighbors) {
    if (!inArray(neigh, visited)) findPaths(neigh, [...visited, neigh]);
  }
}

// random space-filling curve
function rsfc(x0, y0, s, topToBottom, leftToRight, depth) {
  if (depth == MAX_DEPTH) {
    points.push({x: x0+s/2, y: y0+s/2});
    return;
  }
  
  let newS = s/N;
  let idx1 = topToBottom ? 0 : 1;
  let idx2 = leftToRight ? 0 : 1;
  let path = random(paths);
  
  for (let [i, j] of path) {
    let x = leftToRight ? i*newS : (N-i-1)*newS;
    let y = topToBottom ? j*newS : (N-j-1)*newS;
    rsfc(x0+x, y0+y, newS, i % 2 == idx1, j % 2 == idx2, depth+1);
  }
}

function rainbow(t) {
  let palette = ["#ef562f", "#f9d531", "#a7cc51", "#4bafdd", "#bd4ee5"];
  let i = floor(palette.length*t);
  let amt = fract(palette.length*t);
  return lerpColor(color(palette[i%palette.length]), color(palette[(i+1)%palette.length]), amt);
}
