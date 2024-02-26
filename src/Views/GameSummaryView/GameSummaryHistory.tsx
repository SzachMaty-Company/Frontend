import { GameHistoryRecordInterface } from "./GameSummaryView";
import './GameSummaryView.css';

export default function GameSummaryHistory({title,gameHistory}:{title:string,gameHistory:GameHistoryRecordInterface[]}) {

    return <div className='GameSummaryHistory'>
        <h2>{title}</h2>
        <div className='GameSummaryHistoryMoves'>
            <table>
                <thead>
                    <tr>
                        <th>Gracz</th>
                        <th>Figura</th>
                        <th>Pozycja</th>
                        <th>Ruch do</th>
                    </tr>
                </thead>
                <tbody>
                    {gameHistory.map((record, index) => (
                        <tr>
                            <td>
                                {record.doneBy.isWhite ? "Biały" : "Czarny"}
                            </td>
                            <td>
                                {record.figure}
                            </td>
                            <td>
                                {record.position}
                            </td>
                            <td>
                                {record.moveTo}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}