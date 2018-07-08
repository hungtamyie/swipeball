class InputHandler{
    constructor(){
        let self = this;
        this.dragging = false;
        this.dragOpacity = undefined;
        this.dragStart = {x: 0, y: 0};
        this.dragEnd = {x: 0, y: 0};
        
        canvas.addEventListener("mousedown",function(e){
            self.mouseDown(e)
            self.sendInfoToGameView()
        },false)
        
        canvas.addEventListener("mousemove", function(e){
            self.mouseMove(e)
            self.sendInfoToGameView()
        },false)
        
        canvas.addEventListener("mouseup", function(){
            self.mouseUp()
            self.sendInfoToGameView()
        },false)
    }
    
    mouseDown(e){
        var x = e.clientX
        var y = e.clientY
        this.dragStart.x = x
        this.dragStart.y = y
        
        this.dragging = true;
        
        this.dragOpacity = 0;
    }
    
    mouseMove(e){
        if(this.dragging){
            var x = e.clientX;
            var y = e.clientY;
            this.dragEnd.x = x;
            this.dragEnd.y = y;
            
            this.changeDragOpacity()
        }
    }
    
    mouseUp(){
        this.dragging = false;
        var line = new Vector(this.dragEnd.x - this.dragStart.x, this.dragEnd.y - this.dragStart.y);
        clientController.dragEvent(this.getData());
    }
    
    
    changeDragOpacity(){
        var percentDistance = this.getPercentDistance()
        this.dragOpacity = UI_CIRCLE_MIN_OPACITY + (percentDistance * (UI_CIRCLE_MAX_OPACITY - UI_CIRCLE_MIN_OPACITY))
    }
    
    getPercentDistance(){
        var distance = Math.sqrt(Math.pow(this.dragEnd.x - this.dragStart.x, 2) + Math.pow(this.dragEnd.y - this.dragStart.y , 2))
        if(distance > UI_CIRCLE_RADIUS){
            distance = UI_CIRCLE_RADIUS
        }
        return distance/UI_CIRCLE_RADIUS;
    }
    
    sendInfoToGameView(){
        window.gameView.changeDragLine(this.getData());
    }
    
    getData(){
        return {on: this.dragging, start: this.dragStart, end: this.dragEnd, alpha: this.dragOpacity, percentDistance: this.getPercentDistance()}
    }
}