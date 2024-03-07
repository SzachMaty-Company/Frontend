import InGameChat from '../IngameChat/InGameChat';
import React, { useState, useEffect } from 'react';
import './FriendsChat.css'
import { gatherMessages} from '../../ApiHelpers/ChatServiceClient';
import { unescape } from 'querystring';

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
}

interface ChatMessageProps {
  messages: ChatMessageInterface[];
  sentMessage: (text:string, chatId: string) => void;
}

interface ChatParticipant{
    id: string,
    username: string
}

interface ChatRoom{
    participant: ChatParticipant,
    messages: ChatMessageInterface[],
    chatId: number
}

function FriendsChat(){
    const [messages, setMessages] = useState<ChatMessageInterface[]>([]);
    const [chatRoom, setChatRooms] = useState<Map<number, ChatRoom>>(new Map());
    const [selectedChatRoom, setSelectedChatRoom] = useState<number>();

    useEffect(() => {
        gatherMessages("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidG9taXPFgmF3IGFwb2xvbml1c3ogY3VydcWbIGJhY2hsZWRhIGZhcmVsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJnbG9iYWwtaWQtMSJ9.5t1xYlNI5NnKXzyCFWa1HbPFwVTziggfaWnPeL10TcU", "localhost:8000")
            .then(receivedChatRooms => {
                setChatRooms(receivedChatRooms);
                const firstKey = chatRoom.keys().next().value;
                setSelectedChatRoom(firstKey);
                if (selectedChatRoom !== undefined && chatRoom.has(selectedChatRoom))
                {
                    setMessages(chatRoom.get(selectedChatRoom)!.messages);
                }
        });
        return () => {
            console.log('Component will unmount, cleanup code here.');
        };
    }, []); 

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

    let windowTitle: string = "";

    if (selectedChatRoom != undefined && chatRoom.has(selectedChatRoom))
    {
        windowTitle = chatRoom.get(selectedChatRoom)?.participant.username ?? "";
    }

    return <div className={"friendChat"}>
        {
            !isHidden &&
            <InGameChat messages={messages} sentMessage={addMessage} closeable={true} title={windowTitle}></InGameChat>
        }
        <div className='friendList'>
            <div className='friendEntry friendListButton' onClick={toggleVisibility}>Znajomi</div>
            <div className='friendEntries' hidden={isHidden}>
                {Array.from(chatRoom.entries()).map(([chatId, chatRoom]) => (
                    <div className='friendEntry'>{chatRoom.participant.username}</div>
               
                ))}
            </div>
        </div>
    </div>
}

export default FriendsChat;