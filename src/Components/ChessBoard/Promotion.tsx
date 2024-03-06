import {Cell,CellObject} from "./Cell";
import './ChessBoard.css';

//Promotion choises, White
const choises = ["R","N","B","Q"];

//React component for display promotion decision
export default function Promotion({isVisible, whoseTurn,callback}:{isVisible:boolean,whoseTurn:string,callback:(cell:CellObject) => void}){
    return <div className="Promotion" style={{visibility: isVisible ? 'visible' : 'hidden'}}>
        <h4>Wybierz figurę:</h4>
        <div className="PromotionContent">
            {choises.map((choise:string,id:number) => (
            <Cell key={id} color={whoseTurn==='b'?"white":"black"} cell={new CellObject(id as unknown as string,whoseTurn==='b'?choise.toLowerCase() :choise)} callback={callback}></Cell>
        ))}
        </div>
    </div>;
}