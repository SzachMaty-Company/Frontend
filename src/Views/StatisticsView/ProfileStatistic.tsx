import { GameHistoryRecordInterface } from "../GameSummaryView/GameSummaryView";

export default class ProfileStatistic{
    nickname:string;
    firstname:string;
    lastname:string;
    winrate:number;
    winrateAI:number;
    winrateFriends:number;
    friendList:Friend[];
    matches:Match[];

    constructor()
    {
        this.nickname="";
        this.firstname="";
        this.lastname="";
        this.winrate=0;
        this.winrateAI=0;
        this.winrateFriends=0;
        this.friendList=[];
        this.matches=[];
    }
}

export class Friend{
    nickname:string;
    winrate:number;
    constructor(){
        this.nickname="";
        this.winrate=0;
    }
}

class Match{
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