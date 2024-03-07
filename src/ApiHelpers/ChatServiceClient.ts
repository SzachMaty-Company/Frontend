import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import React, { useState } from 'react';
import ChatMessage from '../Components/ChatMessage/ChatMessage';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { tokenToString } from 'typescript';

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
}

export class ChatSerivceClient{
    private stompClient: Client | undefined;
    private subscription: StompSubscription | undefined;

    constructor(private token: string, private url: string){
    }

    public showMessage(message: IMessage){
        console.log("received message!");
        console.log(JSON.parse(message.body));
    }

    public connect(){
        this.stompClient = new Client({
            brokerURL: `ws://${this.url}/registerws`,
            debug: (str) => {
                console.log(str)
            },
            connectHeaders: {
                token: this.token 
            }
        })

        this.stompClient.onConnect = (frame) => {
            if (this.stompClient)
            {
                this.subscription = this.stompClient.subscribe("/user/queue/messages", this.showMessage);
            }
        }

        this.stompClient.activate();
    }

    public async sendMessage(chatId: number, message: string) {
        if (this.stompClient)
        {
            this.stompClient.publish({
                destination: "/chat/message",
                body: JSON.stringify({
                        chatId: chatId,
                        message: message
                }),
                headers: { "Content-Type:": "application/json" }
            });
        }
        else
            console.log("hola hola urwisie!");
    }


    public closeConnection(){
        if (this.stompClient)
        {
            console.log("decativating!");
            this.stompClient.deactivate();
        }
    }
}

async function makeRequest(token: string, url: string, endpoint: string){
    let response = await fetch(`http://${url}/${endpoint}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'}
    });
    return response.json();
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
interface JwtClaims extends JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
}
function tokenToId(token: string)
{
    const decoded = jwtDecode(token) as JwtClaims;
    console.log(decoded);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

async function gatherParticipants(token:string, url:string, chatId: number, tokenOwnerId: string){
    if (tokenOwnerId != undefined)
    {
        const data = await makeRequest(token, url, `chat/${chatId}/participants`);
        for (const x of data)
        {
            if (tokenOwnerId != x.participantId)
            {
                let p : ChatParticipant = {
                    id: x.participantId,
                    username: x.username
                }
                return p;
            }
        }
    }

}

async function gatherMessages(token: string, url: string){
    const data = await makeRequest(token, url, 'user/chats');
    let chatRooms = new Map<number, ChatRoom>();
    const tokenOwnerId = tokenToId(token);
    for (const x of data.content)
    {
        const chatid = parseInt(x.chatId);
        if (chatRooms.has(chatid) == false)
        {
            if (tokenOwnerId != undefined)
            {
                const party = await gatherParticipants(token, url, chatid, tokenOwnerId);
                if (party != undefined)
                {
                    let ncr : ChatRoom =  {
                        participant: party,
                        messages: [],
                        chatId: chatid
                    }
                    chatRooms.set(chatid, ncr);
                }
            }
        }
        console.log(x);
        const parsedDate = Date.parse(x.messageTimestamp);
        let m : ChatMessageInterface = {
            text: x.message,
            sideOfChat: x.senderId !== tokenOwnerId,
            date: new Date(parsedDate)
        };
        console.log(chatid);
        let chatRoom = chatRooms.get(chatid);
        if (chatRoom != undefined)
        {
            chatRoom.messages.push(m);
        }
        else
        {
            console.log("boze moj");
        }
    }
    console.log(chatRooms);
    return chatRooms;
}

interface Message{

}

function parseMessages(messages: Message[])
{
    console.log(messages);
}

export {gatherMessages, parseMessages};