import { MainActionButton, SecondaryActionButton } from '../../Components/ActionButtons/ActionButtons';
import ContentWrapper from '../ContentWrapper';
import './GameSummaryView.css'

interface PlayerFigureColors {
    isWhite: boolean;
}

interface GameHistoryRecordInterface {
    doneBy: PlayerFigureColors;
    figure: string;
    position: string;
}

interface GameSummaryViewProps {
    playerWhiteFigures: string;
    playerBlackFigures: string;
    winner: PlayerFigureColors;
    timerSettings: string;
    gameStart: string;
    gameHistory: GameHistoryRecordInterface[];
}

const GameSummaryView: React.FC<GameSummaryViewProps> = ({playerWhiteFigures, playerBlackFigures, winner, timerSettings, gameStart, gameHistory}) => {
    return <ContentWrapper isCentered={true}>
        <div className='GameSummaryView'>
             <h1>Podsumowanie partii</h1>
            <table className='GameSummaryStats'>
                <tr>
                    <td>Gracz białych</td>
                    <td>{playerWhiteFigures}</td>
                </tr>
                <tr>
                    <td>Gracz czarnych</td>
                    <td>{playerBlackFigures}</td>
                </tr>
                <tr>
                    <td>Zwycięzca</td>
                    <td>
                        {winner.isWhite ? playerWhiteFigures : playerBlackFigures} 
                    </td>
                </tr>
                <tr>
                    <td>Tryb Czasowy</td>
                    <td>{timerSettings}</td>
                </tr>
                <tr>
                    <td>Rozpoczęcie gry</td>
                    <td>{gameStart}</td>
                </tr>
            </table>
            <div className='GameSummaryHistory'>
                <h2>Historia gry:</h2>
                <div className='GameSummaryHistoryMoves'>
                    <table>
                        <thead>
                            <tr>
                                <th>Gracz</th>
                                <th>Figura</th>
                                <th>Pozycja</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='GameSummaryControls'>
                <table>
                    <tr>
                        <td><MainActionButton text="Rewanż"></MainActionButton></td>
                        <td><SecondaryActionButton text="Nowa gra"></SecondaryActionButton></td>
                    </tr>
                </table>
            </div>
        </div>
   
    </ContentWrapper>;
}

export default GameSummaryView;