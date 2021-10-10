const elementByID = document.getElementById.bind(document);

function window_onLoad() {
  const cvs = elementByID('cvs');
  const app = new Application(cvs);
  const hud = elementByID('hud');
  const canvasWidthLabel = elementByID('canvasWidthLabel');
  const canvasHeightLabel = elementByID('canvasHeightLabel');
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
    x, y, z,
    pitch, yaw, roll,
    timestamp,
  }) {
    cameraXLabel.textContent = x.toFixed(1);
    cameraYLabel.textContent = y.toFixed(1);
    cameraZLabel.textContent = z.toFixed(1);
    cameraPitchLabel.textContent = pitch.toFixed(1);
    cameraYawLabel.textContent = yaw.toFixed(1);
    cameraRollLabel.textContent = roll.toFixed(1);
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

