import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { JwtPayload, jwtDecode } from "jwt-decode";

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
}

class ChatSerivceClient{
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
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

async function gatherParticipants(token:string, url:string, chatId: number, tokenOwnerId: string){
    if (tokenOwnerId != undefined)
    {
        const participantsData = await makeRequest(token, url, `chat/${chatId}/participants`);
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

async function gatherMessages(token: string, url: string){

    const receivedMessages = await makeRequest(token, url, 'user/chats?page=0&size=20&sort=desc');

    let chatRooms = new Map<number, ChatRoom>();

    const IdOfOwnerOfTheToken = tokenToId(token);
    for (const x of receivedMessages.content)
    {
        const chatid = parseInt(x.chatId);
        if (chatRooms.has(chatid) == false)
        {
            if (IdOfOwnerOfTheToken != undefined)
            {
                const party = await gatherParticipants(token, url, chatid, IdOfOwnerOfTheToken);
                if (party != undefined)
                {
                    let newChatRoom : ChatRoom =  {
                        participant: party,
                        messages: [],
                        chatId: chatid
                    }
                    chatRooms.set(chatid, newChatRoom);
                }
            }
        }
        const parsedDate = Date.parse(x.messageTimestamp);
        let message : ChatMessageInterface = {
            text: x.message,
            sideOfChat: x.senderId !== IdOfOwnerOfTheToken,
            date: new Date(parsedDate)
        };
        let chatRoom = chatRooms.get(chatid);
        if (chatRoom != undefined)
        {
            chatRoom.messages.push(message);
        }
    }
    return chatRooms;
}

export {gatherMessages, ChatSerivceClient};