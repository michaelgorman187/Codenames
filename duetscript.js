// Utility: shuffle array in place
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Board One: 9 greens, 3 blacks, rest empty (random every time)
function makeBoardOne() {
  const positions = Array.from({ length: 25 }, (_, i) => i);
  shuffle(positions);

  const greens = positions.slice(0, 9);
  const blacks = positions.slice(9, 12);

  return Array.from({ length: 25 }, (_, i) =>
    greens.includes(i) ? "green" :
    blacks.includes(i) ? "black" : "empty"
  );
}

// Board Two: derived from Board One with Duet constraints
function makeBoardTwo(board1) {
  const positions = Array.from({ length: 25 }, (_, i) => i);

  const greens1 = positions.filter(i => board1[i] === "green");
  const blacks1 = positions.filter(i => board1[i] === "black");
  const empties1 = positions.filter(i => board1[i] === "empty");

  // Choose Board Two black squares:
  // - one from Board One's black
  // - one from Board One's green
  // - one from Board One's empty
  const b2BlackFromB1Black = shuffle([...blacks1])[0];
  const b2BlackFromB1Green = shuffle([...greens1])[0];
  const b2BlackFromB1Empty = shuffle([...empties1])[0];
  const blacks2 = [b2BlackFromB1Black, b2BlackFromB1Green, b2BlackFromB1Empty];

  // Board One black mapping:
  // - one stays black on Board Two (already picked above)
  // - one becomes green on Board Two
  // - one becomes empty on Board Two
  const remainingBlacks1 = shuffle(blacks1.filter(i => i !== b2BlackFromB1Black));
  const b1BlackToGreen = remainingBlacks1[0];
  const b1BlackToEmpty = remainingBlacks1[1];

  // Greens overlap: exactly 3 from Board One greens (excluding the one we turned black on Board Two)
  const possibleOverlap = greens1.filter(i => i !== b2BlackFromB1Green);
  const overlapGreens = shuffle([...possibleOverlap]).slice(0, 3);

  // Start greens2 with overlaps + the required “black→green” mapping
  let greens2 = [...overlapGreens, b1BlackToGreen];

  // Add new greens (not green on Board One), avoiding blacks2 and already chosen greens2, until we reach 9
  const candidatesForNewGreens = positions.filter(i =>
    !greens1.includes(i) && !blacks2.includes(i) && !greens2.includes(i)
  );
  shuffle(candidatesForNewGreens);
  const needed = 9 - greens2.length; // should be 5
  greens2.push(...candidatesForNewGreens.slice(0, needed));

  // Build Board Two
  return positions.map(i =>
    blacks2.includes(i) ? "black" :
    greens2.includes(i) ? "green" : "empty"
  );
}

// Apply roles to a grid
function populateBoard(gridEl, roles) {
  const cells = Array.from(gridEl.querySelectorAll(".cell"));
  cells.forEach((cell, i) => {
    cell.className = "cell " + roles[i];
    cell.textContent = "";
    if (roles[i] === "green") cell.textContent = "G";
    if (roles[i] === "black") cell.textContent = "A";
  });
}

// Create both boards
function newDuetGame() {
  const board1 = makeBoardOne();
  const board2 = makeBoardTwo(board1);
  populateBoard(document.getElementById("grid1"), board1);
  populateBoard(document.getElementById("grid2"), board2);
}

// Initial setup
newDuetGame();

// Buttons
document.getElementById("newGame").addEventListener("click", newDuetGame);
document.getElementById("hide1").addEventListener("click", () => {
  const board = document.getElementById("grid1").closest(".board");
  board.classList.toggle("hidden");
  const btn = document.getElementById("hide1");
  btn.textContent = board.classList.contains("hidden") ? "Show 1" : "Hide 1";
});
document.getElementById("hide2").addEventListener("click", () => {
  const board = document.getElementById("grid2").closest(".board");
  board.classList.toggle("hidden");
  const btn = document.getElementById("hide2");
  btn.textContent = board.classList.contains("hidden") ? "Show 2" : "Hide 2";
});

