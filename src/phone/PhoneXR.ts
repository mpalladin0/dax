import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Connection } from "../dax/Connection";
import { DaxSpace } from "../dax/DaxSpace";
import { Phone } from "./Phone";
import * as THREE from 'three'
import { ARButton } from "three/examples/jsm/webxr/ARButton";

export class PhoneXR {
    private phoneConnection: Connection
    private renderer: WebGLRenderer
    private space: DaxSpace
    private camera: any
    private scene: Scene
    private controller: THREE.Group

    private fingerOnScreen = false
    private box: Mesh<BoxBufferGeometry, MeshBasicMaterial>;

    constructor(phoneConnection: Connection, space: DaxSpace) {
        this.phoneConnection = phoneConnection
        this.renderer = space.renderer
        this.space = space

        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setPixelRatio(devicePixelRatio);
        
        // Enable XR functionality on the renderer.
        this.renderer.xr.enabled = true;
      
        // Add it to the DOM.
        document.body.appendChild(this.renderer.domElement)
      
        // Create the AR button element, configure our XR session, and append it to the DOM.
        document.body.appendChild(ARButton.createButton(
          this.renderer,
          { requiredFeatures: ["hit-test"] },
        ))

        /** XR Controller is our phone */
        this.controller = space.renderer.xr.getController(1)

        /** Setup Scene */
        this.scene = new Scene()

        /** Setup reference camera */
        this.camera = new PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.02,
            20,
        )

        /** Setup Box Reference
         * Since we need a reference point for where our phone is in real life space, we make a box and add it to the scene
         * We'll use its position later to determine where to place the sound
        */
        const boxGeometry = new BoxBufferGeometry(0.00762, 0.16002, 0.077978);
        const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        this.box = new Mesh(boxGeometry, boxMaterial);
        this.box.position.z = -3;
        this.scene.add(this.box);

        /** Listen for when users finger is on the screen, then update fingerOnScreen to use later  */
        this.controller.addEventListener("selectstart", () => {
            this.phoneConnection.socket.emit("screen tap", "Finger on screen")
            this.fingerOnScreen = true
        })
    
        this.controller.addEventListener("selectend", () => {
            this.phoneConnection.socket.emit("screen tap", "Finger off screen")
            this.fingerOnScreen = false
    
        })     
        
        // @ts-ignore
        this.renderer.setAnimationLoop(this.renderLoop);

    }

    // Render loop
    private renderLoop = (timestamp: number, frame?: XRFrame) => {
        // Only render content if XR view is presenting.
        if (this.renderer.xr.isPresenting) {
          if (this.fingerOnScreen) { 
              this.box.position.x = this.controller.position.x
              this.box.position.y = this.controller.position.y
              this.box.position.z = this.controller.position.z
  
              ////
              this.box.rotation.x = this.controller.rotation.x
              this.box.rotation.y = this.controller.rotation.y
              this.box.rotation.z = this.controller.rotation.z
  
              const boxPositionPaylaod = {
                  x: this.box.position.x,
                  y: this.box.position.y,
                  z: this.box.position.z,
                  r_x: this.box.rotation.x,
                  r_y: this.box.rotation.y,
                  r_z: this.box.rotation.z,
              }
  
              this.phoneConnection.socket.emit("sound placement from controller", boxPositionPaylaod) 
                          
          }
  
          this.renderer.render(this.scene, this.camera);    
        }
    }
    
}
