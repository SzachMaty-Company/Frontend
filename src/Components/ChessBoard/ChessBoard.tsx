import './ChessBoard.css';
import React, { useEffect, useState } from 'react';
import {BLACK, Chess, WHITE}  from 'chess.js';
import {Cell,CellObject} from './Cell';

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
        let jump=parseInt(item);    //if number, how many spaces
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
    //if row is Odd, move color scheme by one
    if(Math.floor(id/8)%2===1){
        id++;
    }
    return id%2===1?"black":"white";
};

//Calculate position of cell in table
function reverseCellPosition(piece:string,pos:string):number{
    //Castling short
    if(pos==="O-O"){
    //Black king
        if(piece==="k")
            return reverseCellPosition(piece,"h8");
        //White king
        else if(piece==="K")
            return reverseCellPosition(piece,"h1");
    }
    //Castling long
    else if(pos==="O-O-O"){
        //Black king
        if(piece==="k")
            return reverseCellPosition(piece,"a8");
        //White king
        else if(piece==="K")
            return reverseCellPosition(piece,"a1");
    }
    return reverseCol[pos.charAt(0)]+(parseInt(pos.charAt(1))-8)*-8;
}

function ChessBoard({chessFen, callbackClick}:{chessFen:string, callbackClick:(cell:CellObject)=>void})
{
    //Cell table
    let startChess=makeChess(chessFen);
    //Set Board
    let [chessBoard,setChessBoard] = useState(startChess);
    let [displayAvailablePositionsFlag, setDisplayAvailablePositionsFlag] = useState(false);
    let chess = new Chess();
    chess.load(chessFen);

    //Refreshing chess board
    useEffect(()=>{
        let cellTable=makeChess(chess.fen());
        setChessBoard(cellTable);
    },[chessFen])

    //Handle clicking the board
    const cellOnClick = (cell:CellObject) =>{

        callbackClick(cell);

        const needToDisplay = !displayAvailablePositionsFlag;
        setDisplayAvailablePositionsFlag(needToDisplay);

        //ResetBoard
        //Copy
        let chessCopy:CellObject[]=[];
        chessBoard.forEach((c,i)=>{
                chessCopy.push(c);
                chessCopy[i].choosed=false;
                chessCopy[i].available=false;
        });
        if (needToDisplay)
        {
            //Get avaiable cells
            let currentPos:any=cell.pos;
            let availableMoves=chess.moves({ square: currentPos });
            if(availableMoves.length!==0){
                availableMoves.forEach((m)=>{
                //Parsing moves
                let move:string=m;
                //Remove Check and Mate symbols
                if(move.indexOf("+")===m.length-1 || move.indexOf("#")===m.length-1){
                    move=move.substring(0,move.length-1);
                }
                //Add promotions
                if(move.includes("=")){
                    move=move.slice(0,move.length-2);
                }
                //Set cell on legal position and change it to avaiable. slice(-2) to cut of unnecessary info
                if(move!=="O-O-O" && move!=="O-O"){
                    move=move.slice(-2);
                }


                if (move == "O-O")
                {
                    if (currentPos == "e1")
                        move = "g1";
                    else if (currentPos == "e8")
                        move = "g8";
                }
                else if (move == "O-O-O")
                {
                    if (currentPos == "e1")
                        move = "c1";
                    else if (currentPos == "e8")
                        move = "c8";
                }

                console.log(move);
                chessCopy[reverseCellPosition(cell.piece,move)].available=true;
            })
            setChessBoard(chessCopy);
            }
        }
        else
        {
            setChessBoard(chessCopy);
        }

    };

    return <>
        <div className="board">
            {chessBoard.map((cell:CellObject,id:number) => (
            <Cell key={cell.pos} color={colorCell(id)} cell={cell} callback={cellOnClick}></Cell>
        ))}
        </div>
    </>;
}
export default ChessBoard;