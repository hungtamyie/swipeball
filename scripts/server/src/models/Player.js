'use strict';

const uuidv4 = require('uuid/v4');

const Vector = require('../../../shared/vector');

class Player {
  constructor({name, pos, vel}, connection, lostConnectionCallback) {
    this._name = name;
    this._pos = pos;
    this._vel = new Vector(vel.x, vel.y);
    this._id = uuidv4();
    this._lastUpdate = new Date()
    this._clientConnection = connection;
    console.log('Name: ' + this._name + ', Pos = ' + JSON.stringify(this._pos));

    this._intervalHandle = setInterval(() => {
      try {
        this._clientConnection.send(JSON.stringify({state: 'heartbeat'}));
      } catch(ex) {
        clearInterval(this._intervalHandle);
        lostConnectionCallback(this); 
      }
    }, 5000);
  }

  get serializedData() {
    return {
      id: this._id || null,
      name: this._name,
      pos: this._pos,
      vel: this._vel.toObject(),
      //coolDown: this.coolDown,
      //jumps: this.jumps,
      //hasBall: this.hasBall
    };
  }

  sendMessage(message) {
    try {
      if (typeof(message) === 'object') {
        message = JSON.stringify(message);
      }
      this._clientConnection.send(message);
    } catch (ex) {
      // TODO....
      console.log(ex);
    }
  }

  applyVelocity() {
    var currentDate = new Date()
    var dif = currentDate.getTime() - this._lastUpdate.getTime()
    var scalar = dif/(1000/144)

    this._pos.x += this._vel.x * scalar;
    this._pos.y += this._vel.y * scalar;
    
    this._vel.multiplyBy(Math.pow(.97, scalar))
    
    this._lastUpdate = new Date()
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }
}

module.exports = Player;