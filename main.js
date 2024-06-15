function Cell(number) {
    const placement = number;
    let value = '';

    const getValue = () => value;
    const setValue = (player) => {value = player};
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
        board.map((row) => {
            const rowValues = row.map((cell) => cell.getValue());
            console.log(rowValues);
        });
    };

    return {getBoard, logBoard}
})();

function Player(name) {
    let playerName = name;
    let score = 0;
    let mark = '';

    const setMark = (value) => {mark = value};
    const getMark = () => mark;  

    return {playerName, score, setMark, getMark};
}

GameBoard.logBoard();