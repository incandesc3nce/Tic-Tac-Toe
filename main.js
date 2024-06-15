function Cell(x, y) {
    const column = x;
    const row = y;
    let value = '';

    const getValue = () => value;
    const setValue = (mark) => {value = mark};

    return {getValue, setValue};
}

const GameBoard = (function() {
    const rows = 3;
    const columns = 3;

    const board = [];

    for (let x = 0; x < rows; x++) {
        let row = [];
        for (let y = 0; y < columns; y++) {
            row.push(Cell(x, y));
        }
        board.push(row);
    }

    const getBoard = () => board;
    const logBoard = () => {
        let outputBoard = [];
        for (let row = 0; row < rows; row++) {
            outputBoard.push(board[row].map(cell => cell.getValue()));
        }
        console.log(outputBoard);
    };
    
    const getCellByCoords = (row, column) => {
        return board[row][column];
    };

    const placeMark = (player, row, column) => {
        getCellByCoords(row, column).setValue(player.getMark());
    };

    return {getBoard, logBoard, placeMark, getCellByCoords};
})();

function Player(name) {
    let playerName = name;
    let score = 0;
    let mark = '';

    const setMark = (value) => {mark = value};
    const getMark = () => mark;
    const setName = (newName) => {playerName = newName};
    const getName = () => playerName;

    const increaseScore = () => {score++};
    const getScore = () => score;

    return {setMark, getMark, setName, getName, increaseScore, getScore};
}

const GameHandler = (function() {
    const player1 = Player('Player 1');
    player1.setMark('x');
    const player2 = Player('Player 2');
    player2.setMark('o');

    let gameIsFinished = false;

    let draws = 0;
    let activePlayer = player1;
    let totalRounds = 0;

    const getDraws = () => draws;

    const getActivePlayer = () => activePlayer;
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    
    const switchMarks = () => {
        const player1Mark = player1.getMark;
        player1.setMark(player2.getMark);
        player2.setMark(player1Mark);
    };
    const switchTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const checkGameState = (cell_x, cell_y) => {
        const cellMark = GameBoard.getCellByCoords(cell_x, cell_y).getValue();
        let finished = false;

        //check column 
        for (let i = 0; i < 3; i++) {
            if (GameBoard.getCellByCoords(cell_x, i).getValue() !== cellMark) { 
                break;
            }
            if (i === 2) {
                console.log(`${activePlayer.getName()} wins!`, '');
                activePlayer.increaseScore();
                finished = true;
            }
        }
        //check row
        for (let i = 0; i < 3; i++) {
            if(GameBoard.getCellByCoords(i, cell_y).getValue() !== cellMark) {
                break;
            }
            if (i === 2) {
                console.log(`${activePlayer.getName()} wins!`, '');
                activePlayer.increaseScore();
                finished = true;
            }
        }
        //check diagonal
        if (cell_x === cell_y) {
            for (let i = 0; i < 3; i++) {
                if (GameBoard.getCellByCoords(i, i).getValue() !== cellMark) {
                    break;
                }
                if (i === 2) {
                    console.log(`${activePlayer.getName()} wins!`, '');
                    activePlayer.increaseScore();
                    finished = true;
                }
            }
        }
        //check anti-diagonal
        if (cell_x + cell_y === 2) {
            for (let i = 0; i < 3; i++) {
                if(GameBoard.getCellByCoords(i, 2 - i).getValue() !== cellMark) {
                    break;
                }
                if (i === 2) {
                    console.log(`${activePlayer.getName()} wins!`, '');
                    activePlayer.increaseScore();
                    finished = true;
                }
            }
        }
        //check for tie
        if (totalRounds === 9) {
            console.log('It\'s a tie!', '');
            finished = true;
            draws += 1;
        }

        if (finished) {
            ScreenController.disableButtons();
            ScreenController.updateScores();
            gameIsFinished = true;
            ScreenController.setMessage('winner!');
        }
    }

    const playRound = (x, y) => {
        console.log(`${activePlayer.getName()}'s turn.`, '');
        
        GameBoard.placeMark(activePlayer, x, y);
        totalRounds++;

        GameBoard.logBoard();

        if (totalRounds >= 5) {
            checkGameState(x, y);
        }
        if (gameIsFinished) {
            return;
        }
        
        switchTurn();
        ScreenController.setMessage('your turn');
    };

    return {playRound, getActivePlayer, getDraws, switchMarks, getPlayer1, getPlayer2};
})();


const ScreenController = (function() {
    const board = document.querySelector('.board');
    const buttons = document.querySelectorAll('.board .cell button');

    const updateScreen = () => {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const cellMark = GameBoard.getCellByCoords(y, x).getValue();
                buttons[x + y * 3].textContent = cellMark;
            }    
        }
    };

    const setMessage = (message) => {
        const player = GameHandler.getActivePlayer();
        
        const activePlayer = player === GameHandler.getPlayer1() ? 'player1' : 'player2';
        const notActivePlayer = player === GameHandler.getPlayer1() ? 'player2' : 'player1';

        document.querySelector(`.${notActivePlayer} .message`).textContent = '';
        document.querySelector(`.${activePlayer} .message`).textContent = message;
    };

    const boardClickHandler = (event) => {
        const cell = event.target;
        cell.disabled = true;
        const x = parseInt(cell.getAttribute('x'));
        const y = parseInt(cell.getAttribute('y'));
        GameHandler.playRound(x, y);
        updateScreen();
    };

    const disableButtons = () => {
        buttons.forEach(button => button.disabled = true);
    };

    buttons.forEach(button => button.addEventListener('click', boardClickHandler));

    const updateScores = () => {
        document.querySelector('#player1-score').textContent = GameHandler.getPlayer1().getScore();
        document.querySelector('#player2-score').textContent = GameHandler.getPlayer2().getScore();
    };


    return {disableButtons, setMessage, updateScores};
})();

ScreenController.setMessage('your turn');