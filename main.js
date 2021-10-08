const elementByID = document.getElementById.bind(document);

let app;
window.addEventListener('load', function window_onLoad() {
  const cvs = elementByID('cvs');
  cvs.width = cvs.parentElement.clientWidth;
  cvs.height = cvs.parentElement.clientHeight;
  app = new Application(cvs);
  
  const hud = elementByID('hud');
  hud.addEventListener('click', (event) => {
    event.preventDefault();
    if (document.pointerLockElement !== cvs) {
      cvs.requestPointerLock();
    }
  });

  function cvs_onMouseMove(event) {
    let x = event.movementX;
    let y = event.movementY;
    app.onMouseMove(x, y);
  }

  cvs.addEventListener('mousemove', cvs_onMouseMove);

  const cameraXLabel = elementByID('cameraXLabel');
  const cameraYLabel = elementByID('cameraYLabel');
  const cameraZLabel = elementByID('cameraZLabel');
  const cameraPitchLabel = elementByID('cameraPitchLabel');
  const cameraYawLabel = elementByID('cameraYawLabel');
  const cameraRollLabel = elementByID('cameraRollLabel');
  const timeLabel = elementByID('timeLabel');
  app.onUpdate = ({
    x, y, z,
    pitch, yaw, roll,
    timestamp
  }) => {
    cameraXLabel.textContent = x.toFixed(1);
    cameraYLabel.textContent = y.toFixed(1);
    cameraZLabel.textContent = z.toFixed(1);
    cameraPitchLabel.textContent = pitch.toFixed(1);
    cameraYawLabel.textContent = yaw.toFixed(1);
    cameraRollLabel.textContent = roll.toFixed(1);
    timeLabel.textContent = timestampToHHMMSS(timestamp);
  };
  app.run();
});

window.addEventListener('keydown', function window_onKeyDown(event) {
  app.onKeyDown(event.key);
});

window.addEventListener('keyup', function window_onKeyUp(event) {
  app.onKeyUp(event.key);
});

