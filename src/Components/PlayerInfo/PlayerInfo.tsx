import './PlayerInfo.css'
import { WHITE_FIGURES, BLACK_FIGURES } from '../../Constants'

export function PlayerInfo({name, figures, timer}:{name:string,figures:string,timer:number}){
    
    const color = (figures == WHITE_FIGURES) ? "white" : "black";

    const minutes = Math.floor(timer/60);
    const seconds = timer%60;

    const addLeadingZeros = (num:number) => {
        if (num < 10) {
            return "0"+num;
        }
        return num;
    }

    return <div className='PlayerInfo'>
        <table>
            <tr>

                <td>
                    <span style = {{'color': color}}>
                        ♕
                    </span>
                    Gracz {name}
                </td>
                <td>Czas {addLeadingZeros(minutes)}:{addLeadingZeros(seconds)}</td>
            </tr>
        </table>
    </div>
}