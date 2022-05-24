import * as THREE from "three";
import { Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { Phone } from "./Phone";
/**
 * https://threejs.org/examples/#misc_controls_transform
 */
export class Space {
    public renderer: THREE.WebGLRenderer
    public aspect = window.innerWidth/window.innerHeight
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

    constructor() {
        /** Renderer */
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        /** Perspective Camera */
        this.cameraPersp = new THREE.PerspectiveCamera(50, this.aspect, 0.01, 30000)

        /** Othorg Camera */
        // this.cameraOrtho = new THREE.OrthographicCamera(-600 * this.aspect, 600 * this.aspect, 600, -600, 0.01, 30000)
        this.cameraOrtho = new THREE.OrthographicCamera()

        /** Current Camera */
        this.currentCamera = this.cameraPersp
        this.currentCamera.position.set(0, 500, 1000)
        this.currentCamera.lookAt(0, 0, 0)

        /** Scene */
        this.scene = new THREE.Scene()
        this.scene.add(new THREE.GridHelper(1000, 10, 0x888888, 0x444444))

        /** Directional Light */
        this.light = new THREE.DirectionalLight(0xffffff, 2)
        this.light.position.set(1, 1, 1)
        this.scene.add(this.light)

        /** Device Texture */
        this.texture = new THREE.TextureLoader().load('/textures/crate.gif', () => Space.render(this.renderer, this.scene, this.currentCamera))
        this.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()

        /** Device Geometry */
        this.geometry = new THREE.BoxGeometry(60, 10, 100)
        this.material = new THREE.MeshLambertMaterial({ map: this.texture, transparent: true })

        /** Orbit */
        this.orbit = new OrbitControls(this.currentCamera, this.renderer.domElement)

        this.orbit.update()
        this.orbit.addEventListener('change', () => Space.render(this.renderer, this.scene, this.currentCamera))


        /** Create Phone and add to Space */

        /** Mesh  */
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 200
        // this.mesh.rotateY(Math.PI/2)
        // this.phone.mesh.rotateZ(Math.PI/2)

        /** Phone Controls */
        this.control = new TransformControls(this.currentCamera, this.renderer.domElement)
        this.control.addEventListener('change', () => Space.render(this.renderer, this.scene, this.currentCamera))
        this.control.addEventListener('dragging-changed', (event) => {
            console.log(event)
            this.orbit.enabled =! event.value
        })

        this.phone = new Phone(this.scene, this.mesh, this.control, this.renderer, this.currentCamera)

        /** Handle window resize event */
        window.addEventListener('reset', this.onWindowResize)
        window.addEventListener('keydown', (event) => {
            switch ( event.keyCode ) {

                case 81: // Q
                    this.control.setSpace(this.control.space === 'local' ? 'world' : 'local' );
                    break;

                case 16: // Shift
                    this.control.setTranslationSnap( 100 );
                    this.control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                    this.control.setScaleSnap( 0.25 );
                    break;

                case 87: // W
                    this.control.setMode( 'translate' );
                    break;

                case 69: // E
                    this.control.setMode( 'rotate' );
                    break;

                case 82: // R
                    this.control.setMode( 'scale' );
                    break;

                case 67: // C
                    const position = this.currentCamera.position.clone();

                    this.currentCamera = this.currentCamera.isCamera ? this.cameraOrtho : this.cameraPersp;
                    this.currentCamera.position.copy(position);

                    this.orbit.object = this.currentCamera;
                    this.control.camera = this.currentCamera;

                    this.currentCamera.lookAt(this.orbit.target.x, this.orbit.target.y, this.orbit.target.z)
                    this.onWindowResize();
                    break;

                case 86: // V
                    const randomFoV = Math.random() + 0.1;
                    const randomZoom = Math.random() + 0.1;

                    this.cameraPersp.fov = randomFoV * 160;
                    this.cameraOrtho.bottom = - randomFoV * 500;
                    this.cameraOrtho.top = randomFoV * 500;

                    this.cameraPersp.zoom = randomZoom * 5;
                    this.cameraOrtho.zoom = randomZoom * 5;
                    this.onWindowResize();
                    break;

                case 187:
                case 107: // +, =, num+
                    this.control.setSize( this.control.size + 0.1 );
                    break;

                case 189:
                case 109: // -, _, num-
                    this.control.setSize( Math.max( this.control.size - 0.1, 0.1 ) );
                    break;

                case 88: // X
                    this.control.showX = ! this.control.showX;
                    break;

                case 89: // Y
                    this.control.showY = ! this.control.showY;
                    break;

                case 90: // Z
                    this.control.showZ = ! this.control.showZ;
                    break;

                case 32: // Spacebar
                    this.control.enabled = ! this.control.enabled;
                    break;

                case 27: // Esc
                    this.control.reset();
                    break;

            }
        })
        window.addEventListener('keyup', (event) => {

            switch ( event.keyCode ) {
                case 16: // Shift
                    this.control.setTranslationSnap( null );
                    this.control.setRotationSnap( null );
                    this.control.setScaleSnap( null );
                    break;

            }

        });

    }

    private onWindowResize = () => {
        this.aspect = window.innerWidth/window.innerHeight

        this.cameraPersp.aspect = this.aspect;
        this.cameraPersp.updateProjectionMatrix();

        this.cameraOrtho.left = this.cameraOrtho.bottom * this.aspect;
        this.cameraOrtho.right = this.cameraOrtho.top * this.aspect;
        this.cameraOrtho.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        Space.render(this.renderer, this.scene, this.currentCamera)
    } 
    
    public static render = (renderer: WebGLRenderer, scene: Scene, currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera) => {
        // this.phone.render()
        renderer.render(scene, currentCamera)
    }
}



// export class Dax {
//     camera: PerspectiveCamera;
//     renderer: WebGLRenderer;
//     scene: Scene;
//     constructor() {
//         this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
//         this.renderer = new WebGLRenderer({ alpha: true })
//         this.renderer.setSize(window.innerWidth, window.innerHeight)
//         this.scene = new Scene()
//         this.scene.add(this.camera)

//         this.createPhone()
//         document.body.appendChild(this.renderer.domElement)
//         this.animate()

//     }

//     private createPhone = () => {
//         const geometry = new BoxGeometry( 1.3, 30, 17 )
//         const material = new MeshBasicMaterial( {color: 0x00ff00} );
//         const cube = new Mesh( geometry, material );
//         this.scene.add(cube)
//     }

//     private animate = () => {
//         requestAnimationFrame(this.animate)
//         const time = performance.now() * 0.0003
//         this.renderer.render(this.scene, this.camera); 
//     }
// }
// import { AudioListener, AudioLoader, BoxBufferGeometry, BoxHelper, BufferGeometry, Color, Event, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, PositionalAudio, Scene, Sphere, SphereGeometry, Vector3, Vector4, WebGLRenderer } from "three"
// import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper"
// import { Chorus, Listener, Reverb } from "tone"
// import * as Tone from 'tone'
// import { Delay } from "../effects/Delay"

// export class Dax {
//     scene
//     camera
//     soundCamera
//     sound
//     soundHelper
//     points: any[]
//     line
//     listener: AudioListener
//     listenerBox: Object3D<Event> | Mesh<BoxBufferGeometry, MeshStandardMaterial>     
//     renderer

//     /**
//      * Effects
//      */
//     delay: Delay

//     constructor() {
//         this.renderer = new WebGLRenderer({ antialias: true })
//         this.renderer.setSize(window.innerWidth, window.innerHeight)
//         document.body.appendChild(this.renderer.domElement)

//         this.points = []

//         this.scene = new Scene()
//         this.scene.background = new Color(0x000000)

//         this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
//         this.camera.position.z = 15
//         this.camera.position.y = 1

//         this.soundCamera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

//         this.listener = new AudioListener()
//         this.listener.position.set(0, 0, 0)
//         this.soundCamera.add(this.listener)
//         this.sound = new PositionalAudio(this.listener)
//         this.sound.setDirectionalCone(180, 230, 0.1);
//         this.sound.setRefDistance(0.1)

//         this.soundHelper = new PositionalAudioHelper(this.sound)
//         this.sound.add(this.soundHelper)

//         const material = new LineBasicMaterial( { color: 0x0000ff })
//         let points = [this.createSource(0x0000ff, 0, 0, 0), this.createListener(0x0000f1)]
//         const geometry = new BufferGeometry().setFromPoints(points)
//         this.line = new Line(geometry, material)

//         window.addEventListener('resize', this.onWindowResize)
//         this.animate()

//     }

//     private createSource = (color: number, x: number, y: number, z: number) => {
//         const vector = new Vector3(x, y, z)
//         this.sound.position.set(x, y, z);
//         this.soundCamera.position.x = x;
//         this.soundCamera.position.y = y;
//         this.soundCamera.position.z = z;
//         this.scene.add(this.sound)
//         this.soundCamera.lookAt(new Vector3(0, 0, 0));

//         this.listener.position.set(0, 0, 0)

//         this.soundHelper.update()

//         // const geometry = new SphereGeometry(0.01, 32, 16)
//         // const material = new MeshBasicMaterial( { color: 0x0000ff } )
//         // const sphere = new Mesh(geometry, material)
//         // sphere.position.x = x;
//         // sphere.position.y = y;
//         // sphere.position.z = z;

//         // console.log(sphere.position)

//         // this.scene.add(sphere)
//         return vector

//     }

//     private createListener = (color: number) => {
//         const vector = new Vector3()
//         const geometry = new SphereGeometry(2.5, 32, 16)
//         const material = new MeshBasicMaterial( { color: 0x0000ff } )
//         material.opacity = 0.5
//         material.transparent = true
//         const sphere = new Mesh(geometry, material)
        


//         this.scene.add(sphere)
//         return vector

//     }

//     private newContext = () => {
//         const audioContext = window.AudioContext
//         return new audioContext();
//       };

//     private animate = () => {
//         requestAnimationFrame(this.animate)
//         const time = performance.now() * 0.0003

//         const x =  Math.sin( time * 1.7 );
//         const y  = Math.cos( time * 1.7 );
//         const z = Math.cos( time * 1.7 );

//         this.sound.position.x = x
//         this.sound.position.y = -y
//         this.sound.position.z = z


//         this.sound.lookAt(this.listener.position)

//         // const material = new LineBasicMaterial( { color: 0x0000ff })
//         // const newPoints = [new Vector3(0, 0, 0), new Vector3(x, y, z)]
//         // const geometry = new BufferGeometry().setFromPoints(newPoints)
//         // this.line = new Line(geometry, material)

//         this.soundHelper.update()
//         this.renderer.render(this.scene, this.camera); 
//     }

//     private onWindowResize = () => {
//         this.renderer.setSize(window.innerWidth, window.innerHeight)
//         this.camera.aspect = window.innerWidth/window.innerHeight
//         this.camera.updateProjectionMatrix()
//     }

//     public startSound = () => {
//         const audioLoader = new AudioLoader();
    
//         audioLoader.load('/sounds/whiteferrari.mp3', (buffer) => {
//             console.log("Starting sound...")
//             const sourceNode = this.sound.context.createBufferSource();
//             sourceNode.buffer = buffer

//             this.sound.setBuffer(sourceNode.buffer)

//             /** Analog Delay Effect */
//             this.delay = new Delay(this.sound.context, 0.375)
//             sourceNode.connect(this.delay.input)
//             this.delay.output.connect(this.sound.context.destination)

//             this.soundHelper.update()
//             this.sound.context.resume()
//             this.sound.play()

//             console.log(this.sound)
//             console.log(this.delay)
//             console.log("Playing:", this.sound.isPlaying)
    
//             // feedbackDelay.connect(listener.context.destination)
    
//         })
    
    
    
//     }
    
// }



// // import { AdditiveBlending, AudioListener, Box3, Box3Helper, BoxGeometry, BoxHelper, BufferGeometry, CameraHelper, Color, DirectionalLight, EdgesGeometry, Event, Float32BufferAttribute, GridHelper, Group, HemisphereLight, Line, LineSegments, MathUtils, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PointLight, PointLightHelper, PolarGridHelper, PositionalAudio, Scene, SphereGeometry, sRGBEncoding, Vector3, WebGLRenderer, WireframeGeometry } from "three";
// // import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';
// // import { Volume } from "three/examples/jsm/misc/Volume";
// // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// // import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
// // import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js';
// // import { Phone } from "./Phone";
// // import { Listener } from "tone";
// // import { DaxListener } from "./DaxListener";
// // import { PositionalAudioSource } from "./PositionalAudioSource";


// // const r = 800 // radius
// // const rHalf = r/2; // half rafdius

// // let SCREEN_WIDTH = window.innerWidth;
// // let SCREEN_HEIGHT = window.innerHeight;

// // export class Dax {
// //     scene
// //     renderer
// //     camera
// //     light: PointLight
// //     lightHelper: PointLightHelper
// //     vnh: VertexNormalsHelper
// //     vth: VertexTangentsHelper
// //     mesh: Object3D<Event>
// //     group: Object3D<Event> | Group

// //     // phone controller/sound source
// //     phone: any

// //     // listener (the person that hears the audio on the website)
// //     polarGridHelper
// //     listener: AudioListener
// //     positionalAudioSource: PositionalAudioSource;

// //     cameraPerspective = new PerspectiveCamera()
// //     cameraPerspectiveHelper = new CameraHelper(this.cameraPerspective)

// //     perspectiveMesh:  Mesh<SphereGeometry, MeshBasicMaterial>

// //     cameraRig = new Group()

// //     constructor() {
// //         this.renderer = new WebGLRenderer()
// //         this.renderer.setPixelRatio(window.devicePixelRatio)
// //         this.renderer.setSize(window.innerWidth, window.innerHeight)
// //         document.body.appendChild(this.renderer.domElement)

// //         this.camera = new PerspectiveCamera(70, (window.innerWidth/window.innerHeight), 1, 1000)
// //         this.camera.position.z = 400

// //         this.scene = new Scene()
// //         this.scene.add(this.cameraPerspectiveHelper)

// //         this.cameraPerspective.rotation.y = Math.PI

// //         this._setupLight(true)


// //         const gridHelper = new GridHelper(800, 80, 0x0000ff, 0x808080)
// //         gridHelper.position.y = -150
// //         this.scene.add(gridHelper)

// //         this.polarGridHelper = new PolarGridHelper(rHalf, 16, 8, 64, 0x0000ff, 0x808080)
// //         // this.scene.add(this.polarGridHelper)

// //         const loader = new GLTFLoader()
// //         loader.load('/models/LeePerrySmith.glb', (gltf) => {


// //             // this.mesh = gltf.scene.children[0]

// //             // @ts-ignore
// //             const mesh = gltf.scene.children[0]
// //             // @ts-ignore
// //             const geometry = gltf.scene.children[0].geometry
// //             geometry.computeTangents()
 
// //             console.log(mesh)

// //             this.group = new Group()
// //             this.group.scale.multiplyScalar(50)
// //             this.scene.add(this.group)

// //             this.group.updateMatrixWorld(true)
// //             this.group.add(mesh)

// //             this.vnh = new VertexNormalsHelper(mesh, 5);
// //             this.scene.add(this.vnh)

// //             this.vth = new VertexTangentsHelper(mesh, 5 );
// //             this.scene.add(this.vth);

// //             this.scene.add(new BoxHelper(mesh, 5))

// //             // @ts-ignore
// //             // const geometry = gltf.scene.children[0].geometry
// //             // @ts-ignorer
// //             // console.log(gltf.scene.children[0].geometry)

// //             // // @ts-ignore
// //             // const wireframe = new WireframeGeometry(geometry)
// //             // const line = new LineSegments(wireframe)
// //             // line.customDepthMaterial.depthTest = false
// //             // line.customDepthMaterial.opacity = 0.25
// //             // line.customDepthMaterial.transparent = true
// //             // line.position.x = 4
// //             // this.group.add(line)
// //             // this.scene.add(new BoxHelper(line))

// //             this.scene.add(new BoxHelper(this.group))
// //             this.scene.add(new BoxHelper(this.scene))
        

// //         })

// //         this._setupPositionalAudio()



// //         window.addEventListener( 'resize', this.onWindowResize );


// //         this.animate()

// //     }

// //     private _setupPositionalAudio = () => {
// //         this.listener = new AudioListener()
// //         this.listener.add(this.cameraPerspectiveHelper)
// //         this.scene.add(this.listener)

// //         this.cameraRig.add(this.cameraPerspective)
// //         this.scene.add(this.cameraRig)

// //         this.perspectiveMesh = new Mesh(
// //             new SphereGeometry( 100, 16, 8 ),
// //             new MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
// //         );

// //         this.scene.add( this.perspectiveMesh );

// //         const mesh2 = new Mesh(
// //             new SphereGeometry( 50, 16, 8 ),
// //             new MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
// //         );
// //         mesh2.position.y = 150;
// //         this.perspectiveMesh.add( mesh2 );

// //         const mesh3 = new Mesh(
// //             new SphereGeometry( 5, 16, 8 ),
// //             new MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
// //         );
// //         mesh3.position.z = 150;
// //         this.cameraRig.add(mesh3)

// //         const geometry = new BufferGeometry()
// //         const vertices = []

// //         for (let i = 0; i < 10000; i++) {
// //             vertices.push( MathUtils.randFloatSpread( 2000 ) ); // x
// //             vertices.push( MathUtils.randFloatSpread( 2000 ) ); // y
// //             vertices.push( MathUtils.randFloatSpread( 2000 ) ); // z
// //         }

// //         geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );


// //         this.listener.position.setY(80)

// //         this.lightHelper.attach(new PositionalAudio(this.listener))
// //     }

// //     private _setupLight = (helperEnabled: boolean) => {
// //         this.light = new PointLight()
// //         this.light.position.set(200, 100, 150)
// //         this.scene.add(this.light)
        
// //         if (helperEnabled) {
// //             this.lightHelper = new PointLightHelper(this.light, 15)
// //             this.scene.add(this.lightHelper)
// //         }
// //     }

// //     private onWindowResize = () => {
// //         this.camera.aspect = window.innerWidth/window.innerHeight;
// //         this.camera.updateProjectionMatrix()
// //         this.renderer.setSize(window.innerWidth, window.innerHeight)

// //         this.cameraPerspective.aspect = 0.5 * (window.innerWidth/window.innerHeight);
// //         this.cameraPerspective.updateProjectionMatrix();
// //     }

// //     private initLoader = () => {
// //         // const volume = new Volume(100, 100, 100)
// //         // const geometry = new BoxGeometry(volume.xLength, volume.yLength, volume.zLength)
// //         // const material = new MeshBasicMaterial({ color: 0x00ff00 })
// //         // const cube = new Mesh(geometry, material)
// //         // cube.visible = false

// //         // const box = new BoxHelper(cube)
// //         // this.scene.add(box)
// //         // // @ts-ignore
// //         // box.applyMatrix4(geometry.p)
// //     }


// //     private animate = () => {
// //         // console.log("Animating")
// //         requestAnimationFrame(this.animate)
        

// //         const time = performance.now() * 0.0003
// //         this.camera.position.x = 700 * Math.cos(time)
// //         this.camera.position.y = 50 * Math.sin(time)
// //         this.camera.position.z = 700 * Math.sin(time)
// //         this.camera.lookAt(this.scene.position)

// //         this.light.position.x = Math.sin( time * 1.7 ) * 300;
// //         this.light.position.y = Math.cos( time * 1.5 ) * 400;
// //         this.light.position.z = Math.cos( time * 1.3 ) * 300;

// //         this.listener.position.x = Math.sin( time * 1.7 ) * 150;
// //         this.listener.position.y = Math.cos( time * 1.5 ) * 200;
// //         this.listener.position.z = Math.cos( time * 1.3 ) * 150;

// //         console.log(this.listener)

// //         // this.listener.children[0].lookAt(0)
// //         this.listener.children[0].rotateY(Math.sin(time * 1.5) * 2000)
// //         // this.listener.children[0].position.z = Math.sin(time * 1.3) * 150;


// //         if (this.vnh) this.vnh.update()
// //         if (this.vth) this.vth.update()


// //         this.cameraPerspective.fov = 35 + 30 * Math.sin( 0.5 * r );
// //         this.cameraPerspective.far = this.perspectiveMesh.position.length();
// //         this.cameraPerspective.updateProjectionMatrix()

// //         this.cameraPerspectiveHelper.update()
// //         this.cameraPerspectiveHelper.visible = true;


// //         this.cameraRig.lookAt(this.perspectiveMesh.position)
// //         this.renderer.clear()

// //         this.renderer.render(this.scene, this.camera)
// //     }

// // }




// // // // import { Controller } from "../controller/Controller";

// // // import { AmbientLight, BaseEvent, BoxGeometry, Color, DirectionalLight, Event, GridHelper, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, PerspectiveCamera, PlaneGeometry, Raycaster, Scene, Vector, Vector2, WebGLRenderer } from "three";

// // // export class Dax {
// // //     objects: any[] = [];
// // //     camera: PerspectiveCamera
// // //     scene: Scene
// // //     renderer: WebGLRenderer
// // //     plane: Mesh<PlaneGeometry, MeshBasicMaterial>
// // //     pointer: Vector2
// // //     raycaster: Raycaster
// // //     isShiftDown = false
// // //     rollOverMesh: Mesh<BoxGeometry, any>
// // //     rollOverMaterial: MeshBasicMaterial
// // //     cubeGeo: BoxGeometry
// // //     cubeMaterial: MeshBasicMaterial
// // //     // camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000)
// // //     // scene = new Scene()

// // //     // // roll-over helpers
// // //     // rollOverGeo = new BoxGeometry(50, 50, 50)
// // //     // rollOverMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })

// // //     // // cubes
// // //     // cubeGeo = new BoxGeometry(50, 50, 50)
// // //     // cubeMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })


// // //     // //
// // //     // raycaster = new Raycaster()
// // //     // pointer = new Vector2()

// // //     // geometry =  new PlaneGeometry(1000, 1000)

// // //     // plane: Object3D<Event> | Mesh<PlaneGeometry, MeshBasicMaterial>;
// // //     // isShiftDown = false
    

// // //     // // lights
// // //     // ambientLight = new AmbientLight(0x606060)
// // //     // directionalLight = new DirectionalLight(0xffffff)

// // //     // renderer = new WebGLRenderer({ antialias: true })

// // //     constructor() {
// // //         this.init()
// // //         this.render()
    
// // //     }

// // //     private init = () => {
// // //         this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000 )
// // //         this.camera.position.set(500, 800, 1300)
// // //         this.camera.lookAt(0, 0, 0)

// // //         this.scene = new Scene()
// // //         this.scene.background = new Color(0xf0f0f0)

// // //         const rollOverGeo = new BoxGeometry(50, 50, 50)
// // //         this.rollOverMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
// // //         this.rollOverMesh = new Mesh(rollOverGeo, this.rollOverMaterial)
// // //         this.scene.add(this.rollOverMesh)

// // //         this.cubeGeo = new BoxGeometry(50, 50, 50)
// // //         this.cubeMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: false })

// // //         const gridHelper = new GridHelper(1000, 20)
// // //         this.scene.add(gridHelper)

// // //         this.raycaster = new Raycaster()
// // //         this.pointer = new Vector2()

// // //         const geometry = new PlaneGeometry(1000, 1000)
// // //         geometry.rotateX( - Math.PI / 2 );

// // //         this.plane = new Mesh( geometry, new MeshBasicMaterial({ visible: false }))
// // //         this.scene.add(this.plane)

// // //         this.objects.push(this.plane)

// // //         const ambientLight = new AmbientLight(0x606060)
// // //         this.scene.add(ambientLight)

// // //         const directionalLight = new DirectionalLight(0xffffff)
// // //         directionalLight.position.set(1, 0.75, 0.5).normalize()
// // //         this.scene.add(directionalLight)

// // //         this.renderer = new WebGLRenderer({ antialias: true })
// // //         this.renderer.setPixelRatio(window.devicePixelRatio)
// // //         this.renderer.setSize(window.innerWidth, window.innerHeight)
// // //         document.body.appendChild(this.renderer.domElement)

// // //         document.addEventListener( 'pointermove', this.onPointerMove )
// // //         document.addEventListener( 'pointerdown', this.onPointerDown )
// // //         document.addEventListener( 'keydown', this.onDocumentKeyDown )
// // //         document.addEventListener( 'keyup', this.onDocumentKeyUp )
// // //         window.addEventListener( 'resize', this.onWindowResize )

// // //     }

// // //     private initCamera() {
// // //         this.camera.position.set(500, 800, 1300)
// // //         this.camera.lookAt(0, 0, 0)
// // //     }

// // //     // private initScene() {
// // //     //     this.scene.background = new Color(0xf0f0f0)
// // //     //     this.scene.add(this.rollOverMesh)
// // //     //     this.scene.add(this.gridHelper)

// // //     //     this.geometry.rotateX(-Math.PI/2)
// // //     //     this.scene.add(this.plane)

// // //     //     this.objects.push(this.plane)

// // //     //     this.scene.add(this.ambientLight)

// // //     //     this.directionalLight.position.set(1, 0.75, 0.5).normalize()
// // //     //     this.scene.add(this.directionalLight)

// // //     // }

// // //     private initRenderer() {
// // //         this.renderer.setPixelRatio(window.devicePixelRatio)
// // //         this.renderer.setSize(window.innerWidth, window.innerHeight)

// // //         document.body.appendChild(this.renderer.domElement)
// // //         document.addEventListener('pointermove', this.onPointerMove)
// // //         document.addEventListener('pointerdown', this.onPointerDown)
// // //         document.addEventListener('keydown', this.onDocumentKeyDown)
// // //         document.addEventListener('keyup', this.onDocumentKeyUp)

// // //         window.addEventListener('resize', this.onWindowResize)
// // //     }

// // //     private render = () => this.renderer.render(this.scene, this.camera)
    

// // //     private onPointerMove = (e: PointerEvent) => {
// // //         // figure out what this does
// // //         this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight ) * 2 + 1 )

// // //         this.raycaster.setFromCamera(this.pointer, this.camera)

// // //         const intersects = this.raycaster.intersectObjects(this.objects, false)
// // //         if (intersects.length > 0) {

// // //             const intersect = intersects[0]
// // //             this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
// // //             this.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)

// // //             this.render()
// // //         }
// // //     }

// // //     private onPointerDown = (e: PointerEvent) => {
// // //         this.pointer.set( (e.clientX / window.innerWidth ) * 2 - 1, - (e.clientY / window.innerHeight ) * 2 + 1)
// // //         this.raycaster.setFromCamera(this.pointer, this.camera)

// // //         const intersects = this.raycaster.intersectObjects(this.objects, false );

// // //         if ( intersects.length > 0 ) {

// // //             const intersect = intersects[ 0 ];

// // //             // delete cube
// // //             if (this.isShiftDown) {
// // //                 if (intersect.object !== this.plane) {
// // //                     this.scene.remove(intersect.object)
// // //                     this.objects.splice(this.objects.indexOf(intersect.object), 1)

// // //                 }

// // //                 // create cube

// // //             } else {
// // //                 const voxel = new Mesh(this.cubeGeo, this.cubeMaterial)
// // //                 voxel.position.copy( intersect.point ).add(intersect.face.normal)
// // //                 voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
// // //                 this.scene.add(voxel)

// // //                 this.objects.push(voxel);
// // //             }

// // //             this.render();

// // //         }

// // //     }

// // //     // update this
// // //     private onDocumentKeyDown = (e: KeyboardEvent) => {
// // //         switch(e.keyCode) {
// // //             case 16: this.isShiftDown =  true; break;
// // //         }
// // //     }
// // //     private onDocumentKeyUp = (e: KeyboardEvent) => {
// // //         switch(e.keyCode) {
// // //             case 16: this.isShiftDown = false; break;
// // //         }
// // //     }

// // //     private onWindowResize = () => {
// // //         this.camera.aspect = window.innerWidth/window.innerHeight
// // //         this.camera.updateProjectionMatrix()

// // //         this.renderer.setSize(window.innerWidth, window.innerHeight)
// // //         this.render()
// // //     }

 
// // // }