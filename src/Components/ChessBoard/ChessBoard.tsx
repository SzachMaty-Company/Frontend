import './ChessBoard.css';
import React, { useEffect, useState } from 'react';
import {Chess}  from 'chess.js';
import { log } from 'console';
import Cell from './Cell';

const col=["a","b","c","d","e","f","g","h"];

const reverseCol:{[key:string]:number}={
    "a":0,
    "b":1,
    "c":2,
    "d":3,
    "e":4,
    "f":5,
    "g":6,
    "h":7
};

//Class for storing data from one cell in chess board
export class CellObject {
    pos: string;
    piece: string;
    choosed:boolean;
    available:boolean;
    constructor(pos:string, piece:string) {
        this.pos = pos;
        this.piece = piece;
        this.choosed = false;
        this.available = false;
    }
}

function makeChess(fenString:string):CellObject[]{
    //Get pieces from fen string
    const fenPieces = fenString.split(' ')[0].split('/').join(''); //Get the first portion //remove the row delimiters '/'
    const pieces=Array.from(fenPieces);
    
    let board:CellObject[] =[];   //Chess board
    let versCounter=8;      //Verse counter
    let counter:number=0;   //Column counter
    let i=0;                //Iterator
    while(i<pieces.length){
        let item=pieces[i];
        let jump=parseInt(item);    //if nober, how many spaces
        //if item is not a number
        if(Number.isNaN(jump)){
            let key=col[counter]+versCounter;
            let cell=new CellObject(key,item);
            board.push(cell);
            counter++;
        }else{
            for(let j=0;j<jump;j++){
                let key=col[counter]+versCounter;
                let cell=new CellObject(key,"_"); //Not " ", because css make cell not equal size
                board.push(cell);
                counter++;
            }
        }
        //if verse ended
        if(counter===8){
            versCounter--;
            counter=0;
        }
        i++;
    }
    return board;
};

//Coloring cells
function colorCell(id:number):string {
    //if row is Even, move color scheme by one
    if(Math.floor(id/8)%2===1){
        id++;
    }
    return id%2===1?"black":"white";
};

//Calculate position of cell in table
function reverseCellPosition(pos:string):number{
    return reverseCol[pos.charAt(0)]+(parseInt(pos.charAt(1))-8)*-8;
}

function ChessBoard()
{
    //Initialised component Chess
    let [chess,setChess]=useState(new Chess());
    let [chessChanged,setChessChanged]=useState(false);
    //Cell table
    let startChess=makeChess(chess.fen());
    //Set Board
    let [chessBoard,setChessBoard] = useState(startChess);
    //Clicked cell
    let [cellClicked,setCellClicked]=useState("");

    useEffect(()=>{
        console.log("reload");
        let cellTable=makeChess(chess.fen());
        setChessBoard(cellTable);
    },[chessChanged])

    const cellOnClick = (cell:CellObject) =>{
        if(cell.piece==="_" && chessBoard[reverseCellPosition(cellClicked)].piece!=="_"){
            try{
                console.log({from: cellClicked, to: cell.pos});
                console.log("before move");
                console.log(chess.fen());
                chess.move({from: cellClicked, to: cell.pos});
                console.log("after move");
                console.log(chess.fen());
                setChessChanged(!chessChanged);
            }catch(err){}
            
        }
        //ResetBoard
        let chessCopy:CellObject[]=[];
        chessBoard.forEach((c,i)=>{
            chessCopy.push(c);
            chessCopy[i].choosed=false;
            chessCopy[i].available=false;
        })
        //Get avaiable cells
        let currentPos:any=cell.pos;
        let availableMoves=chess.moves({ square: currentPos });
        if(availableMoves.length!=0){
            availableMoves.forEach((m)=>{
                //Set cell on legal position and change it to avaiable. slice(-2) to cut of unnecessary info
                chessCopy[reverseCellPosition(m.slice(-2))].available=true;
            })
        }
        //Set cell to choosed
        cell.choosed=true;
        setCellClicked(cell.pos);
        console.log(cell.pos)

        setChessBoard(chessCopy);

        console.log(chessBoard);
    };

    return <div className="board">
        {chessBoard.map((cell:CellObject,id:number) => (
        <Cell key={cell.pos} color={colorCell(id)} cell={cell} callback={cellOnClick}></Cell>
    ))}
</div>;

}

export default ChessBoard;