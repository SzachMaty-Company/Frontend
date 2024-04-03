import {Cell,CellObject} from "./Cell";
import './ChessBoard.css';

const AWAITING = "AWAITING";

//Promotion choises, White
const choises = ["R","N","B","Q"];

//React component for display promotion decision
function Promotion({isVisible, playerFigureColor, callback}:{isVisible:boolean, playerFigureColor:boolean, callback:(choosenFigure:CellObject) => void}){
    return <div className="Promotion" style={{visibility: isVisible ? 'visible' : 'hidden'}}>
        <h4>Wybierz figurę:</h4>
        <div className="PromotionContent">
            {choises.map((choise:string,id:number) => (
            <Cell key={id} color={playerFigureColor?"white":"black"} cell={new CellObject(id as unknown as string,(!playerFigureColor)?choise.toLowerCase() :choise)} callback={callback}></Cell>
        ))}
        </div>
    </div>;
}

export {AWAITING, Promotion};