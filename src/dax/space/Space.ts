import * as THREE from "three";
import { AudioListener, AudioLoader, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Connection } from "../../cleanup/Connection";
import { Phone } from "../Phone";
import { makeCamera } from "./makeCamera";
import { makeRenderer } from "./makeRenderer";
/**
 * https://threejs.org/examples/#misc_controls_transform
 */

export class Space {
  buffer: AudioBuffer;
  public renderer: THREE.WebGLRenderer;
  public aspect = window.innerWidth / window.innerHeight;
  private cameraPersp: THREE.PerspectiveCamera;
  private cameraOrtho: THREE.OrthographicCamera;
  public currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  public scene: THREE.Scene;
  private light: THREE.DirectionalLight;
  private texture: THREE.Texture;
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshLambertMaterial;
  private orbit: OrbitControls;
  public control: TransformControls;
  private mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
  public phone: Phone;
  listener: AudioListener;
  secondSound: THREE.PositionalAudio;
  secondPhone: Phone;
  secondControl: TransformControls;
  secondMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
  biquadFilter: BiquadFilterNode;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  sounds: any[];
  sound: Sound;
  public readonly soundController: SoundController;

  constructor({ connection }: { connection: Connection }) {
    /** Renderer */
    this.renderer = makeRenderer();
    document.body.appendChild(this.renderer.domElement);

    this.sounds = [];

    /** Perspective Camera
     * --> Initialized to currentCamera
     */
    this.cameraPersp = makeCamera();

    /** Current Camera */
    this.currentCamera = this.cameraPersp;

    /** Scene */
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.GridHelper(100, 100, 0x888888, 0x444444));

    /** Directional Light */
    this.light = new THREE.DirectionalLight(0xffffff, 2);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);

    /** Device Texture */
    this.texture = new THREE.TextureLoader().load("textures/crate.gif", () =>
      Space.render(this.renderer, this.scene, this.currentCamera)
    );
    this.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    /** Device Geometry */
    // this.geometry = new THREE.BoxGeometry(0.00762, 0.16002, 0.077978)
    this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.material = new THREE.MeshLambertMaterial({
      map: this.texture,
      transparent: true,
    });

    /** Orbit */
    this.orbit = new OrbitControls(
      this.currentCamera,
      this.renderer.domElement
    );

    this.orbit.update();
    this.orbit.addEventListener("change", () =>
      Space.render(this.renderer, this.scene, this.currentCamera)
    );

    /** Create Phone and add to Space */

    /** Mesh  */
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    /** Phone Controls */
    this.control = new TransformControls(
      this.currentCamera,
      this.renderer.domElement
    );
    this.control.addEventListener("change", () =>
      Space.render(this.renderer, this.scene, this.currentCamera)
    );
    this.control.addEventListener("dragging-changed", (event) => {
      console.log(event);
      this.orbit.enabled = !event.value;
    });

    this.phone = new Phone(
      this.scene,
      this.mesh,
      this.control,
      this.renderer,
      this.currentCamera
    );

    /** Handle window resize event */
    window.addEventListener("reset", this.onWindowResize);
    window.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
        case 81: // Q
          this.control.setSpace(
            this.control.space === "local" ? "world" : "local"
          );
          break;

        case 16: // Shift
          this.control.setTranslationSnap(100);
          this.control.setRotationSnap(THREE.MathUtils.degToRad(15));
          this.control.setScaleSnap(0.25);
          break;

        case 87: // W
          this.control.setMode("translate");
          break;

        case 69: // E
          this.control.setMode("rotate");
          break;

        case 82: // R
          this.control.setMode("scale");
          break;

        case 67: // C
          const position = this.currentCamera.position.clone();

          this.currentCamera = this.currentCamera.isCamera
            ? this.cameraOrtho
            : this.cameraPersp;
          this.currentCamera.position.copy(position);

          this.orbit.object = this.currentCamera;
          this.control.camera = this.currentCamera;

          this.currentCamera.lookAt(
            this.orbit.target.x,
            this.orbit.target.y,
            this.orbit.target.z
          );
          this.onWindowResize();
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
    window.addEventListener("keyup", (event) => {
      switch (event.keyCode) {
        case 16: // Shift
          this.control.setTranslationSnap(null);
          this.control.setRotationSnap(null);
          this.control.setScaleSnap(null);
          break;
      }
    });

    this.listener = new AudioListener();
    this.sound = new Sound({
      name: "alright",
      url: "/sounds/alright.mp3",
      listener: this.listener,
    });
    this.phone.mesh.add(this.sound);
    this.sounds.push(this.phone.mesh);

    /** Phone Controls */

    this.secondControl = new TransformControls(
      this.currentCamera,
      this.renderer.domElement
    );
    this.secondControl.addEventListener("change", () =>
      Space.render(this.renderer, this.scene, this.currentCamera)
    );
    this.secondControl.addEventListener("dragging-changed", (event) => {
      console.log(event);
      this.orbit.enabled = !event.value;
    });

    /**
     * Raycaster to detect when a user clicks a sound
     * See https://stackoverflow.com/questions/12800150/catch-the-click-event-on-a-specific-mesh-in-the-renderer
     */
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    window.addEventListener("click", this.onPointerClick);
    window.addEventListener("pointermove", this.onPointerMove);
  }

  private onPointerClick = (e: PointerEvent) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.currentCamera);
    const intersects = this.raycaster.intersectObjects(this.sounds);

    for (let i = 0; i < intersects.length; i++) {
      // intersects[i].object.customDistanceMaterial.transparent = false
      console.log(intersects[i]);
    }
  };

  private onPointerMove = (e: PointerEvent) => {};

  private onWindowResize = () => {
    this.aspect = window.innerWidth / window.innerHeight;

    this.cameraPersp.aspect = this.aspect;
    this.cameraPersp.updateProjectionMatrix();

    this.cameraOrtho.left = this.cameraOrtho.bottom * this.aspect;
    this.cameraOrtho.right = this.cameraOrtho.top * this.aspect;
    this.cameraOrtho.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    Space.render(this.renderer, this.scene, this.currentCamera);
  };

  public static render = (
    renderer: WebGLRenderer,
    scene: Scene,
    currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  ) => {
    renderer.render(scene, currentCamera);
  };

  // public startSound = () => {
  //   const audioLoader = new AudioLoader();

  //   audioLoader.load("/sounds/alright.mp3", (buffer) => {
  //     console.log("Starting sound...");
  //     this.sound.setBuffer(buffer);
  //     this.sound.play();

  //     console.log("Playing:", this.sound.isPlaying);

  //   });

  // };
}

class Sound extends THREE.PositionalAudio {
  public readonly name;
  constructor({
    name,
    url,
    listener,
  }: {
    name: string;
    url: string;
    listener: THREE.AudioListener;
  }) {
    super(listener);
    this.name = name;
    this.loadBuffer({ url });
  }

  public loadBuffer = ({ url }: { url: string }) => {
    const audioLoader = new AudioLoader();

    audioLoader.load(`${url}`, (buffer) => {
      console.log("Buffer loaded");
      super.setBuffer(buffer);
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
