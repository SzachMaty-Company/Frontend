import { CellObject } from "./ChessBoard";

//Translating fen to file name
const pieceDict:{[key:string]:string}={
    "P":"w-pawn",
    "R":"w-rook",
    "N":"w-knight",
    "B":"w-bishop",
    "Q":"w-queen",
    "K":"w-king",
    "p":"b-pawn",
    "r":"b-rook",
    "n":"b-knight",
    "b":"b-bishop",
    "q":"b-queen",
    "k":"b-king"
};

function Cell({color,cell,callback}:{color:string,cell:CellObject,callback:(cell:CellObject) => void}){
    return <div className={`${color} ${cell.available?"available":""}`} onClick={()=>callback(cell)}>
        <img className={`PieceImg ${pieceDict[cell.piece]} ${cell.choosed===true?"choosed":""}`}></img>
        </div>
}

export default Cell