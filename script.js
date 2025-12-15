const boxes = Array.from(document.querySelectorAll(".cell"));
const newGameBtn = document.getElementById("newGame");


function assignRoles() {
  const pool = [
    ...Array(9).fill("teamOne"),
    ...Array(8).fill("teamTwo"),
    ...Array(7).fill("neutral"),
    "assassin"
  ];

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Apply classes and letters
  boxes.forEach((box, i) => {
    const role = pool[i];
    box.className = "cell " + role;

    // Clear any previous text
    box.textContent = "";

    // Add letters for specific roles
    if (role === "teamOne") box.textContent = "B";
    if (role === "teamTwo") box.textContent = "R";
    if (role === "assassin") box.textContent = "A";
  });
}

newGameBtn.addEventListener("click", assignRoles);
assignRoles();

const cells = Array.from(document.querySelectorAll(".cell"));

cells.forEach(cell => {
  cell.addEventListener("mousemove", (e) => {
    const rect = cell.getBoundingClientRect();
    const x = e.clientX - rect.left;     // mouse X inside cell
    const y = e.clientY - rect.top;      // mouse Y inside cell
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    // Map mouse position to small rotation angles
    const rotateY = ((x - midX) / midX) * 6;   // left/right tilt
    const rotateX = -((y - midY) / midY) * 6;  // up/down tilt (negative to “dip” under cursor)

    cell.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    cell.classList.add("hovering");
  });

  cell.addEventListener("mouseleave", () => {
    cell.style.transform = "none";
    cell.classList.remove("hovering");
  });
});
