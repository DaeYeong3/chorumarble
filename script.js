const board = document.getElementById("board");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");

let players = [];
let currentPlayerIndex = 0;
let totalCells = 24; // 7x7 테두리는 24칸


function createBoard() {
  const size = 7;
  const path = getPathIndexes(size);

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    const pathIndex = path.indexOf(i);

    if (pathIndex !== -1) {
      cell.dataset.index = pathIndex;
      cell.innerText = pathIndex;
    } else {
      cell.style.visibility = "hidden";
    }

    board.appendChild(cell);
  }
}



function getPathIndexes(size) {
  const path = [];

  // 위쪽 →
  for (let i = 0; i < size; i++) {
    path.push(i);
  }

  // 오른쪽 ↓
  for (let i = 1; i < size; i++) {
    path.push(i * size + (size - 1));
  }

  // 아래쪽 ←
  for (let i = size - 2; i >= 0; i--) {
    path.push((size - 1) * size + i);
  }

  // 왼쪽 ↑
  for (let i = size - 2; i > 0; i--) {
    path.push(i * size);
  }

  return path;
}


function addPlayer() {
  const nameInput = document.getElementById("playerName");
  const name = nameInput.value.trim();
  if (!name) return;

  players.push({
    name,
    position: 0,
    finished: false,
    color: getRandomColor()
  });

  nameInput.value = "";
  renderPlayers();
}

function rollDice() {
  if (players.length === 0) return;

  const player = players[currentPlayerIndex];
  if (player.finished) {
    nextTurn();
    return;
  }

  let dice = Math.floor(Math.random() * 6) + 1;

  showPopup(`${player.name} : ${dice}`);

  player.position += dice;

  if (player.position >= totalCells) {
    player.finished = true;
    player.position = totalCells - 1;
    showPopup(`${player.name} 완주!`);
  }

  renderPlayers();
  nextTurn();
}

function nextTurn() {
  let count = 0;
  do {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    count++;
  } while (players[currentPlayerIndex].finished && count < players.length);

  renderPlayers();
}

function renderPlayers() {
  document.querySelectorAll(".player").forEach(p => p.remove());

  players.forEach((player, index) => {
    const cell = document.querySelector(`[data-index='${player.position}']`);
    if (!cell) return;

    const piece = document.createElement("div");
    piece.classList.add("player");
    if (index === currentPlayerIndex) piece.classList.add("current");
    piece.style.background = player.color;
    cell.appendChild(piece);
    if (players.length > 0) {
      currentPlayerDisplay.innerText =
        `현재 턴 : ${players[currentPlayerIndex].name}`;
}

  });
}

function showPopup(text) {
  popupContent.innerText = text;
  popup.classList.remove("hidden");
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 800);
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

createBoard();
