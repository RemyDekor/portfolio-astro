const r = 6;
const maxTry = 30;
let grid = [];
let active = [];
let ordered = [];

const pointSize = r * 0.1 + 1;

function setup() {
  createCanvas(400, 400);

  background(255);
  stroke(120);

  const cellSize = r / sqrt(2);

  const cols = floor(width / cellSize);
  const rows = floor(height / cellSize);

  for (let i = 0; i < cols * rows; i++) {
    grid[i] = undefined;
  }

  // ----

  const firstPos = [width / 2, height / 2]; // could have some randomness
  const firstPosVec = createVector(firstPos[0], firstPos[1]);
  const i = floor(firstPos[0] / cellSize);
  const j = floor(firstPos[1] / cellSize);

  grid[i + j * cols] = firstPosVec;
  active.push(firstPosVec);

  while (active.length > 0) {
    const randomIndex = floor(random(active.length));
    const pos = active[randomIndex];
    let found = false;

    for (let nTry = 0; nTry < maxTry; nTry++) {
      const newRandomPos = p5.Vector.random2D()
        .setMag(random(r, 2 * r))
        .add(pos);

      var col = floor(newRandomPos.x / cellSize);
      var row = floor(newRandomPos.y / cellSize);

      if (
        col > -2 &&
        row > -2 &&
        col < cols + 1 &&
        row < rows + 1 &&
        !grid[col + row * cols]
      ) {
        let ok = true;

        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            let index = col + i + (row + j) * cols;
            let neighbor = grid[index];
            if (neighbor) {
              const d = p5.Vector.dist(newRandomPos, neighbor);
              if (d < r) {
                ok = false;
                break;
                // Should we break using a named block/loop?
              }
            }
          }
        }
        if (ok) {
          found = true;
          grid[col + row * cols] = newRandomPos;
          active.push(newRandomPos);
          ordered.push(newRandomPos);
          break;
        }
      }
    }

    if (!found) {
      active.splice(randomIndex, 1);
    }
  }

  const centerPos = createVector(width / 2, height / 2);

  // draw points
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i]) {
      if (ordered[i].dist(centerPos) > width * 0.42) continue; // don't draw points outside of radius
      // stroke((i/4) % 255, i % 255, 200);
      // strokeWeight(pointSize);
      strokeWeight((i / ordered.length) * 8 + 1);
      point(ordered[i].x, ordered[i].y);
    }
  }

  // debug active
  // for (let i = 0; i < active.length; i++) {
  //   stroke(255,0,255);
  //   strokeWeight(r * 0.5 - 2);
  //   point(active[i].x, active[i].y);
  // }
}
