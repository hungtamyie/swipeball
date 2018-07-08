class Player {
    constructor(name) {
        this._name = name;
        this._pos = {x: 200, y: 200};
        this.vel = new Vector(0,0);
        this.lastUpdate = new Date()
        this.coolDown = 0;
        this.jumps = 2;
        this.hasBall = false;
    }
    
    applyVel(){
      var currentDate = new Date()
      var dif = currentDate.getTime() - this.lastUpdate.getTime()
      var scalar = dif/(1000/144)

      this._pos.x += this.vel.x * scalar;
      this._pos.y += this.vel.y * scalar;
      
      this.vel.multiplyBy(Math.pow(.97, scalar))

      this.lastUpdate = new Date()
    }
    get serializedData() {
      return {
        id: this._id || null,
        name: this._name,
        pos: this._pos,
        vel: this.vel.toObject(),
        coolDown: this.coolDown,
        jumps: this.jumps,
        hasBall: this.hasBall
      };
    }

    get pos() {
      return this._pos;
    }

    get id() {
      return this._id;
    }

    set id(value) {
      this._id = value;
      //console.log("Player.id set to: " + this._id);
    }
}