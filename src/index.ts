import * as THREE from "three";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";
import { Connection } from "./cleanup/Connection";
import { XRSpace } from "./controller/XRSpace";
import { Space } from "./dax/Space";

const connection = new Connection("https://dax-server.michaelpalladino.io");
// if (connection.isDesktop) {
//   const desktop = createDesktop(connection);
//   desktop.addSound(
//     "alright",
//     "https://dax.michaelpalladino.io/sounds/alright.mp3"
//   );
// }
// if (connection.isMobile) createMobile(connection);

if (!connection.isMobile) {
  const space = new Space();
  space.sound.setDistanceModel("inverse");
  space.sound.setRefDistance(1);
  space.control.showX = true;
  space.control.showY = true;
  space.control.showZ = true;

  space.phone.control.showX = true;
  space.phone.control.showY = true;
  space.phone.control.showZ = true;

  const helper = new PositionalAudioHelper(space.sound);
  space.phone.mesh.add(helper);

  connection.socket.on("sound placement from server", (position: any) => {
    const newPosition = new THREE.Vector3(position.x, position.y, position.z);

    const distanceFromOrigin = newPosition.distanceTo(
      new THREE.Vector3(0, 0, 0)
    );

    if (distanceFromOrigin < 0.1) {
      space.phone.mesh.position.x = 0;
      space.phone.mesh.position.y = 0;
      space.phone.mesh.position.z = 0;
      space.sound.setDirectionalCone(360, 360, 0.1);
    } else {
      space.phone.mesh.position.x = position.x * 10;
      space.phone.mesh.position.y = position.y * 10;
      space.phone.mesh.position.z = position.z * 10;
      space.sound.setDetune(0);
      space.sound.setDirectionalCone(90, 120, 0.1);
    }

    space.phone.mesh.lookAt(new THREE.Vector3(0, 0, 0));
    helper.update();

    Space.render(space.renderer, space.scene, space.currentCamera);
  });

  const start_button = document.createElement("button");
  start_button.innerText = "Start";
  document.body.appendChild(start_button);
  start_button.onclick = (e) => {
    space.startSound();
  };
  document.body.appendChild(start_button);
} else {
  const header = document.createElement("h1");
  header.innerText = "Controller Device";
  document.body.appendChild(header);

  new XRSpace(connection);
}
