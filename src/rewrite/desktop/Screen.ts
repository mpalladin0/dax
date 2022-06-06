import { WebGLRenderer } from "three";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

export class Screen {
    public readonly renderer: WebGLRenderer
    public readonly scene: THREE.Scene
    public readonly gridHelper: THREE.GridHelper
    private readonly light: THREE.DirectionalLight
    private readonly cameraPersp: THREE.PerspectiveCamera;
    private readonly cameraOrtho: THREE.OrthographicCamera;
    public readonly currentCamera: THREE.PerspectiveCamera
    public orbit: OrbitControls;
    private raycaster: THREE.Raycaster;
    // public readonly phonePosition: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    public get aspectRatio() { return window.innerWidth/window.innerHeight }
    private set aspectRatio(e) { this.aspectRatio }

    private mouse = { x: 0, y: 0 }

    constructor(xr: boolean = false) {
        console.log("Building screen..")

        if (!xr) {
            const aspect = window.innerWidth/window.innerHeight
            /** Renderer */
            this.renderer = new THREE.WebGLRenderer()
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            document.body.appendChild(this.renderer.domElement)

            /** Scene */
            this.scene = new THREE.Scene()
            this.gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0x444444)
            this.scene.add(this.gridHelper)

            /** Light for Scene */
            this.light = new THREE.DirectionalLight(0xffffff, 2)
            this.light.position.set(1, 1, 1)
            this.scene.add(this.light)

            /** Perspective Camera */
            this.cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000)
            

            /** Othorg Camera */
            // this.cameraOrtho = new THREE.OrthographicCamera(-600 * this.aspect, 600 * this.aspect, 600, -600, 0.01, 30000)
            this.cameraOrtho = new THREE.OrthographicCamera()

            /** Current Camera */
            this.currentCamera = this.cameraPersp
            this.currentCamera.position.set(0, 1, 2.5)
            this.currentCamera.lookAt(0, 0, 0)

            /** Orbit */
            this.orbit = new OrbitControls(this.currentCamera, this.renderer.domElement)

            this.orbit.update()
            this.orbit.addEventListener('change', this.render)

            window.addEventListener('resize', this.onWindowResize)

            this.renderer.setAnimationLoop(this.render)
        }

        if (xr) {
            /** XR Renderer */
            this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
            this.renderer.setSize(innerWidth, innerHeight);
            this.renderer.setPixelRatio(devicePixelRatio);            
            this.renderer.xr.enabled = true;

        
            document.body.appendChild(this.renderer.domElement)
        
            /** Start AR Button */
            document.body.appendChild(
                ARButton.createButton(this.renderer, { requiredFeatures: ["hit-test"] })
            )

            this.scene = new THREE.Scene()

            /** Camera */
            this.currentCamera = new THREE.PerspectiveCamera(
                70,
                window.innerWidth / window.innerHeight,
                0.02,
                20,
              )

            // /** Replace later with CURRENT Sounds */
            // const boxGeometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
            // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            // this.phonePosition = new THREE.Mesh(boxGeometry, boxMaterial);
            // this.phonePosition.position.z = -3;

            // this.scene.add(this.phonePosition)

            
        }        

    }

    private onWindowResize = () => {
        this.aspectRatio = window.innerWidth/window.innerHeight

        this.cameraPersp.aspect = this.aspectRatio;
        this.cameraPersp.updateProjectionMatrix();

        this.cameraOrtho.left = this.cameraOrtho.bottom * this.aspectRatio;
        this.cameraOrtho.right = this.cameraOrtho.top * this.aspectRatio;
        this.cameraOrtho.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.render()
    } 


    public render = () => {
        this.renderer.render(this.scene, this.currentCamera)
    }

    public add = (mesh: THREE.Object3D<any>) => {
        this.scene.add(mesh)
    }

    public remove = (mesh: THREE.Object3D<any>) => {
        this.scene.remove(mesh)
    }
}
