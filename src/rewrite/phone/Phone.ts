import { Connection } from "../../dax/Connection";
import * as THREE from 'three'
// import { Sound } from "../dax/sound/Sound";
// import { Screen } from "../desktop/Screen";
// import { SoundBox } from "../dax/sound/SoundBox";
// import { Color, Vector3 } from "three";

import { Sound } from "../dax/sound/Sound"
import { Screen } from "../desktop/Screen";

// export class Phone {
//     public readonly connection: Connection
//     public readonly listener: THREE.AudioListener
//     public readonly screen: Screen

//     private sounds: Map<string, Sound> = new Map()
//     private selected: SoundBox['element']

//     private selecting = false
//     private ready = false

//     private readonly controller: THREE.Group;
//     private mouse = { x: 0, y: 0 }
//     private raycaster: THREE.Raycaster;

//     private timeSinceLastSelection = 0;
//     private clock: THREE.Clock;

//     public readonly origin = new Vector3(0,0,0)

//     constructor(connection: Connection) {
//         this.connection = connection

//         this.listener = new THREE.AudioListener()
//         this.screen = new Screen(true)

//         /** Listen for controller (fingers on screen) events */
//         this.controller = this.screen.renderer.xr.getController(1)
//         this.screen.scene.add(this.controller)
//         this.screen.renderer.setAnimationLoop(this.renderXR);

//         this.screen.renderer.xr.getSession()

//         this.clock = new THREE.Clock()


//         this.controller.addEventListener("selectstart", () => {
//             if (!this.ready) {
//                 this.connection.socket.emit("phone needs all sound positions from desktop")
//                 this.ready = true
//             }
//             // // this.controller.ray
//             // this.connection.socket.emit("selecting", "Finger on screen", this.controller.position)
//             // this.selecting = true
//         })
//         // this.connection.socket.on("add sound", (payload: any) => {
//         //     const sound = new Sound(this.listener, payload.name, this.screen, null, this.connection)
//         //     sound.display.element.name = payload.name

//         //     this.connectSound(sound)
//         //     this.sounds.set(payload.name, sound)
//         // })

//         this.connection.socket.on("add sound", (payload: any) => {
//             const sound = new Sound(this.listener, payload.name, this.screen, null, this.connection)
//             sound.setPos(payload.x, payload.y, payload.z)

//             this.connectSound(sound)
//             this.sounds.set(payload.name, sound)

//             this.screen.renderer.render(this.screen.scene, this.screen.currentCamera)


//             // this.connection.socket.emit("selecting", payload)
//         })

//         this.connection.socket.on("select sound", (soundName: string) => {
//             const sound = this.sounds.get(soundName)
//             this.selected = sound.display.element
//             this.clock.elapsedTime = 0
//         })

//         this.controller.addEventListener("selectstart", () => {
//             // this.controller.ray
//             this.connection.socket.emit("selecting", "Finger on screen", this.controller.position)
//             this.selecting = true

//             this.clock.elapsedTime = 0

//         })
    
//         this.controller.addEventListener("selectend", () => {
//             this.connection.socket.emit("selecting", "Finger off screen")
//             this.selecting = false

//             this.clock.start()
//         })

//         window.addEventListener('deviceorientation', (e) => {
//             if (this.clock.getElapsedTime() > 4 && !this.selecting) {
//                 this.selected.material.color.set(new Color(0x808080))
//                 this.selected = null
//             }

//             if (this.clock.getElapsedTime() > 3 && !this.selecting) {
//                 this.selected.material.color.set(new Color(0xff0000))
//             }


//             if (this.clock.getElapsedTime() > 2 && !this.selecting) {
//                 this.selected.material.color.set(new Color(0xffff00))
//             }


//             if (this.clock.getElapsedTime() > 1 && !this.selecting) {
//                 this.selected.material.color.set(new Color(0x00ff00))
//             }

//         })


//         /** Raycaster to determine mouse/finger positions when clicked or tapped */
//         this.raycaster = new THREE.Raycaster()
//         this.screen.renderer.domElement.addEventListener('click', this.raycast, false)

//     }   
    
//     private raycast = (e: any) => {

//         //1. sets the mouse position with a coordinate system where the center
//         //   of the screen is the origin
//         this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
//         this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    
//         //2. set the picking ray from the camera position and mouse coordinates
//         this.raycaster.setFromCamera(this.mouse, this.screen.currentCamera)  
    
//         //3. compute intersections
//         this.sounds.forEach(sound => {
//             let intersects = this.raycaster.intersectObject(sound.display.element)
//             console.log(intersects)

//             if (intersects.length > 0) {
//                 this.selected = intersects[0].object as unknown as SoundBox['element']

//                 // @ts-ignore
//                 // this.connection.socket.emit("selecting", "SOUND SELECTED", this.selected, this.selected.name)

//                 // @ts-ignore
//                this.selected.material.color.setHex(0xFFA500)

//                this.onSelectedSound()
//             }

//         })
    
//     }

//     private readonly onSelectedSound = () => {
//         const selectedPayload = {
//             name: this.selected
//         }

//         this.connection.socket.emit("sound selected from phone to be moved", selectedPayload)
//     }

//     private readonly moveSelectedSound = () => {
//         this.selected.position.x = this.controller.position.x
//         this.selected.position.y = this.controller.position.y
//         this.selected.position.z = this.controller.position.z
//         this.selected.lookAt(this.origin)

//         const movementPayload = {
//             name: this.selected.name,
//             x: this.selected.position.x,
//             y: this.selected.position.y,
//             z: this.selected.position.z,

//         }

//         this.connection.socket.emit("sound moved from phone", movementPayload)
//     }

//     public readonly connectSound = (sound: Sound) => {
//         this.screen.add(sound.display.element)
//     }

//     public readonly selectSound = () => {
//         this.selected = null
//     }

//     public renderXR = () => {
//         if (this.screen.renderer.xr.isPresenting) {
//             this.sounds.forEach(sound => { sound.display.element.lookAt(this.origin) })


//             if (this.selecting) {
//                 if (this.selected) {
//                     this.moveSelectedSound()
//                 }
//             }

//             if (this.timeSinceLastSelection > 5) {
//                 this.selected = null
//             }


//             this.screen.renderer.render(this.screen.scene, this.screen.currentCamera)
//         }
//     }
// }

// export function createScene(renderer: WebGLRenderer, masterController: Controller) {
//     const scene = new Scene(); 

//     masterController.socket.emit("screen tap")
    
//     const camera = new PerspectiveCamera(
//       70,
//       window.innerWidth / window.innerHeight,
//       0.02,
//       20,
//     )

//     const boxGeometry = new BoxBufferGeometry(0.00762, 0.16002, 0.077978);
//     const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
//     const box = new Mesh(boxGeometry, boxMaterial);
//     box.position.z = -3;

//     const testButton = document.createElement("button")
//     testButton.innerText = "Testing"
//     document.body.appendChild(testButton)
  
//     scene.add(box);

//     const controller = renderer.xr.getController(1)
//     scene.add(controller)

//     const listener = new THREE.AudioListener()
//     camera.add(listener)
    
//     const sound = new PositionalAudio(listener)
//     box.add(sound)

//     // let r_x = 0;
//     // let r_y = 0;
//     // let r_z = 0;

//     // window.addEventListener('deviceorientation', (e) => {
//     //     r_x = THREE.MathUtils.degToRad(e.alpha)
//     //     r_y = THREE.MathUtils.degToRad(e.beta)
//     //     r_z = THREE.MathUtils.degToRad(e.gamma)
//     // })

//     let selected = false

//     controller.addEventListener("selectstart", () => {
//         masterController.socket.emit("screen tap", "Finger on screen")
//         selected = true
//     })

//     controller.addEventListener("selectend", () => {
//         masterController.socket.emit("screen tap", "Finger off screen")
//         selected = false

//     })


    
//     // // Render loop
//     function renderLoop(timestamp: number, frame?: XRFrame) {
//     // box.rotation.y += 0.01;
//     // box.rotation.x += 0.01;

//       // Only render content if XR view is presenting.
//       if (renderer.xr.isPresenting) {
//         if (selected) { 
//             box.position.x = controller.position.x
//             box.position.y = controller.position.y
//             box.position.z = controller.position.z

//             ////
//             box.rotation.x = controller.rotation.x
//             box.rotation.y = controller.rotation.y
//             box.rotation.z = controller.rotation.z

//             const boxPositionPaylaod = {
//                 x: box.position.x,
//                 y: box.position.y,
//                 z: box.position.z,
//                 r_x: box.rotation.x,
//                 r_y: box.rotation.y,
//                 r_z: box.rotation.z,
//             }

//             masterController.socket.emit("sound placement from controller", boxPositionPaylaod) 
                        
//         }

//         renderer.render(scene, camera);    
//       }
//     }
//     // @ts-ignore
//     renderer.setAnimationLoop(renderLoop);
//   }


export class Phone {
    public readonly sounds: Map<string, Sound> = new Map()
    private selectedSound: Sound = null

    /** Scene Helpers */
    // private readonly scene = new THREE.Scene()
    private readonly connection
    screen: Screen;
    
    constructor(connection: Connection) {
        this.connection = connection

        this.screen = new Screen(true)

        connection.socket.on("sound selected from desktop", this.onSoundSelectedFromDesktop)
    }

    public readonly addSound = (name: string, url: string) => {
        const sound = new Sound(name, url, "XR", this.screen.scene, this.connection)
        this.sounds.set(name, sound)

        return sound
    }
    public readonly removeSound = (sound: Sound) => {}

    public readonly selectSound = (name: string) => {
        const selection = this.sounds.get(name)
        if (selection) this.selectedSound = selection

        this.connection.socket.emit("sound selected from phone", this.selectedSound.name)
    }

    public readonly moveSound = (x: number, y: number, z: number) => {
        this.selectedSound.setPos(x, y, z)
    }

    private readonly onSoundSelectedFromDesktop = (name: string) => {
        this.selectedSound = this.sounds.get(name)
    }
}