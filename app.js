class Application {
  constructor(canvas) {
    this._width = canvas.width;
    this._height = canvas.height;
    this._camera = new Camera();
    let gl = GLEngine.getGLFromCanvas(canvas);
    this._gle = new GLEngine(gl, this._camera);
    
    this._entities = [];
    for (let x = 0; x < 100; x++) {
      let cube = new Cube({
        x: randomInteger(-100, 100),
        y: randomInteger(-100, 100),
        z: randomInteger(-100, 100),
        yaw: randomInteger(0, 180),
        pitch: randomInteger(0, 180),
        roll: randomInteger(0, 180),
      });
      this._entities.push(cube);
      this._gle.pushEntity({
        position: cube.position,
        rotation: cube.rotation,
        vertices: Cube.VERTICES,
        normals: Cube.NORMALS,
        indices: Cube.INDICES,
      });
    }
    
    this._interval = 10;
    this._actions = {
      strafeLeft: false,
      strafeRight: false,
      ascend: false,
      descend: false,
      walkForward: false,
      walkBackward: false,
      pitchUp: false,
      pitchDown: false,
      yawLeft: false,
      yawRight: false,
      rollCCW: false,
      rollCW: false,
    };
    this._speeds = {
      strafe: 5 / this._interval,
      rotate: 10 / this._interval, // degrees
    };
    this.onUpdate = ({}) => {};
  }

  run() {
    loopInterval(this.loop_onTick.bind(this), this._interval);
  }

  onMouseMove(x, y) {
    const camera = this._camera;
    camera.yawRight(x / this._interval);
    camera.pitchDown(y / this._interval);
  }

  onKeyEvent(key, pressed) {
    const actions = this._actions;
    switch (key) {
      case 'a':
      case 'ArrowLeft':
        actions.strafeLeft = pressed;
        break;
      case 'd':
      case 'ArrowRight':
        actions.strafeRight = pressed;
        break;
      case 's':
      case 'ArrowDown':
        actions.walkBackward = pressed;
        break;
      case 'w':
      case 'ArrowUp':
        actions.walkForward = pressed;
        break;
      case ' ':
      case 'Spacebar':
        actions.ascend = pressed;
        break;
      case 'Shift':
        actions.descend = pressed;
        break;
    }
  }

  onKeyDown(key) {
    this.onKeyEvent(key, true);
  }

  onKeyUp(key) {
    this.onKeyEvent(key, false);
  }

  loop_onTick(timestamp) {
    this.update(timestamp);
    this.draw();
  }

  update(timestamp) {
    const speeds = this._speeds;
    const camera = this._camera;
    const actions = this._actions;
    if (actions.strafeLeft) {
      camera.strafeLeft(speeds.strafe);
    } else if (actions.strafeRight) {
      camera.strafeRight(speeds.strafe);
    }
    if (actions.ascend) {
      camera.ascend(speeds.strafe); 
    } else if (actions.descend) {
      camera.descend(speeds.strafe);
    }
    if (actions.walkForward) {
      camera.walkForward(speeds.strafe);
    } else if (actions.walkBackward) {
      camera.walkBackward(speeds.strafe);
    }
    if (actions.yawLeft) {
      camera.yawLeft(speeds.rotate);
    } else if (actions.yawRight) {
      camera.yawRight(speeds.rotate);
    }
    if (actions.pitchUp) {
      camera.pitchUp(speeds.rotate);
    } else if (actions.pitchDown) {
      camera.pitchDown(speeds.rotate);
    }

    this.onUpdate({
      x: camera.x,
      y: camera.y,
      z: camera.z,
      pitch: camera.pitchValue,
      yaw: camera.yawValue,
      roll: camera.rollValue,
      timestamp: timestamp,
    });
  }

  draw() {
    const gle = this._gle;
    gle.render();
  }
}


