import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { Connection } from '../Connection';
// import { Phone } from '../phone/Phone';
import { Coordinator } from './cordinator/Coordinator';
import { makeCamera, type Camera } from './makeCamera';
import { makeHumanModel } from './makeHumanModel';
import { makeRenderer } from './makeRenderer';
import { makeScene } from './makeScene';
import { makeTexture } from './makeTexture';
import { daxrender } from './render';
import { makeSoundMesh } from './sound/makeSoundMesh';
/**
 * https://threejs.org/examples/#misc_controls_transform
 */

export class Space {
	public renderer: THREE.WebGLRenderer;
	public aspect = window.innerWidth / window.innerHeight;
	public readonly camera: Camera;
	public scene: THREE.Scene;
	public light: THREE.DirectionalLight;
	private texture: THREE.Texture;
	// private geometry: THREE.BoxGeometry;
	// private material: THREE.MeshLambertMaterial;
	public orbit: OrbitControls;
	public control: TransformControls;
	// private mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
	// public phone: Phone;
	listener: THREE.AudioListener;
	raycaster: THREE.Raycaster;
	pointer: THREE.Vector2;
	sounds: any[];
	coordinator: Coordinator;
	domElement: HTMLCanvasElement;
	cameraStaringPosition: THREE.Quaternion;
	private readonly cameraStartingEuler: THREE.Euler;
	private readonly currentCameraEuler!: THREE.Euler;
	currentCameraQ: THREE.Quaternion;
	phoneXrActive: boolean;
	setHumanModelOpacity: (amount: number) => void;
	origin: THREE.Vector3;
	mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
	// soundMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

	constructor({ connection }: { connection: Connection }) {
		/** Renderer */
		this.renderer = makeRenderer();
		this.domElement = this.renderer.domElement;
		// document.body.appendChild(this.renderer.domElement);

		this.sounds = [];

		/** Perspective Camera
		 * --> Initialized to currentCamera
		 */
		/** Current Camera */
		this.camera = makeCamera();

		this.cameraStaringPosition = new THREE.Quaternion();
		this.cameraStartingEuler = new THREE.Euler();
		this.cameraStartingEuler.setFromVector3(this.camera.position);

		this.currentCameraQ = new THREE.Quaternion();

		this.phoneXrActive = false;

		connection.socket.on('xr active', (socketId: string) => {
			const current = new THREE.Quaternion();
			this.currentCameraEuler = new THREE.Euler(
				this.camera.position.x,
				this.camera.position.y,
				this.camera.position.z
			);
			current.setFromEuler(this.currentCameraEuler);

			this.setHumanModelOpacity(0.15);

			this.phoneXrActive = true;
		});

		/** Scene */
		this.scene = makeScene();
		// this.scene.add(makeGrid());

		/** Directional Light */
		this.light = new THREE.DirectionalLight(0xffffff, 2);
		this.light.position.set(1, 1, 1);

		// this.phone.mesh.add(this.light);
		this.scene.add(this.light);

		/** Device Texture */
		this.texture = makeTexture({
			camera: this.camera,
			renderer: this.renderer,
			scene: this.scene
		});

		/** Device Geometry */
		// this.geometry = new THREE.BoxGeometry(0.00762, 0.16002, 0.077978)
		// this.geometry = makeGeometry();
		// this.material = makeMaterial({
		// 	texture: this.texture
		// });

		/** Orbit */
		this.orbit = new OrbitControls(this.camera, this.renderer.domElement);

		this.orbit.autoRotateSpeed = 0.85;
		this.orbit.autoRotate = true;
		this.orbit.enableRotate = true;
		this.orbit.enableZoom = true;
		this.orbit.addEventListener('change', () =>
			daxrender({
				camera: this.camera,
				scene: this.scene,
				renderer: this.renderer
			})
		);

		const { setOpacity } = makeHumanModel({ scene: this.scene });

		this.setHumanModelOpacity = setOpacity;

		/** Create Phone and add to Space */

		/** Mesh  */
		// this.mesh = makeMesh({
		// 	geometry: this.geometry,
		// 	material: this.material
		// });

		// this.mesh = makeSoundMesh();

		/** Phone Controls */
		this.control = new TransformControls(this.camera, this.renderer.domElement);
		this.control.showX = false;
		this.control.showY = false;
		this.control.showZ = false;
		this.control.addEventListener('change', () =>
			daxrender({
				camera: this.camera,
				scene: this.scene,
				renderer: this.renderer
			})
		);
		this.control.addEventListener('dragging-changed', (event) => {
			console.log(event);
			this.orbit.enabled = !event.value;
		});

		// this.phone = new Phone(this.scene, sound.mesh, this.control, this.renderer, this.camera);

		window.addEventListener('resize', this.onWindowResize);

		/** Handle window resize event */
		window.addEventListener('reset', this.onWindowResize);
		window.addEventListener('keydown', (event) => {
			switch (event.keyCode) {
				case 81: // Q
					this.control.setSpace(this.control.space === 'local' ? 'world' : 'local');
					break;

				case 16: // Shift
					this.control.setTranslationSnap(100);
					this.control.setRotationSnap(THREE.MathUtils.degToRad(15));
					this.control.setScaleSnap(0.25);
					break;

				case 87: // W
					this.control.setMode('translate');
					break;

				case 69: // E
					this.control.setMode('rotate');
					break;

				case 82: // R
					this.control.setMode('scale');
					break;

				case 86: // V
					const randomFoV = Math.random() + 0.1;
					const randomZoom = Math.random() + 0.1;

					this.cameraPersp.fov = randomFoV * 160;
					this.cameraOrtho.bottom = -randomFoV * 500;
					this.cameraOrtho.top = randomFoV * 500;

					this.cameraPersp.zoom = randomZoom * 5;
					this.cameraOrtho.zoom = randomZoom * 5;
					this.onWindowResize();
					break;

				case 187:
				case 107: // +, =, num+
					this.control.setSize(this.control.size + 0.1);
					break;

				case 189:
				case 109: // -, _, num-
					this.control.setSize(Math.max(this.control.size - 0.1, 0.1));
					break;

				case 88: // X
					this.control.showX = !this.control.showX;
					break;

				case 89: // Y
					this.control.showY = !this.control.showY;
					break;

				case 90: // Z
					this.control.showZ = !this.control.showZ;
					break;

				case 32: // Spacebar
					this.control.enabled = !this.control.enabled;
					break;

				case 27: // Esc
					this.control.reset();
					break;
			}
		});
		window.addEventListener('keyup', (event) => {
			switch (event.keyCode) {
				case 16: // Shift
					this.control.setTranslationSnap(null);
					this.control.setRotationSnap(null);
					this.control.setScaleSnap(null);
					break;
			}
		});

		this.listener = new THREE.AudioListener();
		// this.sound = new Sound({
		//   name: "alright",
		//   url: "/sounds/alright.mp3",
		//   listener: this.listener,
		// });

		this.coordinator = new Coordinator({
			connection: connection,
			listener: this.listener
		});

		const sound = this.coordinator.add({
			name: 'alright',
			url: 'alright.mp3'
		});

		// this.scene.add(sound);

		this.mesh = makeSoundMesh();
		this.mesh.add(sound);

		this.scene.add(this.mesh);
		// this.phone.mesh.add(sound);
		// this.sounds.push(this.phone.mesh);

		connection.socket.on('play sound', () => {
			sound.play();
		});

		/** Phone Controls */

		// this.secondControl = new TransformControls(
		//   this.currentCamera,
		//   this.renderer.domElement
		// );
		// this.secondControl.addEventListener("change", () =>
		//   Space.render(this.renderer, this.scene, this.currentCamera)
		// );
		// this.secondControl.addEventListener("dragging-changed", (event) => {
		//   console.log(event);
		//   this.orbit.enabled = !event.value;
		// });

		/**
		 * Raycaster to detect when a user clicks a sound
		 * See https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
		 */
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
		window.addEventListener('click', this.onPointerClick);
		window.addEventListener('pointermove', this.onPointerMove);

		this.origin = new THREE.Vector3(0, -1, 0);
	}

	public renderLoop = () => {
		this.orbit.update();
		this.renderer.render(this.scene, this.camera);
		if (this.phoneXrActive) {
			this.camera.position.lerp(new THREE.Vector3(0, 2.5, 8.5), 0.02);
		}
		window.requestAnimationFrame(this.renderLoop);
	};

	private onPointerClick = (e: PointerEvent) => {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components

		this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.pointer, this.camera);
		const intersects = this.raycaster.intersectObjects(this.sounds);

		for (let i = 0; i < intersects.length; i++) {
			// intersects[i].object.customDistanceMaterial.transparent = false
			console.log(intersects[i]);
		}
	};

	private onPointerMove = (e: PointerEvent) => {};

	public moveSound = (x: number, y: number, z: number) => {};

	private onWindowResize = () => {
		this.aspect = window.innerWidth / window.innerHeight;

		this.camera.aspect = this.aspect;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// this.renderer.domElement.style.marginTop = "-4rem";

		daxrender({
			camera: this.camera,
			scene: this.scene,
			renderer: this.renderer
		});
	};
}

// class SoundController extends Map<string, Sound> {
//   private readonly connection: Connection;
//   private currentSound: Sound | undefined;
//   constructor({ connection }: { connection: Connection }) {
//     super();

//     this.connection = connection;

//     connection.socket?.on(
//       "move sound",
//       (name: string, newPosition: { x: number; y: number; z: number }) => {
//         this.currentSound = super.get(name);
//         if (this.currentSound === undefined)
//           throw new Error(`Sound ${name} not sound`);
//         const { x, y, z } = newPosition;
//         this.currentSound.position.set(x, y, z);
//       }
//     );
//   }

//   public move({
//     name,
//     newPosition: { x, y, z },
//   }: {
//     name: string;
//     newPosition: { x: number; y: number; z: number };
//   }) {
//     super.get(name)?.position.set(x, y, z);
//   }
// }
