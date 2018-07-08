'use strict';

var http = require('http');
var express = require('express');
var WebSocket = require('ws');
var GameController = require('./controllers/GameController');
var Player = require('./models/Player');

var app = express();
var server = http.createServer(app);
var wsserver = new WebSocket.Server({ server: server });

var gameController = new GameController();

function playerConnectionLost(player) {
  console.log("Connection to player: " + player.name + ", lost.");
  gameController.removePlayer(player.id);
}

wsserver.on('connection', function connection(ws) {
  ws.on('message', function(message) {
    try {
      console.log('message:', message);
      message = JSON.parse(message);
      console.log('types:', message.type);

      switch(message.type) {
        case 'joinGame':
          if (!gameController.isReady) {
            let player = new Player(message.player, ws, playerConnectionLost);

            if (gameController.addPlayer(player)) {
              //if (gameController.isReady) {
              if (1) {
                gameController.startTheGame();
              }
              else {
               let msg = {
                state: "waiting",
                playerId: player.id
               };
               ws.send(JSON.stringify(msg));
              }
            } else {
              ws.send(JSON.stringify({
                "state": "gameIsFull"
              }));
            }
          }
          break;
        case 'handleSwipe':
          gameController.handleSwipe(message.vel, message.playerId);
          break;
      }
    } catch (ex) {
      console.log(ex);
    }
  });

  //ws.send('something');
});

server.listen(8080);