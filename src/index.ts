import _ from 'lodash';
import { Controller } from './controller/Controller';
import {  AudioListener, AudioLoader, BoxHelper, Clock, ConeGeometry, Euler, Event, Material, Matrix3, Matrix4, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, PerspectiveCamera, PositionalAudio, Quaternion, Scene, Sphere, SphereGeometry, Spherical, Vector3, WebGLRenderer } from 'three';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
import * as Tone from 'tone'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Daw } from './controller/Daw';
import { Phone } from './controller/Phone';
import { Space } from './dax/Space';
import * as THREE from 'three'
import { XRSpace } from './dax/XRSpace';

const controller = new Controller("https://dax-server.michaelpalladino.io")

const motion_button = document.createElement("button")
motion_button.innerText = "Grant Device Motion"
motion_button.onclick = () => controller.requestPermissionForDeviceMotonData()

const orie_button = document.createElement("button");
orie_button.innerText = "Grant Orientation";
orie_button.onclick = () => controller.requestPermissionForDeviceOrientationData()

const orientationStatus = document.createElement("h2") // appends later depending on device type


// let camera: PerspectiveCamera, soundCamera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, mesh: Object3D<Event> | Mesh<ConeGeometry, MeshNormalMaterial>, target: Object3D<Event> | Mesh<SphereGeometry, MeshBasicMaterial>;

// const spherical = new Spherical()
// const rotationMatrix = new Matrix4()
// const targetQuaternion = new Quaternion()
// const clock = new Clock()
// const speed = 10;

// const play_button = document.createElement("button")
// play_button.innerText = "Play"
// play_button.onclick = () => startSound()

// const start_effect = document.createElement("button")
// start_effect.innerText = "Start Orbit"
// start_effect.onclick = () => startOrbit()

// const listener = new AudioListener()
// const positionalAudio = new PositionalAudio(listener);
// const helper = new PositionalAudioHelper(positionalAudio)

// const camera = new PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 30)
// const scene = new Scene()

// const mesh = new Mesh()
// const material = new MeshNormalMaterial()

// const startSound = () => {}
// const startOrbit = () => {}
// const init = () => {

// }


// generateRandomStartingPosition();


if (!controller.isMobileDevice) {
    const space = new Space()
    const phone = space.phone
    // space.phone.control.setMode("rotate")
    // space.phone.control.setRotationSnap(THREE.MathUtils.degToRad(15))
    space.phone.control.showX = true
    space.phone.control.showY = true
    space.phone.control.showX = true

    // space.phone.mesh.scale.set(-2, -2, -2)
    space.sound.setDistanceModel('inverse')
    // space.sound.setDirectionalCone(180, 230, 0.1)
    // space.sound.setRolloffFactor(0.1)
    space.sound.setRefDistance(1)
    space.control.showX = false
    space.control.showY = false
    space.control.showZ = false;
    


    const helper = new PositionalAudioHelper(space.sound)
    space.sound.add(helper)

    controller.socket.on("sound placement from server", (position: any) => {
        const newPosition = new Vector3(position.x, position.y, position.z)

        const distanceFromOrigin = newPosition.distanceTo(new Vector3(0,0,0))

        console.log(distanceFromOrigin)
        if (distanceFromOrigin < 0.1) {
            space.phone.mesh.position.x = 0
            space.phone.mesh.position.y = 0
            space.phone.mesh.position.z = 0
            space.sound.setDirectionalCone(360, 360, 0.1)
            space.sound.setDetune(-300)

        } else {
            space.phone.mesh.position.x = position.x*10
            space.phone.mesh.position.y = position.y*10
            space.phone.mesh.position.z = position.z*10
            space.sound.setDetune(0)
            space.sound.setDirectionalCone(90, 120, 0.1)
        }



        space.phone.mesh.lookAt(new Vector3(0,0,0))
        helper.update()
        // space.sound.mesh.lookAt(new Vector3(0, 0, 0))

        // const convert = (distanceFromOrigin * 10) % 10
        //
//
        // space.sound.setDetune(distanceFromOrigin)

        // console.log(position)

        Space.render(space.renderer, space.scene, space.currentCamera)

    })

    const directions = document.createElement("p")
    directions.innerText = `
    "W" translate | "E" rotate | "R" scale | "+/-" adjust size
    "Q" toggle world/local space |  "Shift" snap to grid
    "X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled
    "Esc" reset current transform
    "C" toggle camera | "V" random zoom
    `
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



