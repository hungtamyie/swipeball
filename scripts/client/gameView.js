class GameView {
    constructor(){
        this.UI = {
            dragLine: {}
        }
        this.camera = new Camera();
        this.canvas = window.canvas;
    }
    
    changeDragLine(dragLine){
        this.UI.dragLine = dragLine;
    }
    
    update(){
        ctx.clearRect(0,0,window.innerWidth, window.innerHeight)
        
        //Draw player
        var player = window.gameModel.myPlayer;
        ctx.fillRect(player.pos.x, player.pos.y, 50, 50)
        
        //Draw UI
        if(this.UI.dragLine.on == true){
            var dragLine = this.UI.dragLine;
            var rgbaValue = "rgba(" + Math.floor(dragLine.alpha * 255) + ", " + Math.floor(255 - (dragLine.alpha * 255)) + ", 10, " + dragLine.alpha + ")";``
            ctx.beginPath();
            ctx.moveTo(dragLine.start.x, dragLine.start.y)
            ctx.lineTo(dragLine.end.x, dragLine.end.y)
            //ctx.strokeStyle = "rgba(255, 255, 255, " + dragLine.alpha + ")"
            ctx.strokeStyle = rgbaValue
            ctx.lineWidth = 5
            ctx.stroke()
            
            ctx.fillText(rgbaValue, 100, 100)
        }
    }
}