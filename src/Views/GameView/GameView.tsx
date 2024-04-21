import ChessBoard from '../../Components/ChessBoard/ChessBoard';
import ContentWrapper from '../ContentWrapper';
import './GameView.css'
import { PlayerInfo } from '../../Components/PlayerInfo/PlayerInfo';
import React, { useState, useEffect } from 'react';
import { WHITE_FIGURES, BLACK_FIGURES } from '../../Constants';
import { Chess, BLACK, WHITE, Square } from 'chess.js';
import { Button } from '../../Components/Buttons/Buttons';
import { MainActionButton } from '../../Components/ActionButtons/ActionButtons';
import InGameChat from '../../Components/IngameChat/InGameChat';
import {AWAITING, Promotion} from '../../Components/ChessBoard/Promotion';
import { CellObject } from '../../Components/ChessBoard/Cell';
import { useLocation, useParams } from 'react-router-dom';
import { GameLogicServiceClient, getInfoGame } from '../../ApiHelpers/GameLogicServiceClient';
import { send } from 'process';
import GamePopup from './GameEndPopup';
import { GetProfileStatistic } from '../../ApiHelpers/UserServiceClient';
import AuthComponent from '../../AuthComponent';

interface ChatMessageProps {
    text: string;
    sideOfChat: boolean;
    date: Date;
};

let gameLogicClient : GameLogicServiceClient;
const emptyCellObject = new CellObject("","");


export default function GameView() {
    const [messages, setMessages] = useState<ChatMessageProps[]>([]);
    const addMessage = (message: string) => {};
    
    const { gamecode } = useParams();
    
    //do wyjebania
    const gameSettings = {
        gameTime: 5,
        player1: "player1",
        player2: "player2",
        player1PieceColor: "WHITE" 
    };
    const startTime = gameSettings.gameTime * 60;

    let [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    let [promotionChoiceStatus, setPromotionChoiceStatus] = useState(AWAITING);
    let [lastCellClicked, setlastCellClicked] = useState(emptyCellObject);
    let [numberOfMoves, setNumberOfMoves] = useState(0);
    let [timerWhite, setTimerWhite] = useState(startTime);
    let [timerBlack, setTimerBlack] = useState(startTime);
    //Popup info
    let [popupVisibility,setPopupVisibility]=useState(false);
    let [popupInfo,setPopupInfo] = useState([] as string[]);

    let clientChooseWhitePierceColor = false;

    //TODO: a bit meneleskie but will always work
    useEffect(()=>{
        if (gamecode == "" || gamecode == undefined)
            return;
        getInfoGame(AuthComponent.JSONToken, "localhost:8000", gamecode)
            .then(async (status)=>{
                clientChooseWhitePierceColor = status.playerColor == "WHITE";
                setTimerWhite(status.whiteTime);
                setTimerBlack(status.blackTime);
                setFen(status.fen);
                if (status.sideToMove == "WHITE" && status.gameStatus == "IN_GAME")
                {
                    numberOfMoves = 2;
                    setNumberOfMoves(numberOfMoves);
                }
                if (status.sideToMove == "BLACK" && status.gameStatus == "IN_GAME") 
                {
                    numberOfMoves = 1;
                    setNumberOfMoves(numberOfMoves);
                //console.log("###################updated number of moves to " + (+1));
                }
                if(status.gameStatus !== "IN_GAME" && status.gameStatus !== "NOT_STARTED"){
                    let info:string[] = [];
                    if(status.gameStatus === "DRAW"){
                        info.push("Remis!");
                    }else{
                        if(clientChooseWhitePierceColor===(status.gameStatus === "WHITE_WINNER")){
                            info.push("Wygrałeś!");
                            //let profile = await GetProfileStatistic(clientChooseWhitePierceColor?gameSettings.player1.id:gameSettings.player2.id);
                            //info.push("Wygrał " + profile.name);
                        }else{
                            info.push("Przegrałeś!");
                            //let profile = await GetProfileStatistic(!clientChooseWhitePierceColor?gameSettings.player1.id:gameSettings.player2.id);
                            //info.push("Wygrał " + profile.name);
                        }
                    }
                    setPopupInfo(info);
                    setPopupVisibility(true);
                }
            });
    }, []);

    useEffect(()=>{
        if (gamecode == "" || gamecode == undefined)
            return;
        gameLogicClient = new GameLogicServiceClient(
            AuthComponent.JSONToken,
            "localhost:8000",
             gamecode,
             clientChooseWhitePierceColor,
             (s, time) => {
                setFen(s);
                console.log("###################updated number of moves to " + (numberOfMoves+1));
                if (numberOfMoves%2==0)
                    setTimerWhite(time);
                else
                    setTimerBlack(time);
                setNumberOfMoves(++numberOfMoves);
             }
        );

        gameLogicClient.connect();
    }, []);

    //logic
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


    let processMove = (from: CellObject, to:CellObject) => {

        if (clientChooseWhitePierceColor && timerWhite <= 0)
            return;
        if (!clientChooseWhitePierceColor && timerBlack <= 0)
            return;

        if (promotionChoiceStatus == AWAITING)
        {
            try{
                let validator = new Chess(fen);
                let move = validator.move(from.pos+to.pos);


                if (clientChooseWhitePierceColor && to.pos[1]=='8' && from.piece == "P")
                {
                    setPromotionChoiceStatus(from.pos+to.pos);
                }
                else if (!clientChooseWhitePierceColor && to.pos[1]=='1' && from.piece == "P")
                {
                    setPromotionChoiceStatus(from.pos+to.pos);
                }
                else
                {
                    sendMove(from.pos + to.pos);
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


    let handleCellClicked = (currentCell: CellObject) => {

        if (lastCellClicked != emptyCellObject)
        {
            processMove(lastCellClicked, currentCell);
            setlastCellClicked(emptyCellObject);
        }
        else
        {
            setlastCellClicked(currentCell);
        }
    };

    //timer
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimerWhite(prevTimer => (prevTimer > 0 && (numberOfMoves > 0 && (numberOfMoves%2==0))? prevTimer - 1 : prevTimer));
        }, 1000);
        const intervalId2 = setInterval(() => {
            setTimerBlack(prevTimer => (prevTimer > 0 && (numberOfMoves%2 == 1)? prevTimer - 1 : prevTimer));
        }, 1000);

        return () => {
            clearInterval(intervalId);
            clearInterval(intervalId2);
        };
    }, [numberOfMoves]);

    return <ContentWrapper isCentered={true}>
        <GamePopup popupInfo={popupInfo} open={popupVisibility}/>
        <div className="gameViewHolder">
            <div className='gamePromotionSide'>
                <Promotion isVisible={promotionChoiceStatus != AWAITING ? true : false} playerFigureColor={clientChooseWhitePierceColor} callback={processPromotion} />
            </div>
            <div className="gameSide">
                <PlayerInfo name={gameSettings.player1PieceColor == "BLACK" ? gameSettings.player1 : gameSettings.player2} figures={BLACK_FIGURES} timer={timerBlack}></PlayerInfo>
                <ChessBoard chessFen={fen} callbackClick={handleCellClicked}/>
                <PlayerInfo name={gameSettings.player1PieceColor == "WHITE" ? gameSettings.player1 : gameSettings.player2} figures={WHITE_FIGURES} timer={timerWhite}></PlayerInfo>
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