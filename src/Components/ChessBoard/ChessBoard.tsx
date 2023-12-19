import './ChessBoard.css';
import React, { useEffect, useState } from 'react';
import {BLACK, Chess, WHITE}  from 'chess.js';
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
    console.log(pos);
    return reverseCol[pos.charAt(0)]+(parseInt(pos.charAt(1))-8)*-8;
}

const stFen="rn1qkbnr/3pNppp/8/8/8/8/PpPPPPPP/R1BQKBNR w KQkq - 0 6";

function ChessBoard()
{
    //Initialised component Chess
    let [chess,setChess]=useState(new Chess(stFen));
    let [chessChanged,setChessChanged]=useState(false);
    //Cell table
    let startChess=makeChess(chess.fen());
    //Set Board
    let [chessBoard,setChessBoard] = useState(startChess);
    //Clicked cell
    let [cellClicked,setCellClicked]=useState("");
    //Promotion
    let [canPromote,setCanPromote]=useState("");
    let [promoting,setPromoting]=useState(false);

    useEffect(()=>{
        console.log(chess.fen());
        let cellTable=makeChess(chess.fen());
        setChessBoard(cellTable);
    },[chessChanged])

    const promotionClick = (cell:CellObject)=>{
        if(!promoting){
            return;
        }
        let m=canPromote+cell.piece;
        chess.move(m);
        setChessChanged(!chessChanged);
        setPromoting(false);
    }

    const cellOnClick = (cell:CellObject) =>{
        console.log(cellClicked+" "+cell.pos)
        if(promoting){
            return;
        }
        let ddd=chess.getCastlingRights(chess.turn()==="b"?BLACK:WHITE);
        //Castling short
        if(((cellClicked==="e8" && cell.pos==="h8") || (cellClicked==="e1" && cell.pos==="h1")) && ddd.k){
            try{
                console.log("O-O");
                chess.move("O-O");
                setChessChanged(!chessChanged);
            }catch{}
            
        }
        //Castling long
        else if(((cellClicked==="e8" && cell.pos==="a8") || (cellClicked==="e1" && cell.pos==="a1")) && ddd.q){
            try{
                console.log("O-O-O");
                chess.move("O-O-O");
                setChessChanged(!chessChanged);
            }catch{}
        }
        if(cellClicked!=="" && chessBoard[reverseCellPosition("",cellClicked)].piece!=="_"){
            //Promotion
            if(canPromote!=="" && cellClicked===canPromote){
                setPromoting(true);
                setCanPromote(cellClicked+"x"+cell.pos+"=");
            }else{
                setCanPromote("");
            }
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
        console.log("Available moves ",availableMoves);
        if(availableMoves.length!=0){
            availableMoves.forEach((m)=>{
                //Parsing moves
                let move:string=m;
                //Remove Check and Mate symbols
                if(move.indexOf("+")===m.length-1 || move.indexOf("#")===m.length-1){
                    move=move.substring(0,move.length-1);
                }
                //Add promotions
                if(move.includes("=")){
                    setCanPromote(cell.pos);
                    move=move.slice(0,move.length-2);

                    console.log(move);
                }
                //Set cell on legal position and change it to avaiable. slice(-2) to cut of unnecessary info
                if(move!=="O-O-O" && move!=="O-O"){
                    move=move.slice(-2);
                }


                chessCopy[reverseCellPosition(cell.piece,move)].available=true;
            })
        }
        //Set cell to choosed
        cell.choosed=true;
        setCellClicked(cell.pos);
        console.log("Click "+cell.pos)
        //seting chessBoard
        setChessBoard(chessCopy);
    };

    return <>
        <div className="board">
            {chessBoard.map((cell:CellObject,id:number) => (
            <Cell key={cell.pos} color={colorCell(id)} cell={cell} callback={cellOnClick}></Cell>
        ))}
        </div>
        <Promotion isVisible={true} isPromotionActive={promoting} callback={promotionClick}/>
    </>;
}

const choises = ["R","K","B","Q"];

function Promotion({isVisible, isPromotionActive,callback}:{isVisible:boolean,isPromotionActive:boolean,callback:(cell:CellObject) => void}){
    return <div className="Promotion" hidden={!isVisible}>
        {choises.map((choise:string,id:number) => (
            <Cell key={id} color={isPromotionActive?colorCell(1):colorCell(0)} cell={new CellObject(""+id,choise)} callback={callback}></Cell>
        ))}
    </div>;
}


export default ChessBoard;