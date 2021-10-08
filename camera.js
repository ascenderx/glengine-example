class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;
  }

  strafeLR(speed) {
    const cosA = Math.cos(this.yaw * RADIANS);
    const sinA = Math.sin(this.yaw * RADIANS);
    this.x += speed * cosA;
    this.z += speed * sinA;
  }

  strafeFB(speed) {
    const cosA = Math.cos(this.yaw * RADIANS);
    const sinA = Math.sin(this.yaw * RADIANS);
    this.x -= speed * sinA;
    this.z += speed * cosA;
  }

  strafeLeft(speed) {
    this.strafeLR(-speed);
  }

  strafeRight(speed) {
    this.strafeLR(speed);
  }

  walkForward(speed) {
    this.strafeFB(-speed);
  }

  walkBackward(speed) {
    this.strafeFB(speed);
  }

  ascend(speed) {
    this.y += speed;
  }

  descend(speed) {
    this.y -= speed;
  }

  pitchUp(speed) {
    this.pitch -= speed;
    this.pitch %= 360;
    if (this.pitch < 0) {
      this.pitch += 360;
    }
  }

  pitchDown(speed) {
    this.pitch += speed;
    this.pitch %= 360;
    if (this.pitch < 0) {
      this.pitch += 360;
    }
  }

  yawLeft(speed) {
    this.yaw -= speed;
    this.yaw %= 360;
    if (this.yaw < 0) {
      this.yaw += 360;
    }
  }

  yawRight(speed) {
    this.yaw += speed;
    this.yaw %= 360;
    if (this.yaw < 0) {
      this.yaw += 360;
    }
  }
}

