import ChessBoard from '../../Components/ChessBoard/ChessBoard';
import ContentWrapper from '../ContentWrapper';
import './GameView.css'
import { PlayerInfo } from '../../Components/PlayerInfo/PlayerInfo';
import React, { useState, useEffect } from 'react';
import { WHITE_FIGURES, BLACK_FIGURES } from '../../Constants';
import { Chess } from 'chess.js';
import { Button } from '../../Components/Buttons/Buttons';
import { MainActionButton } from '../../Components/ActionButtons/ActionButtons';
import InGameChat from '../../Components/IngameChat/InGameChat';
import Promotion from '../../Components/ChessBoard/Promotion';
import { CellObject } from '../../Components/ChessBoard/Cell';
import { useLocation } from 'react-router-dom';
import { GameLogicServiceClient } from '../../ApiHelpers/GameLogicServiceClient';

interface ChatMessageProps {
    text: string;
    sideOfChat: boolean;
    date: Date;
}
let gameSettings: {};
let gameLogicClient : GameLogicServiceClient;
let chess : Chess = new Chess();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InVzZXIxIn0.XryQwJ1cat_nQXmsViRRwlOhEVo8yesd6y7XYn0JDFw";

export default function GameView() {
    let [chessChanged, setChessChanged] = useState(false);
    let [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    let [numberOfMoves, setNumberOfMoves]  = useState(0);

    const chessChangedCallback = (positionFrom: string, positionTo:string) => {
        let state = chessChanged;
        setChessChanged(!state);

        gameLogicClient.sendMove(`${positionFrom}${positionTo}`);
    }

    let [canPromote, setCanPromote] = useState("");    //Define from which cell pawn can promote or when he go
    let [promoting, setPromoting] = useState(false);

    const promotionCallback = (promote: boolean, figurePromote: string) => {
        setPromoting(promote);
        setCanPromote(figurePromote);
    }

    //Handle promotion choise
    const promotionClick = (cell: CellObject) => {
        //If promotions is invalid, skip
        if (!promoting) {
            return;
        }
        //Make move
        let m = canPromote + cell.piece;


        //chess.move(m);
        setChessChanged(!chessChanged); //Refresh board
        setPromoting(false);    //Reset promotion trigger
    }

    const location = useLocation();
    const { gameSettings } = location.state;

    const gameTime = parseInt(gameSettings.gameTime)*60;
    const [timerPlayerBlack, setTimerBlack] = useState(gameTime);
    const [timerPlayerWhite, setTimerWhite] = useState(gameTime);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimerWhite(prevTimer => ((prevTimer > 0 && (numberOfMoves > 0 && numberOfMoves%2==0)) ? prevTimer - 1 : prevTimer));
        }, 1000);
        // Cleanup the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures the effect runs only once on mount
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimerBlack(prevTimer => ((prevTimer > 0 && (numberOfMoves%2!=0)) ? prevTimer - 1 : prevTimer));
        }, 1000);
        // Cleanup the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [numberOfMoves]); // Empty dependency array ensures the effect runs only once on mount


    useEffect(()=>{

        console.log("Game settings:", gameSettings);


        //TODO: validate if player is white


        const clientChooseWhitePierceColor = gameSettings.player1 == "user1" && gameSettings.player1PieceColor == "WHITE";
        gameLogicClient = new GameLogicServiceClient(
            TOKEN,
            "localhost:8000",
             gameSettings.gameCode,
             clientChooseWhitePierceColor,
             (s) => {
                setFen(s);
                numberOfMoves = numberOfMoves+1;
                setNumberOfMoves(numberOfMoves);
                console.log(numberOfMoves);
             }
        );

        gameLogicClient.connect();
    }, []);

    useEffect(()=>{

    }, [fen]);

    const [messages, setMessages] = useState<ChatMessageProps[]>([
        {
            text: 'Hello!',
            sideOfChat: true,
            date: new Date(),
        },
        {
            text: 'Hi there!',
            sideOfChat: false,
            date: new Date(),
        },
        // Add more messages as needed
    ]);

    const addMessage = (message: string) => {
        const newMessage: ChatMessageProps = {
            text: message,
            sideOfChat: false,
            date: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

;

    return <ContentWrapper isCentered={true}>
        <div className="gameViewHolder">
            <div className='gamePromotionSide'>
                <Promotion isVisible={promoting} whoseTurn={chess.turn()} callback={promotionClick} />
            </div>
            <div className="gameSide">
                <PlayerInfo name={gameSettings.player1PieceColor == "BLACK" ? gameSettings.player1 : gameSettings.player2} figures={BLACK_FIGURES} timer={timerPlayerBlack}></PlayerInfo>
                <ChessBoard chessFen={fen} chessChanged={chessChanged} chessChangedCallback={chessChangedCallback} promotionCallback={promotionCallback} isPromote={promoting} figurePromote={canPromote} />
                <PlayerInfo name={gameSettings.player1PieceColor == "WHITE" ? gameSettings.player1 : gameSettings.player2} figures={WHITE_FIGURES} timer={timerPlayerWhite}></PlayerInfo>
            </div>
            <div className="gameControlSide">
                <div className="gameControlHolder">
                    <div className="surrenderButtonHolder">
                        <MainActionButton text="Poddaj się"></MainActionButton>
                    </div>
                    <div className="chatHolder">
                        <InGameChat messages={messages} sentMessage={addMessage} closeable={false} title='zioooobro' hidden={false} hide={()=>{}}></InGameChat>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
}