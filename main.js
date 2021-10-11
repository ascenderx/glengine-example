const elementByID = document.getElementById.bind(document);

function window_onLoad() {
  const cvs = elementByID('cvs');
  const app = new Application(cvs);
  const hud = elementByID('hud');
  const canvasWidthLabel = elementByID('canvasWidthLabel');
  const canvasHeightLabel = elementByID('canvasHeightLabel');
  const lightAmbientRedLabel = elementByID('lightAmbientRedLabel');
  const lightAmbientGreenLabel = elementByID('lightAmbientGreenLabel');
  const lightAmbientBlueLabel = elementByID('lightAmbientBlueLabel');
  const lightRedLabel = elementByID('lightRedLabel');
  const lightGreenLabel = elementByID('lightGreenLabel');
  const lightBlueLabel = elementByID('lightBlueLabel');
  const lightXLabel = elementByID('lightXLabel');
  const lightYLabel = elementByID('lightYLabel');
  const lightZLabel = elementByID('lightZLabel');
  const cameraXLabel = elementByID('cameraXLabel');
  const cameraYLabel = elementByID('cameraYLabel');
  const cameraZLabel = elementByID('cameraZLabel');
  const cameraPitchLabel = elementByID('cameraPitchLabel');
  const cameraYawLabel = elementByID('cameraYawLabel');
  const cameraRollLabel = elementByID('cameraRollLabel');
  const timeLabel = elementByID('timeLabel');

  function window_onResize() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    app.onResize(cvs.width, cvs.height);
    canvasWidthLabel.textContent = cvs.width;
    canvasHeightLabel.textContent = cvs.height;
  }

  function window_onKeyDown({key,}) {
    app.onKeyDown(key);
  }

  function window_onKeyUp({key,}) {
    app.onKeyUp(key);
  }

  function cvs_onMouseMove({movementX, movementY,}) {
    let x = movementX;
    let y = movementY;
    app.onMouseMove(x, y);
  }

  function hud_onClick(event) {
    event.preventDefault();
    if (document.pointerLockElement !== cvs) {
      cvs.requestPointerLock();
    }
  }

  function app_onUpdate({
    light,
    camera,
    timestamp,
  }) {
    lightAmbientRedLabel.textContent = Math.floor(light.ambient[0] * 256);
    lightAmbientGreenLabel.textContent = Math.floor(light.ambient[1] * 256);
    lightAmbientBlueLabel.textContent = Math.floor(light.ambient[2] * 256);
    lightRedLabel.textContent = Math.floor(light.color[0] * 256);
    lightGreenLabel.textContent = Math.floor(light.color[1] * 256);
    lightBlueLabel.textContent = Math.floor(light.color[2] * 256);
    lightXLabel.textContent = light.direction[0].toFixed(2);
    lightYLabel.textContent = light.direction[1].toFixed(2);
    lightZLabel.textContent = light.direction[2].toFixed(2);
    cameraXLabel.textContent = camera.x.toFixed(1);
    cameraYLabel.textContent = camera.y.toFixed(1);
    cameraZLabel.textContent = camera.z.toFixed(1);
    cameraPitchLabel.textContent = camera.pitchValue.toFixed(1);
    cameraYawLabel.textContent = camera.yawValue.toFixed(1);
    cameraRollLabel.textContent = camera.rollValue.toFixed(1);
    timeLabel.textContent = timestampToHHMMSS(timestamp);
  }

  window.addEventListener('resize', window_onResize);
  window.addEventListener('keydown', window_onKeyDown);
  window.addEventListener('keyup', window_onKeyUp);
  cvs.addEventListener('mousemove', cvs_onMouseMove);
  hud.addEventListener('click', hud_onClick);
  app.onUpdate = app_onUpdate;

  window_onResize();
  app.run();
}

window.addEventListener('load', window_onLoad);

