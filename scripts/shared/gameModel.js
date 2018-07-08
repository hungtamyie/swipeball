class GameModel {
    constructor(myPlayer, otherPlayers){
        this.name = "Game Model"
        this.myPlayer = myPlayer;
        this.otherPlayers = otherPlayers;
    }
    
    tick(){
        this.myPlayer.applyVel();
        gameView.update()
    }
}