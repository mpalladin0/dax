import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, PositionalAudio, Quaternion, Scene, Vector3, WebGLRenderer } from "three";
import { Controller } from "../controller/Controller";
import * as THREE from 'three'

export function createScene(renderer: WebGLRenderer, masterController: Controller) {
    const scene = new Scene(); 

    masterController.socket.emit("screen tap")
    
    const camera = new PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.02,
      20,
    )

    const boxGeometry = new BoxBufferGeometry(0.00762, 0.16002, 0.077978);
    const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
    const box = new Mesh(boxGeometry, boxMaterial);
    box.position.z = -3;
  
    scene.add(box);

    const controller = renderer.xr.getController(1)
    scene.add(controller)

    const listener = new THREE.AudioListener()
    camera.add(listener)
    
    const sound = new PositionalAudio(listener)
    box.add(sound)


    let selected = false

    controller.addEventListener("selectstart", () => {
        masterController.socket.emit("screen tap", "Finger on screen")
        selected = true
    })

    controller.addEventListener("selectend", () => {
        masterController.socket.emit("screen tap", "Finger off screen")
        selected = false

    })
    
    // Render loop
    function renderLoop(timestamp: number, frame?: XRFrame) {

      // Only render content if XR view is presenting.
      if (renderer.xr.isPresenting) {
        if (selected) { 
            box.position.x = controller.position.x
            box.position.y = controller.position.y
            box.position.z = controller.position.z

            ////
            box.rotation.x = controller.rotation.x
            box.rotation.y = controller.rotation.y
            box.rotation.z = controller.rotation.z

            const boxPositionPaylaod = {
                x: box.position.x,
                y: box.position.y,
                z: box.position.z,
                r_x: box.rotation.x,
                r_y: box.rotation.y,
                r_z: box.rotation.z,
            }

            masterController.socket.emit("sound placement from controller", boxPositionPaylaod) 
                        
        }

        renderer.render(scene, camera);    
      }
    }
    // @ts-ignore
    renderer.setAnimationLoop(renderLoop);
  }