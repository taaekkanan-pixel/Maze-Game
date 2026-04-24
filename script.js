const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelDisplay = document.getElementById('level-display');
const messageDisplay = document.getElementById('message');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const TILE_SIZE = 40;
let currentLevel = 0;
let player = { x: 0, y: 0 };
let gameWon = false;

// 1: Wall, 0: Path, 2: Start, 3: Goal
const levels = [
    // Level 1: Easy
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 1, 0, 0, 3, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 2: Medium
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 1, 0, 0, 0, 1, 0, 3, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 3: Hard
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 3, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

let map = [];

function initGame() {
    map = levels[currentLevel];
    canvas.width = map[0].length * TILE_SIZE;
    canvas.height = map.length * TILE_SIZE;
    gameWon = false;
    nextBtn.style.display = 'none';
    messageDisplay.textContent = "Use Arrow Keys or WASD to move.";
    messageDisplay.style.color = "#a2a8d3";
    levelDisplay.textContent = `Level: ${currentLevel + 1}`;

    // Find starting position
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 2) {
                player.x = c;
                player.y = r;
            }
        }
    }
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Map
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 1) {
                ctx.fillStyle = '#0f3460'; // Wall
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[r][c] === 3) {
                ctx.fillStyle = '#4ecca3'; // Goal
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // Draw Player
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(
        player.x * TILE_SIZE + TILE_SIZE / 2, 
        player.y * TILE_SIZE + TILE_SIZE / 2, 
        TILE_SIZE / 3, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
}

function movePlayer(dx, dy) {
    if (gameWon) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Check collision with walls
    if (map[newY][newX] !== 1) {
        player.x = newX;
        player.y = newY;
        draw();

        // Check win condition
        if (map[newY][newX] === 3) {
            gameWon = true;
            messageDisplay.textContent = "Level Cleared! Awesome!";
            messageDisplay.style.color = "#4ecca3";
            
            if (currentLevel < levels.length - 1) {
                nextBtn.style.display = 'inline-block';
            } else {
                messageDisplay.textContent = "Congratulations! You finished all levels!";
                messageDisplay.style.color = "#FFD700";
            }
        }
    }
}

// Event Listeners for controls
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            movePlayer(1, 0);
            break;
    }
});

restartBtn.addEventListener('click', initGame);
nextBtn.addEventListener('click', () => {
    currentLevel++;
    initGame();
});

// Start Game
initGame();
