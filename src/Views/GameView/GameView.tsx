import ChessBoard from '../../Components/ChessBoard/ChessBoard';
import ContentWrapper from '../ContentWrapper';
import './GameView.css'
import { PlayerInfo } from '../../Components/PlayerInfo/PlayerInfo';
import React, { useState, useEffect } from 'react';
import { WHITE_FIGURES, BLACK_FIGURES } from '../../Constants';
import { Chess, BLACK, WHITE } from 'chess.js';
import { Button } from '../../Components/Buttons/Buttons';
import { MainActionButton } from '../../Components/ActionButtons/ActionButtons';
import InGameChat from '../../Components/IngameChat/InGameChat';
import {AWAITING, Promotion} from '../../Components/ChessBoard/Promotion';
import { CellObject } from '../../Components/ChessBoard/Cell';
import { useLocation } from 'react-router-dom';
import { GameLogicServiceClient } from '../../ApiHelpers/GameLogicServiceClient';
import { send } from 'process';

interface ChatMessageProps {
    text: string;
    sideOfChat: boolean;
    date: Date;
}
let gameSettings: {};
let gameLogicClient : GameLogicServiceClient;

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InVzZXIxIn0.XryQwJ1cat_nQXmsViRRwlOhEVo8yesd6y7XYn0JDFw";

export default function GameView() {
    const [messages, setMessages] = useState<ChatMessageProps[]>([]);
    const addMessage = (message: string) => {};
    
    let [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    let [promotionChoiceStatus, setPromotionChoiceStatus] = useState(AWAITING);
    let [lastCellClicked, setlastCellClicked] = useState("");
    const location = useLocation();
    const { gameSettings } = location.state;
    const clientChooseWhitePierceColor = gameSettings.player1 == "user1" && gameSettings.player1PieceColor == "WHITE";

    useEffect(()=>{
        gameLogicClient = new GameLogicServiceClient(
            TOKEN,
            "localhost:8000",
             gameSettings.gameCode,
             clientChooseWhitePierceColor,
             (s) => {
                setFen(s);
             }
        );

        gameLogicClient.connect();
    }, []);

    let sendMove = (move: string) =>
    {
        console.log("move has been sent " + move);
        gameLogicClient.sendMove(move);
    };

    let processPromotion = (choosenFigure:CellObject) => {
        let figureName = choosenFigure.piece;

        sendMove(promotionChoiceStatus+figureName);

        setPromotionChoiceStatus(AWAITING);
    };


    let processMove = (from: string, to:string) => {


        if (promotionChoiceStatus == AWAITING)
        {
            try{
                let validator = new Chess(fen);
                let move = validator.move(from+to);

                let castRight=validator.getCastlingRights(validator.turn()==="b"?BLACK:WHITE);
                if (clientChooseWhitePierceColor && to[1]=='8')
                {
                    setPromotionChoiceStatus(from+to);
                }
                else if (!clientChooseWhitePierceColor && to[1]=='1')
                {
                    setPromotionChoiceStatus(from+to);
                }
                else
                {
                    sendMove(from + to);
                }
            }
            catch 
            {
                console.log("illegal move! incident reported to the local police station");
            }
        }
        else
        {
            console.log("cannot move while promotion choice status ongoing!");
        }
    };


    let handleCellClicked = (currentCell: string) => {

        if (lastCellClicked)
        {
            processMove(lastCellClicked, currentCell);
            setlastCellClicked("");
        }
        else
        {
            setlastCellClicked(currentCell);
        }
    };

    useEffect(()=>{
        
    }, [fen]);





    return <ContentWrapper isCentered={true}>
        <div className="gameViewHolder">
            <div className='gamePromotionSide'>
                <Promotion isVisible={promotionChoiceStatus != AWAITING ? true : false} playerFigureColor={clientChooseWhitePierceColor} callback={processPromotion} />
            </div>
            <div className="gameSide">
                <PlayerInfo name={gameSettings.player1PieceColor == "BLACK" ? gameSettings.player1 : gameSettings.player2} figures={BLACK_FIGURES} timer={0}></PlayerInfo>
                <ChessBoard chessFen={fen} callbackClick={handleCellClicked}/>
                <PlayerInfo name={gameSettings.player1PieceColor == "WHITE" ? gameSettings.player1 : gameSettings.player2} figures={WHITE_FIGURES} timer={0}></PlayerInfo>
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