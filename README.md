# Chess

A simple tool for generating a chess board and validate moves. 

* This tool does not have a game management system, therfor it does 
not check who's turn is it. 
Castling, pawn promotion, pawn two-square advance, chess mate and etc. are not supported (yet).

## Example:

const chessBoard = new Chess(); // Initialize a new chess board. 
chessBoard.move('b2',b3') // 'b2' - source, 'b3' - destination 

![Board](/BoardSetup.jpg?raw=true "Title")

![Board](WalnutBoard.jpg?raw=true "Title")