import { Connection } from "../../dax/Connection";
import * as THREE from 'three'
import { Sound } from "../dax/sound/Sound";
// import { Screen } from "./Screen";
// import { Sound } from "../dax/sound/Sound";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls";

// export class Desktop {
//     public readonly connection: Connection
//     public readonly listener: THREE.AudioListener
//     public readonly screen: Screen

//     public sounds: Map<string, Sound> = new Map()
//     private raycaster: THREE.Raycaster;

//     private mouse = { x: 0, y: 0 }

//     public selectedSound: Sound

//     constructor(connection: Connection) {
//         this.connection = connection

//         this.listener = new THREE.AudioListener()
//         this.screen = new Screen()

//         /** Raycaster to determine mouse/finger positions when clicked or tapped */
//         this.raycaster = new THREE.Raycaster()
//         this.screen.renderer.domElement.addEventListener('click', this.raycast, false)

//         this.connection.socket.on("phone needs all sound positions", () => {
//             this.sounds.forEach((sound) => {
//                 const payload = {
//                     name: sound.name,
//                     x: sound.position.x,
//                     y: sound.position.y,
//                     z: sound.position.z,   
//                 }
//                 this.connection.socket.emit("all sound positions", payload)
//             })
//         })

//         this.connection.socket.on("move sound on desktop from phone", (payload: any) => {
//             const sound = this.sounds.get(payload.name)
//             const x = payload.x*2
//             const y = payload.y*2
//             const z = payload.z*2
//             sound.setPos(x, y, z)
//         })

//         this.connection.socket.on("select sound from phone", (payload: any) => {
//             const sound = this.sounds.get(payload.name.object.name)
//             this.selectedSound = sound

//             /** Phone Controls */
//             const control = new TransformControls(this.screen.currentCamera, this.screen.renderer.domElement)
//             control.addEventListener('change', () => { this.screen.render() })
//             control.addEventListener('dragging-changed', (event) => {
//                 this.screen.orbit.enabled =! event.value
//             })

//         })
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
//         })
    
//     }

//     public readonly selectSound = (target: Sound) => {
//         this.selectedSound = target

//         this.connection.socket.emit("sound selected from desktop", target.name)
//     }
    

//     public readonly addSound = (url: string, name: string) => {
//         const sound = new Sound(this.listener, name, this.screen, url, this.connection)
        
//         this.screen.add(sound.display.element)
//         this.sounds.set(name, sound)

//         return sound

//     }


//     public readonly removeSound = (name: string) => {
//         const sound = this.sounds.get(name)
//         if (!sound) return

//         this.screen.remove(sound.display.element)
//         sound.pause()
        
//         this.sounds.delete(name)
//     }

//     public readonly getSound = (name: string) => this.sounds.get(name)
// }

export class Desktop {
    public readonly sounds: Map<string, Sound> = new Map()
    private selectedSound: Sound = null

    /** Scene Helpers */
    private readonly scene = new THREE.Scene()
    private readonly connection
    
    constructor(connection: Connection) {
        this.connection = connection

        connection.socket.on("sound selected from phone", (name: string) => this.onSoundSelectedFromPhone)
    }

    public readonly addSound = (name: string, url: string) => {
        const sound = new Sound(name, url, "DESKTOP", this.scene, this.connection)
        this.sounds.set(name, sound)

        return sound
    }
    public readonly removeSound = (sound: Sound) => {}

    public readonly selectSound = (name: string) => {
        const selection = this.sounds.get(name)
        if (selection) this.selectedSound = selection

        this.connection.socket.emit("sound selected from desktop", this.selectedSound.name)
    }

    public readonly moveSound = (x: number, y: number, z: number) => {
        this.selectedSound.setPos(x, y, z)
    }

    private readonly onSoundSelectedFromPhone = (name: string) => {
        this.selectedSound = this.sounds.get(name)
    }

}