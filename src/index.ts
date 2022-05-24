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

const controller = new Controller("https://dax-server.michaelpalladino.io")

const motion_button = document.createElement("button")
motion_button.innerText = "Grant Device Motion"
motion_button.onclick = () => controller.requestPermissionForDeviceMotonData()

const orie_button = document.createElement("button");
orie_button.innerText = "Grant Orientation";
orie_button.onclick = () => controller.requestPermissionForDeviceOrientationData()



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

// function startSound() {
//     const audioLoader = new AudioLoader();
//     Tone.setContext(positionalAudio.listener.context);

//     audioLoader.load('/sounds/whiteferrari.mp3', function (buffer) {
//         const sourceNode = positionalAudio.context.createBufferSource();
//         sourceNode.buffer = buffer;

//         // const filter = new Tone.Filter(400, 'lowpass')
//         // const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5)

//         positionalAudio.setBuffer(sourceNode.buffer)
//         positionalAudio.setRefDistance(1)
//         positionalAudio.setDistanceModel('exponential')
//         positionalAudio.setMaxDistance(200)
//         helper.update()

//         // positionalAudio.setDirectionalCone(30, 0, 1);

//         positionalAudio.play()

//         // filter.connect(listener.context.destination)
//         // feedbackDelay.connect(listener.context.destination)


//     })



// }

var currentScreenOrientation = window.orientation || 0;

window.addEventListener('orientationchange', function() {
	currentScreenOrientation = window.orientation;
}, false);

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

function getBaseQuaternion( alpha: number, beta: number, gamma: number ) {
	// var _x = beta  ? beta - degtorad : 0; // beta value
	// var _y = gamma ? gamma * degtorad : 0; // gamma value
	// var _z = alpha ? alpha * degtorad : 0; // alpha value

    var _x = beta - THREE.MathUtils.degToRad(beta)
    var _y = gamma * THREE.MathUtils.degToRad(gamma)
    var _z = alpha * THREE.MathUtils.degToRad(alpha)

	var cX = Math.cos( _x/2 );
	var cY = Math.cos( _y/2 );
	var cZ = Math.cos( _z/2 );
	var sX = Math.sin( _x/2 );
	var sY = Math.sin( _y/2 );
	var sZ = Math.sin( _z/2 );

	//
	// ZXY quaternion construction.
	//

	var w = cX * cY * cZ - sX * sY * sZ;
	var x = sX * cY * cZ - cX * sY * sZ;
	var y = cX * sY * cZ + sX * cY * sZ;
	var z = cX * cY * sZ + sX * sY * cZ;

	return [ w, x, y, z ];
}

function getScreenTransformationQuaternion( screenOrientation: number ) {
	var orientationAngle = screenOrientation ? screenOrientation * degtorad : 0;
    console.log(orientationAngle)

	var minusHalfAngle = - orientationAngle / 2;

	// Construct the screen transformation quaternion
	var q_s = [
		Math.cos( minusHalfAngle ),
		0,
		0,
		Math.sin( minusHalfAngle )
	];

	return q_s;
}

function getWorldTransformationQuaternion() {
	var worldAngle = 90 * degtorad;

	var minusHalfAngle = - worldAngle / 2;

	// Construct the world transformation quaternion
	var q_w = [
		Math.cos( minusHalfAngle ),
		Math.sin( minusHalfAngle ),
		0,
		0
	];

	return q_w;
}

function quaternionMultiply( a: number[], b: number[] ) {
	var w = a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3];
	var x = a[1] * b[0] + a[0] * b[1] + a[2] * b[3] - a[3] * b[2];
	var y = a[2] * b[0] + a[0] * b[2] + a[3] * b[1] - a[1] * b[3];
	var z = a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1];

	return [ w, x, y, z ];
}

function computeQuaternion(alpha: number, beta: number, gamma: number) {
	var quaternion = getBaseQuaternion(
		alpha,
        beta,
        gamma
	); // q

	var worldTransform = getWorldTransformationQuaternion(); // q_w

	var worldAdjustedQuaternion = quaternionMultiply( quaternion, worldTransform ); // q'_w

	var screenTransform = getScreenTransformationQuaternion( currentScreenOrientation ); // q_s

	var finalQuaternion = quaternionMultiply( worldAdjustedQuaternion, screenTransform ); // q'_s

	return finalQuaternion; // [ w, x, y, z ]
}


if (!controller.isMobileDevice) {
    const space = new Space()
    const phone = space.phone
    space.phone.control.setMode("rotate")
    space.phone.control.setRotationSnap(THREE.MathUtils.degToRad(15))
    space.phone.control.space = "local"
    space.phone.control.showX = true
    space.phone.control.showY = true
    space.phone.control.showX = true

    space.phone.mesh.scale.set(-2, -2, -2)


    controller.socket.on("device-orientation-data-frame", (orientation: any) => {
        const alpha = THREE.MathUtils.degToRad(orientation[0])
        const beta = THREE.MathUtils.degToRad(orientation[1])
        const gamma = THREE.MathUtils.degToRad(orientation[2])
        const b = computeQuaternion(orientation[0], orientation[1], orientation[2])

        
        // x, y z w
        const q = new Quaternion().set(b[1], b[2], b[3], b[0])

        space.phone.mesh.quaternion.slerp(q, 0.9)

        Space.render(space.renderer, space.scene, space.currentCamera)
    
    })

    // controller.socket.on("device-motion-data-frame", (xyz: any, alpha_beta_gamma: any) => {
    //     console.log(alpha_beta_gamma)
    //     // const alpha = orientation[0]
    //     // const beta = orientation[1]
    //     // const gamma = orientation[2]


    //     phone.control.setMode("rotate")
    //     phone.mesh.rotation.set(alpha_beta_gamma.alpha, alpha_beta_gamma.beta, alpha_beta_gamma.gamma, "YXZ")

    //     Space.render(phone.renderer, phone.scene, phone.currentCamera)
    
    // })

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
    // start_button.onclick = e => { dax.startSound() }
    document.body.appendChild(start_button)


} else {
    document.body.appendChild(motion_button);
    document.body.appendChild(orie_button)
}


