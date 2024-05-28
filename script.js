const cells = document.querySelectorAll('.cell');
const playerXWinsElement = document.getElementById('playerXWins');
const playerOWinsElement = document.getElementById('playerOWins');
const drawsElement = document.getElementById('draws');
const resetButton = document.getElementById('resetButton');
const newGameButton = document.getElementById('newGameButton');
const aiButton = document.getElementById('aiButton');
let currentPlayer = 'X';
let gameEnded = false;
let playerXWins = 0;
let playerOWins = 0;
let draws = 0;
let aiDifficulty = 'hard'; // ระดับความยากของ AI (easy, medium, hard)

function checkWinner() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (cells[a].innerText && cells[a].innerText === cells[b].innerText && cells[a].innerText === cells[c].innerText) {
            return cells[a].innerText;
        }
    }
    if ([...cells].every(cell => cell.innerText)) {
        return 'draw';
    }
    return null;
}

function handleCellClick(cellIndex) {
    if (!gameEnded && !cells[cellIndex].innerText) {
        cells[cellIndex].innerText = currentPlayer;
        const winner = checkWinner();
        if (winner) {
            if (winner === 'draw') {
                alert("It's a draw!");
                draws++;
                drawsElement.innerText = draws;
            } else {
                alert(`Player ${winner} wins!`);
                if (winner === 'X') {
                    playerXWins++;
                    playerXWinsElement.innerText = playerXWins;
                } else {
                    playerOWins++;
                    playerOWinsElement.innerText = playerOWins;
                }
            }
            gameEnded = true;
            resetButton.disabled = false;
            newGameButton.disabled = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O' && aiButton.innerText === 'AI: ON') {
                handleAITurn();
            }
        }
    }
}

function resetGame() {
    cells.forEach(cell => {
        cell.innerText = '';
    });
    currentPlayer = 'X';
    gameEnded = false;
    resetButton.disabled = true;
    newGameButton.disabled = true;
}

function newGame() {
    cells.forEach(cell => {
        cell.innerText = '';
    });
    playerXWins = 0;
    playerOWins = 0;
    draws = 0;
    playerXWinsElement.innerText = '0';
    playerOWinsElement.innerText = '0';
    drawsElement.innerText = '0';
    currentPlayer = 'X';
    gameEnded = false;
    resetButton.disabled = true;
    newGameButton.disabled = true;
}

function toggleAI() {
    aiButton.innerText = aiButton.innerText === 'AI: OFF' ? 'AI: ON' : 'AI: OFF';
}

function handleAITurn() {
    const emptyCells = Array.from(cells).filter(cell => !cell.innerText);
    if (emptyCells.length > 0) {
        let cellIndex;
        if (aiDifficulty === 'easy') {
            // เล่นแบบสุ่ม
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            cellIndex = Array.from(cells).indexOf(emptyCells[randomIndex]);
        } else if (aiDifficulty === 'medium') {
            // เล่นแบบสุ่ม 50% และเลือกท่าที่ดีที่สุด 50%
            if (Math.random() < 0.5) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                cellIndex = Array.from(cells).indexOf(emptyCells[randomIndex]);
            } else {
                cellIndex = findBestMove(emptyCells, -Infinity, Infinity);
            }
        } else if (aiDifficulty === 'hard') {
            // เลือกท่าที่ดีที่สุด
            cellIndex = findBestMove(emptyCells, -Infinity, Infinity);
        }
        handleCellClick(cellIndex);
    }
}

function findBestMove(emptyCells, alpha, beta) {
    let bestScore = -Infinity;
    let bestMove;
    emptyCells.forEach(emptyCell => {
        const index = Array.from(cells).indexOf(emptyCell);
        cells[index].innerText = currentPlayer;
        const score = minimax(cells, 0, alpha, beta, false);
        cells[index].innerText = ''; // คืนค่าของเซลล์เป็นว่าง
        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    });
    return bestMove;
}

function minimax(board, depth, alpha, beta, isMaximizing) {
    const result = checkWinner();
    if (result !== null) {
        if (result === 'X') {
            return 10 - depth;
        } else if (result === 'O') {
            return depth - 10;
        } else {
            return 0;
        }
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (!cell.innerText) {
                cell.innerText = 'X';
                const score = minimax(board, depth + 1, alpha, beta, false);
                cell.innerText = '';
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    return bestScore;
                }
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (!cell.innerText) {
                cell.innerText = 'O';
                const score = minimax(board, depth + 1, alpha, beta, true);
                cell.innerText = '';
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    return bestScore;
                }
            }
        });
        return bestScore;
    }
}
