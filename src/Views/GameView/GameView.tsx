import ChessBoard from '../../Components/ChessBoard/ChessBoard';
import ContentWrapper from '../ContentWrapper';
import './GameView.css'
import { PlayerInfo } from '../../Components/PlayerInfo/PlayerInfo';
import React, { useState, useEffect } from 'react';
import { WHITE_FIGURES, BLACK_FIGURES } from '../../Constants';
import { WHITE } from 'chess.js';
import { Button } from '../../Components/Buttons/Buttons';
import { MainActionButton } from '../../Components/ActionButtons/ActionButtons';
import InGameChat  from '../../Components/IngameChat/InGameChat';

interface ChatMessageProps {
  text: string;
  sideOfChat: boolean;
  date: Date;
}

export default function GameView()
{

    //do wyjebania
      const [timer, setTimer] = useState(120);
    useEffect(() => {
        const intervalId = setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
        }, 1000);

        // Cleanup the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures the effect runs only once on mount
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

    return <ContentWrapper isCentered={true}>
        <div className="gameViewHolder">
            <div className="gameSide">
                <PlayerInfo name="cbra600" figures={BLACK_FIGURES} timer={timer}></PlayerInfo>
                <ChessBoard></ChessBoard>
                <PlayerInfo name="sprzeglo53" figures={WHITE_FIGURES} timer={timer}></PlayerInfo>
            </div>
            <div className="gameControlSide">
                <div className="gameControlHolder">
                    <div className="surrenderButtonHolder">
                        <MainActionButton text="Poddaj się"></MainActionButton>
                    </div>
                    <div className="chatHolder">
                        <InGameChat messages={messages} sentMessage={addMessage} closeable={false} title='zioooobro'></InGameChat>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
}