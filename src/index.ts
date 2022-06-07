import { Controller } from './controller/Controller';
// import {  AudioListener, AudioLoader, BoxHelper, Clock, ConeGeometry, Euler, Event, Material, Matrix3, Matrix4, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, PerspectiveCamera, PositionalAudio, Quaternion, Scene, Sphere, SphereGeometry, Spherical, Vector3, WebGLRenderer } from 'three';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
// import * as Tone from 'tone'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { Daw } from './controller/Daw';
import { Space } from './dax/Space';
import * as THREE from 'three'
import { XRSpace } from './dax/XRSpace';
import { Connection } from './dax/Connection';
import { Desktop } from './rewrite/desktop/Desktop';
import { Phone } from './rewrite/phone/Phone';
import { Sound } from './rewrite/dax/sound/Sound';
// import { Desktop } from './rewrite/desktop/Desktop';
// import * as TempPhone from './phone/Phone';
// import { DaxSpace } from './dax/DaxSpace';
// import { PhoneSpace } from './phone/PhoneSpace';
// import { DesktopSpace } from './rewrite/desktop/DesktopSpace';
// import { Phone } from './rewrite/phone/Phone';
// import { Sound } from './rewrite/dax/sound/Sound';

const controller = new Controller("https://dax-server.michaelpalladino.io")

const motion_button = document.createElement("button")
motion_button.innerText = "Grant Device Motion"
motion_button.onclick = () => controller.requestPermissionForDeviceMotonData()

const orie_button = document.createElement("button");
orie_button.innerText = "Grant Orientation";
orie_button.onclick = () => controller.requestPermissionForDeviceOrientationData()

// const orientationStatus = document.createElement("h2") // appends later depending on device type


// // // let camera: PerspectiveCamera, soundCamera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, mesh: Object3D<Event> | Mesh<ConeGeometry, MeshNormalMaterial>, target: Object3D<Event> | Mesh<SphereGeometry, MeshBasicMaterial>;

// // // const spherical = new Spherical()
// // // const rotationMatrix = new Matrix4()
// // // const targetQuaternion = new Quaternion()
// // // const clock = new Clock()
// // // const speed = 10;

// // // const play_button = document.createElement("button")
// // // play_button.innerText = "Play"
// // // play_button.onclick = () => startSound()

// // // const start_effect = document.createElement("button")
// // // start_effect.innerText = "Start Orbit"
// // // start_effect.onclick = () => startOrbit()

// // // const listener = new AudioListener()
// // // const positionalAudio = new PositionalAudio(listener);
// // // const helper = new PositionalAudioHelper(positionalAudio)

// // // const camera = new PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 30)
// // // const scene = new Scene()

// // // const mesh = new Mesh()
// // // const material = new MeshNormalMaterial()

// // // const startSound = () => {}
// // // const startOrbit = () => {}
// // // const init = () => {

// // // }


// // // generateRandomStartingPosition();
// console.log(process.env.SERVER_URL)
// const connection = new Connection(process.env.SERVER_URL)
// // // // console.log(connection)

if (!controller.isMobileDevice) {
    const space = new Space()
    space.sound.setDistanceModel('inverse')
    space.sound.setRefDistance(1)
    space.control.showX = true
    space.control.showY = true
    space.control.showZ = true

    space.phone.control.showX = true
    space.phone.control.showY = true
    space.phone.control.showZ = true
    
    const helper = new PositionalAudioHelper(space.sound)
    space.phone.mesh.add(helper)

    controller.socket.on("sound placement from server", (position: any) => {
        const newPosition = new THREE.Vector3(position.x, position.y, position.z)

        const distanceFromOrigin = newPosition.distanceTo(new THREE.Vector3(0,0,0))

        if (distanceFromOrigin < 0.1) {
            space.phone.mesh.position.x = 0
            space.phone.mesh.position.y = 0
            space.phone.mesh.position.z = 0
            space.sound.setDirectionalCone(360, 360, 0.1)

        } else {
            space.phone.mesh.position.x = position.x*10
            space.phone.mesh.position.y = position.y*10
            space.phone.mesh.position.z = position.z*10
            space.sound.setDetune(0)
            space.sound.setDirectionalCone(90, 120, 0.1)

        }

        space.phone.mesh.lookAt(new THREE.Vector3(0,0,0))
        helper.update()

        Space.render(space.renderer, space.scene, space.currentCamera)

    })

    const directions = document.createElement("p")
    // directions.innerText = `
    // "W" translate | "E" rotate | "R" scale | "+/-" adjust size
    // "Q" toggle world/local space |  "Shift" snap to grid
    // "X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled
    // "Esc" reset current transform
    // "C" toggle camera | "V" random zoom
    // `
    document.body.appendChild(directions)



    const start_button = document.createElement("button")
    start_button.innerText = "Start"
    document.body.appendChild(start_button)
    start_button.onclick = e => { space.startSound() }
    document.body.appendChild(start_button)


} else {
    document.body.appendChild(motion_button);
    document.body.appendChild(orie_button)

    const header = document.createElement("h1")
    header.innerText = "Controller Device"
    document.body.appendChild(header)
    
    new XRSpace(controller)

}

// const connection = new Connection("https://dax-server.michaelpalladino.io")

// if (connection.isMobile) new Phone(connection)

// if (connection.isDesktop) {
//     const desktop = new Desktop(connection)

//     // const drums = desktop.addSound("https://dax.michaelpalladino.io/sounds/beatles/back_drums.mp3", "drums")
//     // const guitar = desktop.addSound("https://dax.michaelpalladino.io/sounds/beatles/back_guitar.mp3", "guitar")
//     // const vocals = desktop.addSound("https://dax.michaelpalladino.io/sounds/beatles/back_vocals.mp3", "vocals")


//     const alright = desktop.addSound("alright", "https://dax.michaelpalladino.io/sounds/alright.mp3")
//     const sounds = [alright]

//     function setInitialPosition(x: number, y: number, z: number, sound: Sound) {
//         sound.setPos(x, y, z)
//     }

//     // setInitialPosition(-1, 1, -1, guitar)
//     setInitialPosition(0, 0.5, -1, alright)
//     // setInitialPosition(1, 1, -1, drums)

//     // setInitialPosition(0, 0, 0, alright)
//     // // setInitialPosition(0, 0, 0, vocals)
//     // // setInitialPosition(0, 0, 0, drums)


//     function createSelect(sound: Sound) {
//         const button = document.createElement("button")
//         button.innerText = `Select ${sound}`
//         button.onclick = () => { desktop.selectSound(sound) }
        
//         return button
//     }

//     // function createOrbit(sound: Sound) {
//     //     const button = document.createElement("button")
//     //     button.innerText = `Orbit ${sound.name}`
//     //     button.onclick = () => {
//     //         function orbit() {
//     //             const time = performance.now() * 0.0003
//     //             const x = Math.sin(time * 3.7)
//     //             const y = 1
//     //             const z = Math.cos(time * 1.5)
//     //             sound.setPos(x, y, z)
//     //         }

//     //         orbit()
//     //         desktop.screen.renderer.setAnimationLoop(orbit)
//     //     }

//     //     document.body.appendChild(button)

//     //     return button
//     // }


//     // 0, -1, 2
//     function playAll() {
//         for (let i = 0; i < sounds.length; i++) {
//             sounds[i].play()

//             const button = createSelect(sounds[i])
//             // const orbit = createOrbit(sounds[i])
//             document.body.appendChild(button)
//             // document.body.appendChild(orbit)
//         }
//     }

//     // drums.sound.setVolume(0.5)
//     // guitar.sound.setVolume(0.8)

//     const play = document.createElement("button")
//     play.innerText = `Play`

//     play.onclick = playAll
//     document.body.appendChild(play)






//     // const streetcar = desktop.addSound("https://dax.michaelpalladino.io/sounds/streetcar.mp3", "streetcar")

//     // const play = document.createElement("button")
//     // play.innerText = `Play ${streetcar.name}`

//     // play.onclick = streetcar.play
//     // document.body.appendChild(play)

//     // const moveX = document.createElement("button")
//     // moveX.innerText = `Move ${streetcar.name} +1 X`
//     // moveX.onclick = () => streetcar.setPos(streetcar.position.x + 1, streetcar.position.y, streetcar.position.z)
//     // document.body.appendChild(moveX)

//     // const moveY = document.createElement("button")
//     // moveY.innerText = `Move ${streetcar.name} +1 Y`
//     // moveY.onclick = () => streetcar.setPos(streetcar.position.x, streetcar.position.y +1, streetcar.position.z)
//     // document.body.appendChild(moveY)

//     // const moveZ = document.createElement("button")
//     // moveZ.innerText = `Move ${streetcar.name} +1 Z`
//     // moveZ.onclick = () => streetcar.setPos(streetcar.position.x, streetcar.position.y, streetcar.position.z + 1)
//     // document.body.appendChild(moveZ)

//     // const alright = desktop.addSound("https://dax.michaelpalladino.io/sounds/alright.mp3", "alright")

//     // const play2 = document.createElement("button")
//     // play2.innerText = `Play ${alright.name}`

//     // play2.onclick = alright.play
//     // document.body.appendChild(play2)

//     // const play2moveX = document.createElement("button")
//     // play2moveX.innerText = `Move ${streetcar.name} +1 X`
//     // play2moveX.onclick = () => streetcar.setPos(streetcar.position.x + 1, streetcar.position.y, streetcar.position.z)
//     // document.body.appendChild(play2moveX)

//     // const moveY = document.createElement("button")
//     // moveY.innerText = `Move ${streetcar.name} +1 Y`
//     // moveY.onclick = () => streetcar.setPos(streetcar.position.x, streetcar.position.y +1, streetcar.position.z)
//     // document.body.appendChild(moveY)

//     // const moveZ = document.createElement("button")
//     // moveZ.innerText = `Move ${streetcar.name} +1 Z`
//     // moveZ.onclick = () => streetcar.setPos(streetcar.position.x, streetcar.position.y, streetcar.position.z + 1)
//     // document.body.appendChild(moveZ)


// }

// // if (connection.isMobile) {
// //     const phone = new Phone(connection)

// //     const requestDeviceOrientation = document.createElement("button")
// //     requestDeviceOrientation.innerText = "Grant Orientation"
// //     requestDeviceOrientation.onclick = phone.connection.requestDeviceOrientation
// //     document.body.appendChild(requestDeviceOrientation)

// // }






