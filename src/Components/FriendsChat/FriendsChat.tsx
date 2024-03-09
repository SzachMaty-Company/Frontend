import InGameChat from '../IngameChat/InGameChat';
import React, { useState, useEffect } from 'react';
import './FriendsChat.css'
import { gatherMessages} from '../../ApiHelpers/ChatServiceClient';

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
    const [chatRooms, setChatRooms] = useState<Map<number, ChatRoom>>(new Map());
    const [selectedChatRoom, setSelectedChatRoom] = useState<number>();
    const [isHidden, setIsHidden] = useState(true);
    //don't touch it works 
    const [f, setF] = useState(1);

    useEffect(() => {
        gatherMessages("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidG9taXPFgmF3IGFwb2xvbml1c3ogY3VydcWbIGJhY2hsZWRhIGZhcmVsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJnbG9iYWwtaWQtMSJ9.5t1xYlNI5NnKXzyCFWa1HbPFwVTziggfaWnPeL10TcU", "localhost:8000")
            .then(receivedChatRooms => {
                setChatRooms(receivedChatRooms);
        })
        return () => {
        };
    }, []);

    const sendMessage = (message: string) => {
        const newMessage: ChatMessageInterface = {
            text: message,
            sideOfChat: false, 
            date: new Date(),
        };

        let x = chatRooms;
        if (x != undefined && selectedChatRoom != undefined && x.has(selectedChatRoom))
        {
            x.get(selectedChatRoom)?.messages.push(newMessage);
            setChatRooms(x);
            //don't touch it works 
            setF(f+1);
        }
    };

    const selectUser = (chatId: number) => {
        setIsHidden(!isHidden);
        setSelectedChatRoom(chatId);
    };

    return <div className={"friendChat"}>
        {
            !isHidden && selectedChatRoom != undefined && chatRooms.has(selectedChatRoom) && chatRooms.get(selectedChatRoom)?.messages && (
            <InGameChat messages={chatRooms.get(selectedChatRoom)?.messages ?? []} sentMessage={sendMessage} closeable={true} title={chatRooms.get(selectedChatRoom)?.participant.username || ""} hidden={isHidden} hide={()=>setIsHidden(true)}></InGameChat>)
        }
        <div className='friendList'>
            <div className='friendEntry friendListButton' >Znajomi</div>
            <div className='friendEntries'>
                {Array.from(chatRooms.entries()).map(([chatId, chatRoom]) => (
                    <div className='friendEntry' onClick={() => selectUser(chatId)}>{chatRoom.participant.username}</div>
               
                ))}
            </div>
        </div>
    </div>
}

export default FriendsChat;