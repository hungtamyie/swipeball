window.onload = function(){
    preloader = new Preloader();
    
    preloader.addTask({f: getCanvas})
    preloader.addTask({f: createWindowManager})
    preloader.addTask({f: test})
    
    preloader.runTask();
}

class Preloader {
    constructor(){
        this.self = this;
        this.tasks = [];
    }
    
    addTask(t){
        this.tasks.push(t);
    }
    
    taskFinished(){
        //Delete last task
        this.tasks.shift();
        //Run next task
        this.runTask();
    }
    
    runTask(){
        var task = this.tasks[0];
        if(task){
            task.f(this, task.args); 
        }
    }
}

//Sets up game screen
function getCanvas(loader){
    
    window.canvas = document.getElementById("canvas");
    window.ctx = window.canvas.getContext("2d");
    resizeCanvas();
    
    window.onresize = function(){resizeCanvas()}
    
    loader.taskFinished();
}
function resizeCanvas(){
    window.canvas.width = window.innerWidth
    window.canvas.height = window.innerHeight
}

//Create the window manager
function createWindowManager(loader){
    window.inputHandler = new InputHandler();
    loader.taskFinished();
}

//Create test
function test(loader) {
    var userName = prompt("Enter your name");
    var ws = new WebSocket('ws://192.168.1.10:8080/');
    window.wsConnection = ws;

    window.inputHandler = new InputHandler();
    var myPlayer = new Player(userName);
    window.gameModel = new GameModel(myPlayer);
    window.gameView = new GameView();
    window.clientController = new ClientController(ws);
    window.clientController.tick();

    ws.addEventListener('open', function(e) {
        ws.addEventListener('message', function(e) {
            //const message = JSON.parse(e.data);
            //console.log('received:', e.data);
            var message = JSON.parse(e.data);
            if (message.state === 'startGame') {
              myPlayer.id = message.playerId;
            } else if (message.state === 'modelUpdate') {
              var player = message.players[0];
              myPlayer._pos.x = player.pos.x; 
              myPlayer._pos.y = player.pos.y; 
              myPlayer.vel.x = player.vel.x; 
              myPlayer.vel.y = player.vel.y; 
            }
        });

      let joinMessage = {
        type: 'joinGame',
        player: myPlayer.serializedData
      };

      ws.send(JSON.stringify(joinMessage));
    });
}