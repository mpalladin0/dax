import * as THREE from "three"
import { EventDispatcher, PositionalAudio, WebGLRenderer } from "three"
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper"
import { Connection } from "../../../dax/Connection"
import { Screen } from "../../desktop/Screen"
import { SoundBox } from "./SoundBox"
// @ts-ignore
import {Text} from 'troika-three-text'
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { createAudio } from "./createAudio"
import { createDisplay } from "./createDisplay"

import { SoundDisplay } from "./SoundDisplay";
import { SoundPlayer } from "./SoundPlayer";

// export class Sound {
//     private readonly listener: THREE.AudioListener
//     public readonly display: SoundBox
//     public readonly sound: THREE.PositionalAudio
//     private readonly screenRef: Screen
//     public readonly name: string

//     private readonly connectionRef: Connection = null
//     public readonly origin: THREE.Vector3
//     public readonly helper: PositionalAudioHelper
//     control: TransformControls

//     constructor(
//         listener: THREE.AudioListener, 
//         name: string, 
//         screenRef: Screen,
//         fileUrl?: string,
//         connectionRef?: Connection,
//     ) 
//     {

//         this.listener = listener
//         this.sound = new PositionalAudio(this.listener)
//         this.name = name
//         this.screenRef = screenRef
//         this.connectionRef = connectionRef

//         this.origin = new THREE.Vector3(0, 0, 0)

//         if (fileUrl) {
//             console.log("Loading sound from ", fileUrl)

//             new THREE.AudioLoader().load(
//                 fileUrl, 
//                 this.onLoad, 
//                 this.onProgress, 
//                 this.onError
//             )
//         }

//         this.sound.setDistanceModel('inverse')
//         this.sound.setRefDistance(1)

//         this.display = new SoundBox()
//         this.display.element.name = name
//         this.helper = new PositionalAudioHelper(this.sound)

//         /** Phone Controls */
//         this.control = new TransformControls(this.screenRef.currentCamera, this.screenRef.renderer.domElement)
//         this.control.addEventListener('change', () => screenRef.render())
//         this.control.addEventListener('dragging-changed', (event) => {
//             console.log(event)
//             this.screenRef.orbit.enabled =! event.value
//         })

//         this.display.element.add(this.control)


//         if (this.connectionRef.isDesktop) this.display.element.add(this.helper)

//     }

//     private onLoad = (buffer: AudioBuffer) => {
//         console.log("Sound buffer loaded: ", buffer)

//         const bufferSource = this.sound.context.createBufferSource()
//         bufferSource.buffer = buffer
//         this.sound.setBuffer(buffer)

//         this.display.element.name = this.name
//         this.display.element.add(this.sound) 

//         // this.sound.add(this.display.element)


//     }
//     private onProgress = (request: ProgressEvent<EventTarget>) => {
//     }
//     private onError = (event: ErrorEvent) => {
//     }

//     public get position () { return this.sound.position }

//     public readonly play = () => {
//         /**
//          * Inform the server that a new sound was added, that way any connected phones
//          * can update their displays with the sound information
//          */
//             const payload = {
//                 name: this.name,
//                     x: this.position.x,
//                     y: this.position.y,
//                     z: this.position.z
//                 }

//         if (this.connectionRef) this.connectionRef.socket.emit("sound added from desktop", payload)

//         this.sound.play()
//         // this.sound.setDirectionalCone(90, 120, 0.1)
//         this.helper.update()


//         console.log("Playing sound: ", this.sound.isPlaying)
//     }

//     public readonly pause = () => {
//         this.sound.stop()

//         console.log("Playing sound: ", this.sound.isPlaying)
//     }

//     public readonly setPos = (x: number, y: number, z: number) => {
//         // console.log(x, y, z)
//         const newPosition = new THREE.Vector3(x, y, z)
//         const distanceFromOrigin = newPosition.distanceTo(this.origin)
//         // this.display.element.position.setX(x)
//         // this.display.element.position.setY(y)
//         // this.display.element.position.setZ(z)

//         if (this.connectionRef.isDesktop && distanceFromOrigin > 0.1) {
//             // this.sound.position.x = x
//             // this.sound.position.y = y
//             // this.sound.position.z = z

//             this.display.element.position.x = x
//             this.display.element.position.y = x
//             this.display.element.position.z = x

//             this.sound.setDirectionalCone(120, 230, 0)
//         }

//         if (this.connectionRef.isDesktop && distanceFromOrigin < 0.1) {
//             this.sound.position.x = 0
//             this.sound.position.y = 0
//             this.sound.position.z = 0

//             this.display.element.position.x = this.sound.position.x
//             this.display.element.position.y = this.sound.position.y
//             this.display.element.position.z = this.sound.position.z

//             this.sound.setDirectionalCone(360, 360, 0.1)
//         }

//         if (this.connectionRef.isMobile) {
//             // this.display.element.dispatchEvent({ type: 'change-x', update: x })
//             // this.display.element.dispatchEvent({ type: 'change-y', update: y })
//             // this.display.element.dispatchEvent({ type: 'change-z', update: z })

//             // const controller = this.screenRef.renderer.xr.getController(1)

//             // this.display.element.position.x = controller.position.x
//             // this.display.element.position.y = controller.position.
//             // this.display.element.position.z = con

//             // this.sound.position.x = controller.position.x +1
//             // this.sound.position.y = controller.position.y +1
//             // this.sound.position.z = controller.position.z +1


//         }

//         // this.sound.position.x = x
//         // this.sound.position.y = y
//         // this.sound.position.z = z


//         // console.log("POSITION", this.display.element.position)

//         this.display.element.lookAt(this.origin)
//         this.screenRef.render()

//         const movementPayload = {
//             name: this.name,
//             x: this.display.element.position.x*2,
//             y: this.display.element.position.y*2,
//             z: this.display.element.position.z*2,
//         }

//         this.helper.update()

//         if (this.connectionRef.isDesktop) this.connectionRef.socket.emit("sound moved from desktop", movementPayload)

//     }

//     public readonly setHelper  = (enabled: boolean) => {
//         if (enabled) this.helper.visible = true
//         if (!enabled) this.helper.visible = false
//     }
    
// }

// type Mode = "XR" | "DESKTOP"

// export class Sound {
//     public readonly name: string
//     public readonly player: SoundPlayer
//     public readonly display: SoundDisplay

//     public readonly mode: "XR" | "DESKTOP"
//     public readonly connection: Connection;

//     /** Helpers for determining if a sound is actively 'Selected' by a user or not */
//     private readonly clock = new THREE.Clock()
//     private isSelected = false // Will be moved by users phone position
//     private isMoving = false // Device is currently in motion (hack used for determining how much time as elapsed) 
//     private isReady = false // Also a hacl

//     constructor(mode: Mode, connection: Connection, url: string, name: string) {
//         this.name = name
//         this.player = new SoundPlayer(url)
//         this.display = new SoundDisplay()

//         this.mode = mode
//         this.connection = connection

//     }

//     public readonly setPos = (x: number, y: number, z: number) => {}
//     public readonly showDisplay = (value: boolean) => {}
//     public readonly showSoundHelper = (value: boolean) => {}
//     public readonly showTransformControls = (value: boolean) => {}
// }

type Mode = "XR" | "DESKTOP"


export class Sound {
    public  name: string
    public  url: string
    public  mode: Mode

    private  audio: THREE.PositionalAudio
    private  display: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>

    /** Positional Helpers */
    private  origin = new THREE.Vector3(0, 0, 0)
    private positionalAudioHelper


    constructor(name: string, url: string, mode: Mode, scene: THREE.Scene, connection: Connection) {
        this.name = name
        this.url = url
        this.mode = mode

        this.audio = createAudio(url)
        this.display = createDisplay(this.audio, scene)

        this.positionalAudioHelper = new PositionalAudioHelper(this.audio)

    }

    public readonly play = () => {
        this.audio.play()
    }
    public readonly pause = () => {
        this.audio.pause()
    }

    public readonly setPos = (x: number, y: number, z: number) => {
        this.display.position.setX(x)
        this.display.position.setY(y)
        this.display.position.setZ(z)
        this.display.lookAt(this.origin)
    }

    public readonly showPositionalHelper = (value: boolean) => {
        if (value) this.audio.add(this.positionalAudioHelper)
        else this.audio.remove(this.positionalAudioHelper)
    }


}


