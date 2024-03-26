import './GameSummaryView.css';

export default function GameSummaryHistory({title,gameHistory}:{title:string,gameHistory:string[]}) {

    return <div className='GameSummaryHistory'>
        <h2>{title}</h2>
        <div className='GameSummaryHistoryMoves'>
            <table>
                <thead>
                    <tr>
                        <th>Gracz</th>
                        <th>Ruch</th>
                    </tr>
                </thead>
                <tbody>
                    {gameHistory.map((record, index) => (
                        <tr>
                            <td>
                                {index%2==0 ? "Biały" : "Czarny"}
                            </td>
                            <td>
                                {record}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}