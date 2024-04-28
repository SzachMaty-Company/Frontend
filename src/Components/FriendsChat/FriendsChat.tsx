import InGameChat from '../IngameChat/InGameChat';
import React, { useState, useEffect } from 'react';
import './FriendsChat.css'
import { ChatSerivceClient } from '../../ApiHelpers/ChatServiceClient';
import { Client } from '@stomp/stompjs';
import { unescape } from 'querystring';
import AuthComponent from '../../AuthComponent';

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
    type: string;
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


const apiPath: string = "localhost:8000";
let chatClient : ChatSerivceClient;

function FriendsChat(){
    const [chatRooms, setChatRooms] = useState<Map<number, ChatRoom>>(new Map());
    const [selectedChatRoom, setSelectedChatRoom] = useState<number>();
    const [isHidden, setIsHidden] = useState(true);

    const sendMessage = (message: string) => {
        if (selectedChatRoom != undefined)
        {
            chatClient.sendMessage(selectedChatRoom, message);
        }
    };

    const rcvMessage = (newMessage: ChatMessageInterface, chatId: number) => {
        if (chatRooms != undefined && chatId != undefined)
        {
                setChatRooms((prevChatRooms) => {
                const updatedChatRooms = new Map(prevChatRooms);
                if (updatedChatRooms.has(chatId)) {
                    const chatRoom = updatedChatRooms.get(chatId);
                    if (chatRoom) {
                        const updatedMessages = [...chatRoom.messages, newMessage];
                        const updatedChatRoom = { ...chatRoom, messages: updatedMessages };
                        updatedChatRooms.set(chatId, updatedChatRoom);
                    }
                }
                return updatedChatRooms;
            });
        }
        else{
        }
    };

    useEffect(() => {

        chatClient = new ChatSerivceClient(AuthComponent.JSONToken, apiPath, (x, y) => {
            rcvMessage(x, y)
        } );

        chatClient.gatherChatRooms(AuthComponent.JSONToken, apiPath)
            .then(async (receivedChatRooms) => {
                setChatRooms(receivedChatRooms);
                chatClient.connect();
        })
        return () => {
            chatClient.closeConnection();
        };
    }, []);



    const selectUser = (chatId: number) => {
        setIsHidden(!isHidden);
        setSelectedChatRoom(chatId);
    };

    return <div className={"friendChat"}>
        {
            !isHidden && selectedChatRoom != undefined && (
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