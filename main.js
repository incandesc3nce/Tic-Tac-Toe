function Cell(number) {
    const placement = number;
    let value = '';

    const getValue = () => value;
    const setValue = (mark) => {value = mark};
    const getPlacement = () => placement;

    return {getValue, setValue, getPlacement};
}

const GameBoard = (function() {
    const rows = 3;
    const columns = 3;

    const board = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let k = 0; k < columns; k++) {
            row.push(Cell(1 + (i*3) + k));
        }
        board.push(row);
    }

    const getBoard = () => board;
    const logBoard = () => {
        let outputBoard = [];
        board.forEach(row => {
            outputBoard.push(row.map(cell => cell.getValue()));
        });
        console.log(outputBoard);
    };

    const placeMark = (player, cellNumber) => {
        for (let i = 0; i < rows; i++) {
            for (let k = 0; k < columns; k++) {
                if (board[i][k].getValue() !== '') {
                    continue;
                }
                if (board[i][k].getPlacement() === cellNumber) {
                    board[i][k].setValue(player.getMark());
                }
            }
        }
    };

    return {getBoard, logBoard, placeMark};
})();

function Player(name) {
    let playerName = name;
    let score = 0;
    let mark = '';

    const setMark = (value) => {mark = value};
    const getMark = () => mark;
    const setName = (newName) => {playerName = newName};
    const getName = () => playerName;

    return {playerName, score, setMark, getMark, setName, getName};
}

const GameHandler = (function() {
    const player1 = Player('Player 1');
    player1.setMark('x');
    const player2 = Player('Player 2');
    player2.setMark('o');

    let activePlayer = player1;
    let totalRounds = 0;
    
    const switchMarks = () => {
        const player1Mark = player1.getMark;
        player1.setMark(player2.getMark);
        player2.setMark(player1Mark);
    };
    const switchTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const playRound = () => {
        GameBoard.logBoard();
        console.log(`${activePlayer.getName()}'s turn.`, '');
        
        let chosenCell = prompt('Choose a cell (1-9): ');
        chosenCell = parseInt(chosenCell);
        GameBoard.placeMark(activePlayer, chosenCell);
        totalRounds++;

        GameBoard.logBoard();
        switchTurn();
    };

    return {playRound};
})();
