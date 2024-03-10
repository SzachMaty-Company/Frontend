import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { JwtPayload, jwtDecode } from "jwt-decode";

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
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
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

class ChatSerivceClient{
    private stompClient: Client | undefined;
    private subscription: StompSubscription | undefined;

    constructor(private token: string, private url: string, private handleReceivedMessage: (message: ChatMessageInterface, numberArg: number) => void){
    }

    public makeMessage(text: string, idOfSender: string, date: string)
    {
        console.log("DEEEBUUUGD");
        console.log(tokenToId(this.token));
        console.log(idOfSender);
        const parsedDate = Date.parse(date);
        const msg : ChatMessageInterface = {
            text: text,
            sideOfChat: idOfSender !== tokenToId(this.token),
            date: new Date(parsedDate)
        };
        return msg;
    }

    public showMessage(message: IMessage){
        const parsedMessage = JSON.parse(message.body);
        console.log(parsedMessage);
        const ownerId = tokenToId(this.token);
        if (ownerId != undefined)
        {
            const newMessage = this.makeMessage(parsedMessage.message, parsedMessage.senderId, parsedMessage.timestamp);
            this.handleReceivedMessage(newMessage, parsedMessage.chatId);
        }
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
                this.subscription = this.stompClient.subscribe("/user/queue/messages", this.showMessage.bind(this));
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

    private async makeRequest(endpoint: string){
        let response = await fetch(`http://${this.url}/${endpoint}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'}
        });
        return response.json();
    }

    private async gatherParticipants(chatId: number){
        const tokenOwnerId = tokenToId(this.token);
        if (tokenOwnerId != undefined)
        {
            const participantsData = await this.makeRequest(`chat/${chatId}/participants`);
            for (const participantData of participantsData)
            {
                if (tokenOwnerId != participantData.participantId)
                {
                    let participant : ChatParticipant = {
                        id: participantData.participantId,
                        username: participantData.username
                    }
                    return participant;
                }
            }
        }
    }

    public async gatherMessages(chatId: number){
        const receivedMessages = await this.makeRequest(`chat/${chatId}/messages?sort=timestamp,desc`);
        
        let messages: ChatMessageInterface[] = [];
        for (const x of receivedMessages.content)
        {
            messages.push(this.makeMessage(x.message, x.senderId, x.timestamp));
        }
        messages.sort((a, b) => a.date.getTime() - b.date.getTime());
        return messages;
    }

    public async gatherChatRooms(token: string, url: string){

        const receivedMessages = await this.makeRequest('user/chats');

        let chatRooms = new Map<number, ChatRoom>();

        const idOfOwnerOfTheToken = tokenToId(token);
        for (const x of receivedMessages.content)
        {
            const chatid = parseInt(x.chatId);        
            if (chatRooms.has(chatid) == false)
            {
                if (idOfOwnerOfTheToken != undefined)
                {
                    const party = await this.gatherParticipants(chatid);
                    const messages = await this.gatherMessages(chatid);
                    if (party != undefined)
                    {
                        let newChatRoom : ChatRoom =  {
                            participant: party,
                            messages: messages,
                            chatId: chatid
                        }
                        chatRooms.set(chatid, newChatRoom);
                    }
                }
            }
        }
        return chatRooms;
    }
}



export {ChatSerivceClient};