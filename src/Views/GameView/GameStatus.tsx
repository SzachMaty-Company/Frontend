const GameStatus = {
    gameFound: false,
    gameCanceled:false,
    search: () => {
        if(GameStatus.gameCanceled){
            GameStatus.gameCanceled=false;
        }else
            GameStatus.gameFound=true;
    },
    gameEnded: () => {
        GameStatus.gameFound=false;
    },
    stopSearch:()=>{
        GameStatus.gameCanceled=true;
    }
  };
  
  export default GameStatus;