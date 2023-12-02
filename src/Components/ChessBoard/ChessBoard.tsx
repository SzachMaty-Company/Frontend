import './ChessBoard.css';
import React, { useState } from 'react';
//import Chess  from 'chess.js';

const startFEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function makeChess(fenString:string):string{
    let board:string="";
    const fenPieces = fenString.split(' ')[0].split('/').join(''); //Get the first portion //remove the row delimiters '/'

    //let i,j;
    const pieces=Array.from(fenPieces);
    let counter:number=0;
    let i=0;
    console.log(pieces);
    while(i<pieces.length){
        let item=pieces[i];
        console.log(i,item);
        let jump=parseInt(item);
        if(Number.isNaN(jump)){
            board+=counter===8?item:item+'|';
            counter++;
        }else{
            for(let j=0;j<jump;j++){
                board+=counter===8?" ":" |";
                counter++;
            }
        }
        if(counter===8){
            board+="\n________________\n";
            counter=0;
        }
        i++;
    }
    console.log(board);
    return board;
}

function ChessBoard()
{
    let [FEN,setFEN]= useState(startFEN);
    let startChess=makeChess(FEN);
    let [chess,setChess] = useState(startChess);
    return <p> <pre>{chess}</pre></p>;

}

export default ChessBoard;