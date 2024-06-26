import { Client, IMessage, StompSubscription } from '@stomp/stompjs';   
import { Chess } from 'chess.js';
import AuthComponent from '../AuthComponent';

class GameLogicServiceClient {
    private stompClient: Client | undefined;
    private subscription: StompSubscription | undefined;
    private lastClientMove: string | undefined;

    constructor(private token: string, private url: string, private gameCode: string, private isCurentlyClientsTurn: boolean, private rcvFenCallback: (s:string, timer:number, gameStatus:string) => void)
    {

    }

    public connect(){
        this.stompClient = new Client({
            brokerURL: `ws://${this.url}/game-handshake`,
            debug: (str) => {
                console.log(str)
            }  ,
            connectHeaders: {
                token: this.token,
                gameCode : this.gameCode
            }
        })

        this.stompClient.onConnect = (frame) => {
            if (this.stompClient)
            {
                this.subscription = this.stompClient.subscribe(`/queue/move/${this.gameCode}`,(message) => {
                    const messageJson = JSON.parse(message.body);
                    console.log("XXXXXXXXXXXXXXX");
                    console.log(messageJson);
                    console.log("##################");
                    this.rcvFenCallback(messageJson.fen, messageJson.time, messageJson.gameStatus);
                    this.isCurentlyClientsTurn = this.lastClientMove != messageJson.move;
                });
            }
        }

        this.stompClient.activate();
    }

    public sendMove(move: string){
        if (this.stompClient)
        {
            console.log("PUBLIKACJA");
            this.stompClient.publish({
                destination: "/game/move",
                body: JSON.stringify({
                    gameCode: this.gameCode,
                    move: move
                }),
                headers: { 
                    "Content-Type:": "application/json" 
                }
            })
            
            this.isCurentlyClientsTurn = !this.isCurentlyClientsTurn;
            this.lastClientMove = move;
        }
    }

    public close(){
        if (this.stompClient)
        {
            this.stompClient.deactivate();
        }
    }
}


async function createGame(token: string, url: string, gameMode: string, gameTime: string, player1PieceColor: string, player1: string, player2: string) {
    
    let gameSettings = {
        gameMode: gameMode,
        gameTime: gameTime,
        player1: player1,
        player2: player2,
        player1PieceColor: player1PieceColor
    }
    
    let response = await fetch(`http://${url}/game-init`, {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${AuthComponent.JSONToken}`,
        'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(gameSettings)
    });
    let gameCode = (await response.json()).gameCode;
    return {
        ...gameSettings,
        gameCode: gameCode
    };
}

async function getInfoGame(token: string, url: string, gameCode: string) {
    
    let response = await fetch(`http://${url}/game-info/${gameCode}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${AuthComponent.JSONToken}`,
        'Content-Type': 'application/json'}
    });
    let gameSettings = await response.json();
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(gameSettings);
    return {
        fen: gameSettings.fen,
        whiteTime: gameSettings.whiteTime,
        blackTime: gameSettings.blackTime,
        sideToMove: gameSettings.sideToMove,
        gameStatus: gameSettings.gameStatus,
        playerColor: gameSettings.playerColor
    };
}

export {createGame, getInfoGame, GameLogicServiceClient};