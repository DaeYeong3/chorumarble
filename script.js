const board = document.getElementById("board");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");

let players = [];
let currentPlayerIndex = 0;
let totalCells = 24;

function createBoard() {
  const size = 7;
  const total = size * size;

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / size);
    const col = i % size;

    // 테두리만 생성
    if (
      row === 0 ||
      row === size - 1 ||
      col === 0 ||
      col === size - 1
    ) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = getBorderIndex(i);

      if (cell.dataset.index !== "-1") {
        cell.innerText = cell.dataset.index;
      }

      board.appendChild(cell);
    }
  }
}

function getBorderIndex(i) {
  let map = [];

  for (let c = 0; c < 7; c++) map.push(c);
  for (let r = 1; r < 6; r++) map.push(r * 7 + 6);
  for (let c = 6; c >= 0; c--) map.push(42 + c);
  for (let r = 5; r > 0; r--) map.push(r * 7);

  return map.indexOf(i);
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
