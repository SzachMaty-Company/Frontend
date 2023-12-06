import { CellObject } from "./ChessBoard";

//Translating fen to file name
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

function Cell({color,cell,callback}:{color:string,cell:CellObject,callback:(cell:CellObject) => void}){
    return <div className={color} onClick={()=>callback(cell)}>
        <img className={`PieceImg ${pieceDict[cell.piece]}`}></img>
        </div>
}

export default Cell