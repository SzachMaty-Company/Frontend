import './ChessBoard.css';
import React, { useState } from 'react';
import {Chess}  from 'chess.js';
import { log } from 'console';

const col=["a","b","c","d","e","f","g","h"];
const ver=[8,7,6,5,4,3,2,1];
const pieceDict:{[key:string]:string}={
    "p":"w-pawn",
    "r":"w-rook",
    "n":"w-knight",
    "b":"w-bishop",
    "q":"w-queen",
    "k":"w-king",
    "P":"b-pawn",
    "R":"b-rook",
    "N":"b-knight",
    "B":"b-bishop",
    "Q":"b-queen",
    "K":"b-king",
    "_":"space"
};

function Cell({color,position,piece}:{color:string,position:string,piece:string}){
    return <div className={color}>
        <img className={`PieceImg ${pieceDict[piece]}`}></img>
        </div>
}



//Class for storing data from one cell in chess board
class CellObject {
    pos: string;
    piece: string;
    constructor(pos:string, piece:string) {
        this.pos = pos;
        this.piece = piece;
    }
}

function makeChess(fenString:string):CellObject[]{
    //Get pieces from fen string
    const fenPieces = fenString.split(' ')[0].split('/').join(''); //Get the first portion //remove the row delimiters '/'
    const pieces=Array.from(fenPieces);
    
    let board:CellObject[] =[];   //Chess board
    let versCounter=0;      //Verse counter
    let counter:number=0;   //Column counter
    let i=0;                //Iterator
    while(i<pieces.length){
        let item=pieces[i];
        let jump=parseInt(item);    //if nober, how many spaces
        //if item is not a number
        if(Number.isNaN(jump)){
            let key=col[counter]+ver[versCounter];
            let cell=new CellObject(key,item);
            board.push(cell);
            counter++;
        }else{
            for(let j=0;j<jump;j++){
                let key=col[counter]+ver[versCounter];
                let cell=new CellObject(key,"_"); //Not " ", because css make cell not equal size
                board.push(cell);
                counter++;
            }
        }
        //if verse ended
        if(counter===8){
            versCounter++;
            counter=0;
        }
        i++;
    }
    return board;
}

function ChessBoard()
{
    //Initialised component Chess
    let [chess,setChess]=useState(new Chess());
    //Get FEN string
    let startChess=makeChess(chess.fen());
    //Set Board
    let [chessBoard,setChessBoard] = useState(startChess);
    //Painting cells
    function colorCell(id:number) {
        //if row is Even, move color scheme by one
        if(Math.floor(id/8)%2==1){
            id++;
        }
        return id%2==0?"black":"white";
    };

    return <div className="board">
        {chessBoard.map((cell:CellObject,id:number) => (
        <Cell key={cell.pos} color={colorCell(id)} position={cell.pos} piece={cell.piece}></Cell>
    ))}
</div>;

}

export default ChessBoard;