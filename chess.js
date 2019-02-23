function checkIfPathIsClear(startIndex, xDiff, yDiff, chessBoard) {
    const xSign = Math.sign(xDiff);
    const ySign = Math.sign(yDiff);
    const steps = Math.max(Math.abs(xDiff),Math.abs(yDiff));
    for (let i=1; i < steps; i++) {
        if (chessBoard[startIndex.y + i*ySign][startIndex.x + i*xSign]) {
            return false;
        }
    }
    return true;
}

class ChessPiece {
    constructor(color) {
        this.color = color;
      }
}

class King extends ChessPiece {

    isValidStep(startIndex, destinationIndex) {
        const xDiff = Math.abs(destinationIndex.x - startIndex.x);
        const yDiff = Math.abs(destinationIndex.y - startIndex.y);
        return ( xDiff < 2 && yDiff < 2 );
    }
}

class Queen extends ChessPiece {

    isValidStep(startIndex, destinationIndex, chessBoard) {
        const xDiff = destinationIndex.x - startIndex.x;
        const yDiff = destinationIndex.y - startIndex.y;
        if ( Math.abs(xDiff) === Math.abs(yDiff) || xDiff === 0 || yDiff === 0 ) {
            return checkIfPathIsClear(startIndex,xDiff,yDiff,chessBoard);
        } else {
            return false;
        }
    }
}

class Rook extends ChessPiece {

    isValidStep(startIndex, destinationIndex, chessBoard) {
        const xDiff = destinationIndex.x - startIndex.x;
        const yDiff = destinationIndex.y - startIndex.y;
        if ( xDiff === 0 || yDiff === 0 ) {
            return checkIfPathIsClear(startIndex,xDiff,yDiff,chessBoard);
        } else {
            return false;
        }
    }
}

class Pawn extends ChessPiece {

    isValidStep(startIndex, destinationIndex, chessBoard) {
        const direction = (this.color === 'black' ? -1 : 1);
        const xDiff = destinationIndex.x - startIndex.x;
        const yDiff = destinationIndex.y - startIndex.y;
        if ( xDiff === 0 && yDiff*direction === 1 ) {
            return !chessBoard[destinationIndex.y][destinationIndex.x]; //Destination should be free
        } else if ( Math.abs(xDiff) === 1 && yDiff*direction === 1 ) {
            return !!chessBoard[destinationIndex.y][destinationIndex.x]; //Destination should not be free
        } else {
            return false;
        }
    }
}

class Bishop extends ChessPiece {

    isValidStep(startIndex, destinationIndex, chessBoard) {
        const xDiff = destinationIndex.x - startIndex.x;
        const yDiff = destinationIndex.y - startIndex.y;
        if (Math.abs(xDiff) === Math.abs(yDiff)) {
            return checkIfPathIsClear(startIndex,xDiff,yDiff,chessBoard);
        } else {
            return false;
        }
    }
}

class Knight extends ChessPiece {
    isValidStep(startIndex, destinationIndex) {
        const xDiff = Math.abs(destinationIndex.x - startIndex.x);
        const yDiff = Math.abs(destinationIndex.y - startIndex.y);
        return ( xDiff === 2 && yDiff === 1 || xDiff === 1 && yDiff === 2);  
    }
}

function generateChessBoard() {
    const chessBoard = new Array(8);
    function placePawns(chessBoard,i,color) {
        for (let j=0; j<8; j++) {
            chessBoard[i][j] = new Pawn(color);
        }
    }
    for (let i = 0; i < 8; i++) {
        chessBoard[i] = new Array(8);
        if (i===1) {
            placePawns(chessBoard,i, 'white');
        } else if(i===6) {
            placePawns(chessBoard,i, 'black');
        } else if (i===0 || i===7) {
            const color = (i===0 ? 'white':'black');
            for (let j=0; j<8; j++) {
                if (j===0 || j===7) {
                    chessBoard[i][j] = new Rook(color);
                } else if (j===1 || j===6) {
                    chessBoard[i][j] = new Knight(color);
                } else if (j===2 || j===5) {
                    chessBoard[i][j] = new Bishop(color);
                } else if (j===3) {
                    chessBoard[i][j] = new Queen(color);
                } else if (j===4) {
                    chessBoard[i][j] = new King(color);
                }
            }
        } 
    }
    return chessBoard;
  }

function parseIndex(index) {
    const indexMap = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6,
        'h': 7
    }
    if (typeof(index) === 'string' && index.length === 2) {
        const x = indexMap[index[0].toLowerCase()];
        const y = index.charCodeAt(1) - 49; // '0' = 48. Mapping: '1'-0, '2'-1...
        if (typeof(y) === 'number' && x<8 && x>=0 ) {
            return { x, y };
        } else {
            throw 'Coordinates are not in the correct format'; 
        }
    } else {
        throw 'Coordinates are not in the correct format';
    }
}

function isMoveValid(startIndex, destinationIndex) {
    const chessBoard = this.chessBoard;
    const startPiece = chessBoard[startIndex.y][startIndex.x];
    const destinationPiece = chessBoard[destinationIndex.y][destinationIndex.x];
    if (startPiece && (!destinationPiece || ( startPiece.color !== destinationPiece.color))) {
        return startPiece.isValidStep(startIndex, destinationIndex, chessBoard);
    } else {
        return false;
    }
}

class Chess {

    constructor() {
      this.chessBoard = generateChessBoard();
    }

    move(start,destination) {
        try {
            const startIndex =  parseIndex(start);
            const destinationIndex = parseIndex(destination);
            if (isMoveValid.bind(this)(startIndex, destinationIndex)) {
                //move the piece
                const pieceToMove = this.chessBoard[startIndex.y][startIndex.x];
                this.chessBoard[startIndex.y][startIndex.x] = null;
                this.chessBoard[destinationIndex.y][destinationIndex.x] = pieceToMove;
            } else {
                throw 'Move is not valid';
            }
        } catch (error) {
            console.warn('Could not move the chess piece: ', error);
        }
        return this.chessBoard;

    }
  
  }
  
  const testBoard = () => {
        const chessBoard = new Chess();
        console.log('Test invalid moves:');
        chessBoard.move('a2','z1');
        chessBoard.move('a1','b8');
        chessBoard.move('d1','d2');
        console.log('Test some valid moves:');
        chessBoard.move('d2','d3');
        chessBoard.move('c1','e3');
        chessBoard.move('a2','a3');
        chessBoard.move('a3','a4');
        chessBoard.move('b7','b6');
        console.log(chessBoard.move('a1','a3'));
        console.log('Test an invalid move (path is blocked):');
        chessBoard.move('a3','h3');
        console.log('Clearing path:');
        console.log(chessBoard.move('d3','d4'));
        chessBoard.move('e3','g5');
        console.log(chessBoard.move('a3','h3'));
        console.log(chessBoard.move('h3','h7'));
        console.log(chessBoard.move('h7','h6'));
        console.log(chessBoard.move('g7','h6'));
  }