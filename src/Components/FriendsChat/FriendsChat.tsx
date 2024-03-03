import InGameChat from '../IngameChat/InGameChat';
import React, { useState, useEffect } from 'react';
import './FriendsChat.css'

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
}

interface ChatMessageProps {
  messages: ChatMessageInterface[];
  sentMessage: (text:string, chatId: string) => void;
}

function FriendsChat(){

        const [messages, setMessages] = useState<ChatMessageInterface[]>([
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
            const newMessage: ChatMessageInterface = {
                text: message,
                sideOfChat: false, 
                date: new Date(),
            };
    
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
    

    const ch: ChatMessageInterface[] = [];
    const f = () => console.log("click");
    
    const [isHidden, setIsHidden] = useState(false);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    return <div className={"friendChat"}>
        {
            !isHidden &&
            <InGameChat messages={messages} sentMessage={addMessage} closeable={true}></InGameChat>
        }
        <div className='friendList'>
            <div className='friendEntry friendListButton' onClick={toggleVisibility}>Znajomi</div>
            <div className='friendEntries' hidden={isHidden}>
                <div className='friendEntry'>gsr600</div>
                <div className='friendEntry'>cbr1000rr</div>
                <div className='friendEntry'>vfr800</div>
                <div className='friendEntry'>mt-10</div>
                <div className='friendEntry'>gsr600</div>
                <div className='friendEntry'>cbr1000rr</div>
                <div className='friendEntry'>vfr800</div>
                <div className='friendEntry'>mt-10</div>
                <div className='friendEntry'>gsr600</div>
                <div className='friendEntry'>cbr1000rr</div>
                <div className='friendEntry'>vfr800</div>
                <div className='friendEntry'>mt-10</div>
            </div>
        </div>
    </div>
}

export default FriendsChat;