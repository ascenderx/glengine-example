class Application {
  constructor(canvas) {
    this._width = canvas.width;
    this._height = canvas.height;
    this._cube = new Cube();
    let gl = GLEngine.GetGLFromCanvas(canvas);
    this._gle = new GLEngine(gl, this._cube);
    loopInterval(this.loop_onTick.bind(this), 10);
  }

  loop_onTick(timestamp) {
    this.update(timestamp);
    this.draw();
  }

  update(timestamp) {
    this._cube.rotation.x = timestamp / 30;
    this._cube.rotation.y = timestamp / 20;
    this._cube.rotation.z = timestamp / 40;
  }

  draw() {
    const gle = this._gle;
    gle.render();
  }
}


