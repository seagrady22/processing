// Digital roots
// For the #WCCChallenge << Electric growth >> (join the discord! https://discord.gg/S8c7qcjw2b)

/*
 * Stretching this week's theme, I swapped the "electric" part for "electronic", hope you don't mind.
 * Playing with the duality of our environments, it represents the digital world we are immersed in,
 * rooted in nature and escaping from it at the same time.
 *
 * Revisiting a technique I've used in the past, the space colonization algorithm, with different
 * constraints for the two parts that compose this sketch. It also uses poisson disk sampling for the
 * initial seeding of the nodes.
 */

// Global variables
let canvasWidth, canvasHeight
let attractionPoints = []
let tree = []
let grid
let minDistance = 10 + Math.pow(Math.random(), 2) * 8
let killDistance = minDistance / 2
let rootY
let noiseFactor = 0.01
let done = false
let palette = {
  UP_BG_COLOR: "#122c64",
  UP_BG_COLOR2: "#000000",
  DOWN_BG_COLOR2: "#647332",
  DOWN_BG_COLOR: "#adc178",
  CIRCUIT_COLOR: "#DDDDFF",
  CIRCUIT_COLOR2: "#72b9ff",
  ROOT_COLOR: "#553725",
}
let texture

function setup() {
	canvasHeight = min(windowHeight, 1200)

  canvasWidth = min(windowWidth, canvasHeight * 5 / 6)
  createCanvas(canvasWidth, canvasHeight)
  pixelDensity(1)
  grid = new Grid(canvasWidth + 1, canvasHeight + 1, 100)
  rootY = canvasHeight / 2
  attractionPoints = poissonDiscSampling(width, height, minDistance)

  let root = new TreeNode(createVector(width / 2, rootY))
  grid.insert(root)
  tree.push(root)
  texture = granulate(150)
}

function draw() {
  let existing = tree.length
  background(255)
  drawBackground()

  growTree()
  pruneTree()

  if (tree.length === existing) {
    // console.log("DONE!")
    done = true
    attractionPoints = []
  }

  image(texture, 0, 0)
  drawTree()
  drawGround()
}

function mousePressed() {
  // Only reset if the click is within the canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    resetSketch()
  }
}

function resetSketch() {
	minDistance = 10 + pow(random(), 2) * 8
	killDistance = minDistance / 2
	noiseSeed(random(1000000))
  tree = [] // Clear the tree
  grid = new Grid(canvasWidth + 1, canvasHeight + 1, 100) // Re-initialize the grid
  attractionPoints = poissonDiscSampling(width, height, minDistance) // Re-calculate attraction points

  let root = new TreeNode(createVector(width / 2, rootY)) // Create a new root node
  grid.insert(root) // Insert the root node into the grid
  tree.push(root) // Add the root node to the tree
  done = false // Reset the 'done' flag
  texture = granulate(100)
}

// Function to draw the background
function drawBackground() {
  noStroke()
  // fill(palette.UP_BG_COLOR)
  // Fill with a gradient from a dark blue to black
  let gradient = drawingContext.createLinearGradient(0, 0, 0, rootY)
  gradient.addColorStop(0, palette.UP_BG_COLOR)
  gradient.addColorStop(1, "#000000")
  drawingContext.fillStyle = gradient

  rect(0, 0, canvasWidth, rootY)

  gradient = drawingContext.createLinearGradient(0, rootY, 0, canvasHeight)
  gradient.addColorStop(0, palette.DOWN_BG_COLOR)
  gradient.addColorStop(1, palette.DOWN_BG_COLOR2)
  drawingContext.fillStyle = gradient
  rect(0, rootY, canvasWidth, canvasHeight - rootY)

  fill(0) // Reset gradient color
}

// Function to grow the tree
function growTree() {
  let toRemove = []
  for (let point of attractionPoints) {
    let closestNode = findClosestNode(point, minDistance * 2)
    if (closestNode) {
      let newDirection = p5.Vector.sub(point, closestNode.pos)
      closestNode.dir.add(newDirection)
      closestNode.dir = constrainDirection(
        closestNode.dir,
        closestNode.pos.y < rootY
      )
      closestNode.count++
    }
    if (closestNode && p5.Vector.dist(closestNode.pos, point) < killDistance) {
      toRemove.push(point)
    }
  }

  toRemove.forEach((point) => {
    attractionPoints.splice(attractionPoints.indexOf(point), 1)
  })
}

// Function to prune the tree and add new nodes
function pruneTree() {
  if (!done) {
    for (let node of tree) {
      if (node.count > 0) {
        node.dir.div(node.count)
        let newPos = adjustNodePosition(node)
        if (grid.canInsert(newPos, minDistance, node)) {
          let newNode = new TreeNode(newPos, node)
          tree.push(newNode)
          grid.insert(newNode)
          node.reset()
        }
      }
    }
  }
}

// Function to draw the tree
function drawTree() {
  for (let node of tree) {
    stroke(node.pos.y < rootY ? palette.CIRCUIT_COLOR : palette.ROOT_COLOR)
    if (node.pos.y < rootY) {
      strokeWeight(map(node.weight, 0, 60, 5, 1, true))
    } else {
      strokeWeight(map(node.weight, 0, 50, 6, 2, true))
    }
    strokeCap(PROJECT)
    if (node.parent) {
      line(node.pos.x, node.pos.y, node.parent.pos.x, node.parent.pos.y)
    }
    if (node.isLeaf && node.pos.y < rootY) {
      fill(palette.CIRCUIT_COLOR2)
      noStroke()
      let radius = map(node.weight, 0, 30, 10, 5, true)
      circle(node.pos.x, node.pos.y, radius)
    }
  }
}

function drawGround() {
  let sw = 4
	push()
  stroke(palette.CIRCUIT_COLOR)
	strokeWeight(sw)
  line(0, rootY - sw / 2, width, rootY - sw / 2)
  stroke(palette.ROOT_COLOR)
  line(0, rootY + sw / 2, width, rootY + sw / 2)
	stroke(0)
	strokeWeight(sw * 5)
	noFill()
	rect(0, 0, width, height)
	pop()
}

function canConnect(node, point) {
  if (node.weight > 1) {
    // Check if the node and the point cross the rootY threshold
    if (node.pos.y <= rootY && point.y >= rootY) {
      return false
    } else if (node.pos.y >= rootY && point.y <= rootY) {
      return false
    } else {
      return true
    }
  }
  return true
}

function findClosestNode(point, searchRadius) {
  let closestNode = null
  let recordDistance = Infinity
  let closePoints = grid.getNeighborhood(point, searchRadius)

  for (let node of closePoints) {
    let distance = p5.Vector.dist(node.pos, point)
    if (distance < recordDistance && canConnect(node, point)) {
      closestNode = node
      recordDistance = distance
    }
  }
  return closestNode
}

// Function to constrain direction to quantized angles
function constrainDirection(vector, isCircuit) {
  if (isCircuit) {
    return quantizeDirection(vector, random() < 0.7 ? PI / 2 : PI / 4)
  } else {
    let d = random() < 0.3 ? PI / 2 : PI / 4
    vector.rotate(
      map(noise(vector.x * noiseFactor, vector.y * noiseFactor), 0, 1, -d, d)
    )
    return vector
  }
}

// Function to adjust node position according to noise
function adjustNodePosition(node) {
  let len = map(abs(node.pos.y - rootY), 0, rootY, minDistance, minDistance / 2)
  return node.pos.copy().add(node.dir.setMag(len))
}

// Function to quantize direction to nearest angle
function quantizeDirection(vector, angle) {
  let a = atan2(vector.y, vector.x)
  let quantizedAngle = round(a / angle) * angle
  return createVector(cos(quantizedAngle), sin(quantizedAngle))
}

// TreeNode class definition
class TreeNode {
  constructor(pos, parent = null) {
    this.pos = constrainPosition(pos)
    this.isLeaf = random() < 0.5
    this.dir = createVector()
    this.count = 0
    this.parent = parent
    this.children = []
    this.weight = parent ? parent.weight + 1 : 0
    if (parent) {
      parent.children.push(this)
      parent.isLeaf = false
    }
  }

  // Resets node direction and count
  reset() {
    this.dir.set(0, 0)
    this.count = 0
  }
}

// Function to ensure position is within canvas bounds
function constrainPosition(pos) {
  pos.x = constrain(pos.x, 0, width)
  pos.y = constrain(pos.y, 0, height)
  return pos
}

// Poisson-disc sampling function
function poissonDiscSampling(width, height, minDist) {
  let pds = new FastPoissonDiskSampling({
    shape: [width, height],
    minDistance: minDist,
    tries: 10,
  })
  let points = pds.fill()
  return points.map((p) => createVector(p[0], p[1]))
}

// Grid class definition for spatial partitioning
class Grid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize
    this.numCols = Math.ceil(width / cellSize)
    this.numRows = Math.ceil(height / cellSize)
    this.cells = Array.from({ length: this.numCols }, () =>
      Array.from({ length: this.numRows }, () => [])
    )
  }

  // Inserts a node into the grid
  insert(node) {
    let col = Math.floor(node.pos.x / this.cellSize)
    let row = Math.floor(node.pos.y / this.cellSize)
    this.cells[col][row].push(node)
    node.gridCell = { col, row }
  }

  // Checks if a new position can have a node inserted
  canInsert(pos, radius, particle) {
    let neighbors = this.getNeighborhood(pos, radius, particle)
    return neighbors.every((p) => p5.Vector.dist(p.pos, pos) >= radius / 2)
  }

  // Retrieves neighbors within a certain radius
  getNeighborhood(pos, radius, particle = null) {
    let neighbors = []
    let topLeft = [
      Math.floor((pos.x - radius) / this.cellSize),
      Math.floor((pos.y - radius) / this.cellSize),
    ]
    let bottomRight = [
      Math.floor((pos.x + radius) / this.cellSize),
      Math.floor((pos.y + radius) / this.cellSize),
    ]

    for (let i = topLeft[0]; i <= bottomRight[0]; i++) {
      for (let j = topLeft[1]; j <= bottomRight[1]; j++) {
        if (i < 0 || j < 0 || i >= this.numCols || j >= this.numRows) continue
        let cell = this.cells[i][j]
        for (let p of cell) {
          if (p !== particle) neighbors.push(p)
        }
      }
    }
    return neighbors
  }
}

function granulate(gA) {
  let yBlockHeight = random(50, 100)
  let gc = createGraphics(canvasWidth, canvasHeight)
  gc.loadPixels()
  let d = gc.pixelDensity()
  let halfImage = 4 * (canvasWidth * d) * (canvasHeight * d)
  for (let ii = 0; ii < halfImage; ii += 4) {
    let x = (ii / 4) % (canvasWidth * d)
    let y = floor(ii / 4 / (canvasWidth * d))

    let deltaX = (floor(y / yBlockHeight) + 2) * x * 100
    let noiseValue = noise((deltaX + x) * 0.02);
    let alphaValue = map(noiseValue, 0, 1, 0, gA); // Adjust the range as needed

    grainAmount = random(-gA, gA)
    gc.pixels[ii] = gc.pixels[ii] + grainAmount
    gc.pixels[ii + 1] = gc.pixels[ii + 1] + grainAmount
    gc.pixels[ii + 2] = gc.pixels[ii + 2] + grainAmount
    gc.pixels[ii + 3] = alphaValue
  }
  gc.updatePixels()
  return gc
}

