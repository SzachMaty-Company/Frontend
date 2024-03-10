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

//React component for displaying cell
export function Cell({color,cell,callback}:{color:string,cell:CellObject,callback:(cell:CellObject) => void}){

    return <div 
        onDrop={()=>callback(cell)}
        onDragOver={(e) => e.preventDefault()}
        className={`${color} ${cell.available?"available":""}`} 
        onClick={()=>callback(cell)}>
        <img
            draggable={true}
            onDragStart={()=>callback(cell)}
            className={`PieceImg ${pieceDict[cell.piece]} ${cell.choosed===true?"choosed":""}`}
        />
        </div>
}

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