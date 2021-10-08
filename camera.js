class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.pitchValue = 0;
    this.yawValue = 0;
    this.rollValue = 0;
  }

  strafeLR(speed) {
    const cosA = Math.cos(this.yawValue * RADIANS);
    const sinA = Math.sin(this.yawValue * RADIANS);
    this.x += speed * cosA;
    this.z += speed * sinA;
  }

  strafeFB(speed) {
    const cosA = Math.cos(this.yawValue * RADIANS);
    const sinA = Math.sin(this.yawValue * RADIANS);
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

  pitch(speed) {
    this.pitchValue += speed;
    if (this.pitchValue >= 90) {
      this.pitchValue = 90;
    } else if (this.pitchValue <= -90) {
      this.pitchValue = -90;
    }
    /*if (this.pitchValue < 0) {
      this.pitchValue += 360;
    }*/
  }

  pitchUp(speed) {
    this.pitch(-speed);
  }

  pitchDown(speed) {
    this.pitch(speed);
  }

  yaw(speed) {
    this.yawValue += speed;
    this.yawValue %= 360;
    if (this.yawValue < 0) {
      this.yawValue += 360;
    }
  }

  yawLeft(speed) {
    this.yaw(-speed);
  }

  yawRight(speed) {
    this.yaw(speed);
  }
}

