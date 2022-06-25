import * as THREE from 'three'
import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, WebXRManager, XRSession } from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { Connection } from '../cleanup/Connection'
import { createXrScene } from './createXrScene'

export class XRSpace {
    session: any = null
    engine: any = null
    inputSource: any = null
    isSelecting = false

    // We can save the eyeLevel FOR because in this implementation
    // it doesn't have state (the head-model FOR does, and shouldn't be cached,
    // which should be fixed)

    // tmp working matrix
    workingMatrix = new THREE.Matrix4()
    workingVec3 = new THREE.Vector3()
    goButton: HTMLButtonElement

    // @ts-ignore
    XR = navigator.xr
    XRSession: globalThis.XRSession
    viewer: XRViewerPose
    canvas: HTMLCanvasElement
    canvasContext: WebGLRenderingContext

    /** Debug */
    localReferenceSpace: XRReferenceSpace | XRBoundedReferenceSpace
    viewerReferenceSpace: XRReferenceSpace | XRBoundedReferenceSpace
    renderer: THREE.WebGLRenderer
    controller: THREE.Group
    connection: Connection
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera


    constructor(connection: Connection) {
        const { devicePixelRatio, innerHeight, innerWidth } = window;
  
        // Create a new WebGL renderer and set the size + pixel ratio.
        const renderer = new WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(devicePixelRatio);
        
        // Enable XR functionality on the renderer.
        renderer.xr.enabled = true;
      
        // Add it to the DOM.
        document.body.appendChild( renderer.domElement );
      
        // Create the AR button element, configure our XR session, and append it to the DOM.
        document.body.appendChild(ARButton.createButton(
          renderer,
          { requiredFeatures: ["hit-test"] },
        ));


        createXrScene(renderer, connection)

    }
}