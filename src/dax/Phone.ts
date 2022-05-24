import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export class Phone {
    scene: THREE.Scene
    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
    control: TransformControls;
    renderer;
    currentCamera;

    constructor(scene: THREE.Scene, mesh: THREE.Mesh, control: TransformControls, renderer: THREE.WebGLRenderer, currentCamera: THREE.PerspectiveCamera) {
        this.scene = scene
        this.mesh = mesh
        this.control = control

        /** Add scene to mesh */
        this.scene.add(this.mesh)

        /** Connect Controls to Mesh and Scene */
        this.control.attach(this.mesh)
        this.scene.add(this.control)

        /** Renderer and Camera */
        this.renderer = renderer
        this.currentCamera = currentCamera

        /** Control Event Listeners */
        // this.control.addEventListener('change', this.render)
    }

    // public render = () => {
    //     console.log("Running render...")
    //     this.renderer.render(this.scene, this.currentCamera)
    // }

}