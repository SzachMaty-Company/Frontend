export default class ProfileStatistic{
    nickname:string;
    firstname:string;
    lastname:string;
    winrate:number;
    winrateAI:number;
    winrateFriends:number;
    friendList:string[];

    constructor()
    {
        this.nickname="";
        this.firstname="";
        this.lastname="";
        this.winrate=0;
        this.winrateAI=0;
        this.winrateFriends=0;
        this.friendList=[];
    }
}