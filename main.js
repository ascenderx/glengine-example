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
    cameraXLabel.textContent = Math.floor(x);
    cameraYLabel.textContent = Math.floor(y);
    cameraZLabel.textContent = Math.floor(z);
    cameraPitchLabel.textContent = Math.floor(pitch);
    cameraYawLabel.textContent = Math.floor(yaw);
    cameraRollLabel.textContent = Math.floor(roll);
    const hours = Math.floor(timestamp / 3600 / 1000);
    const minutes = Math.floor((timestamp / 60 / 1000) % 60);
    const seconds = Math.floor((timestamp / 1000) % 60);
    timeLabel.textContent = `${hours}:${minutes}:${seconds}`;
  };
  app.run();
});

window.addEventListener('keydown', function window_onKeyDown(event) {
  app.onKeyDown(event.key);
});

window.addEventListener('keyup', function window_onKeyUp(event) {
  app.onKeyUp(event.key);
});

