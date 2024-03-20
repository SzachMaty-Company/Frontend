export default class ProfileStatistic{
    id:number;
    name:string;
    surname:string;
    email:string;
    statistics:Statistics;

    constructor()
    {
        this.id=-1;
        this.name="";
        this.surname="";
        this.email="";
        this.statistics=new Statistics();
    }
}

class Statistics{
    winrate:number; //Against sender
    winrateFriends:number;
    winFriends:number;
    playFriends:number;
    winrateAI:number;
    winAI:number;
    playAI:number;
    games:Match[]|undefined;

    constructor()
    {
        this.winrate=0;
        this.winrateFriends=0;
        this.winFriends=0;
        this.playFriends=0;
        this.winrateAI=0;
        this.winAI=0;
        this.playAI=0;
        this.games=[];
    }
}

export class Match{
    white:string;
    black:string;
    win:string;
    mode:string;
    date:string;
    history:GameHistoryRecordInterface[];

    constructor()
    {
        this.white="";
        this.black=""
        this.win="";
        this.mode="";
        this.date="";
        this.history=[];
    }
}

export class Move{
    figure: string;
    position: string;
    moveTo:string;
    constructor(){
        this.figure="";
        this.position="";
        
    }
}


