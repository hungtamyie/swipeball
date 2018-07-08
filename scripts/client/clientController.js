class ClientController {
    constructor(connection){
        this._connection = connection;
    }
    
    tick(){
        window.gameModel.tick()
        console.log("tick")
        window.requestAnimationFrame(window.clientController.tick)
    }
    
    dragEvent(line){
        if(!window.gameModel.myPlayer.hasBall){
            //Jump
            var percentage = line.percentDistance;
            var speed = percentage * PLAYER_SPEED;
            var vector = new Vector(line.end.x - line.start.x, line.end.y - line.start.y)
            vector.normalize();
            vector.multiplyBy(speed);
            window.gameModel.myPlayer.vel.addTo(vector)

            var command = {type: "handleSwipe", vel: vector, playerId: window.gameModel.myPlayer.id}
            command = JSON.stringify(command)
            window.wsConnection.send(command)
            //window.gameModel.myPlayer.send
        }
        else {
            //Throw
            
        }
    }
}