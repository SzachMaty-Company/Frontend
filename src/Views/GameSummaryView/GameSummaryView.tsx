import { MainActionButton, SecondaryActionButton } from '../../Components/ActionButtons/ActionButtons';
import ContentWrapper from '../ContentWrapper';
import GameSummaryHistory from './GameSummaryHistory';
import './GameSummaryView.css'

export interface PlayerFigureColors {
    isWhite: boolean;
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
            <GameSummaryHistory title='Historia gry:' gameHistory={gameHistory}/>
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