// Game board module
const gameBoard = (function () {
    const boardCells = document.querySelectorAll(".grid-box");
    const currentBoard = ["", "", "", "", "", "", "", "", ""];

    function createBoard() {
        boardCells.forEach((cell, index) => {
            cell.addEventListener("click", () => cellClick(index), {
                once: true,
            });
        });
    }

    function cellClick(index) {
        if (currentBoard[index] === "") {
            currentBoard[index] = gameLogic.getCurrentPlayer().symbol;
            boardCells[index].textContent = currentBoard[index];

            if (gameLogic.checkGameStatus()) return;
            gameLogic.switchPlayer();
        }
    }

    function resetBoard() {
        currentBoard.fill("");
        boardCells.forEach((cell) => {
            cell.textContent = "";
            cell.classList.remove("winner");
        });
    }

    return {
        createBoard,
        resetBoard,
        getboard: () => currentBoard
    };
})();

// Game Setup module
const setGame = (function () {
    const startBtn = document.querySelector(".game-start-btn");
    const gameInit = document.querySelector(".game-init");
    const gameActive = document.querySelector(".game-active");
    const newGameBtn = document.querySelector(".new-game");
    const resetScoresBtn = document.querySelector(".reset");

    function createPlayer(name, symbol) {
        return { name, symbol, score: 0 };
    }

    function setPlayers() {
        const playerOneName = document.querySelector("#player1-name").value;
        const playerTwoName = document.querySelector("#player2-name").value;

        const player1 = createPlayer(playerOneName, "X");
        const player2 = createPlayer(playerTwoName, "O");

        gameLogic.init(player1, player2);

        document.querySelector(".player1-name").textContent = player1.name;
        document.querySelector(".player2-name").textContent = player2.name;
        updateScoreDisp();

        return {
            player1,
            player2,
        };
    }

    function resetScores() {
        player1.score = 0;
        player2.score = 0;
        updateScoreDisp();
    }

    function updateScoreDisp() {
        document.querySelector(".score1").textContent = player1.score;
        document.querySelector(".score2").textContent = player2.score;
    }

    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        gameInit.classList.remove("active");
        gameActive.classList.add("active");
        setPlayers();
        gameboard.createBoard();
    });

    newGameBtn.addEventListener("click", (e) => {
        e.preventDefault();
        gameActive.classList.remove("active");
        gameInit.classList.add("active");
        gameboard.resetBoard();
    });

    resetScoresBtn.addEventListener("click", () => {
        resetScores();
    });

    return {
        updateScoreDisp,
    }
})();

// Game Logic module
const gameLogic = (function () {
    let player1, player2, currentPlayer;

    function init(p1, p2) {
        player1 = p1;
        player2 = p2;
        currentPlayer = player1
        updateScoreDisp();
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        updatePlayerDisp();
    }

    function updatePlayerDisp() {
        document.querySelector('.announce').textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
    }

    function checkWinner () {
        const board = gameBoard.getboard();
        const winCombo = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4 ,6],
        ];

        for (let combo of winCombo) {
            const [a, b, c] = combo;
            if (
                (board[a]) && (board[a] === board[b]) && (board[a] === board[c])
            ) {
                showWinCells(combo);
                return true;
            }
        }
        return false
    }

    function checkDraw() {
        const board = gameBoard.getboard();
        return board.every((cell) => cell !== '');
    }
})();