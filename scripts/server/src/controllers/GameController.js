'use strict';

const Vector = require('../../../shared/vector');

class GameController {
  constructor() {
    this._player1;
    this._player2;
    this._isReady = false;
  }

  addPlayer(player) {
    if (!this._player1 || !this._player2) {
      if (!this._player1) {
        this._player1 = player;
        player._vel.x = 0.3;
      }
      else if (!this._player2) {
        this._player2 = player;
        player._vel.y = 0.1;
      }
      this._updateReadiness();
      return true;
    }

    return false;
  }

  removePlayer(playerId) {
    var msg = {"state": "opponentLostConnection"};

    if (this._player1 && this._player1.id === playerId) {
      this._player1 = null;
      if (this._player2) {
        this._player2.sendMessage(JSON.stringify(msg));
      }
    } 
    else if (this._player2 && this._player2.id === playerId) {
      this._player2 = null;
      if (this._player1) {
        this._player2.sendMessage(JSON.stringify(msg));
      }
    } 
  }

  handleSwipe(vel, playerId) {
    let player = this._findPlayer(playerId);
    console.log('Set Player: ' + player.name + ' swipe data...');
    var vector = new Vector(vel.x, vel.y)
    player._vel.addTo(vector)
  }

  startTheGame() {
    console.log("startung....")
    let startMessage = {state: "startGame"};
    this._player1.sendMessage(JSON.stringify({
      state: "startGame",
      playerId: this._player1.id
    }));
    /*this._player2.sendMessage(JSON.stringify({
      state: "startGame",
      playerId: this._player2.id
    }));*/

    this._intervalHandle = setInterval(() => {
      try {
        this._player1.applyVelocity();
        //this._player2.applyVelocity();

        let msg = {
          state: 'modelUpdate',
          players: [this._player1.serializedData]//, this._player2.serializedData]
        };

        this._player1.sendMessage(msg);
        //this._player2.sendMessage(msg);
      } catch(ex) {
        console.log(ex);
        clearInterval(this._intervalHandle);
        //lostConnectionCallback(this); 
      }
    }, 200);

  }

  get isReady() {
    return this._isReady;
  }

  _updateReadiness() {
    if (this._player1 && this._player2) {
      this._isReady = true;
    }
  }

  _findPlayer(playerId) {
    if (this._player1 && this._player1.id === playerId) {
      return this._player1;
    } 
    else if (this._player2 && this._player2.id === playerId) {
      return this._player2;
    } 
  }
}

module.exports = GameController;