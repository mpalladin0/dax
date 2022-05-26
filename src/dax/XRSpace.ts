import { Socket } from 'socket.io-client'
import * as THREE from 'three'
import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, WebXRManager, XRSession } from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { Controller } from '../controller/Controller'
import { createScene } from './XRScene'

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
    masterController: Controller
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera


    constructor(masterController: Controller) {
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


        createScene(renderer, masterController)


    }

    private onSelect = () => {
        this.masterController.socket.emit("screen tap")

    }

    private initXR = () => {  
        const XRSession = this.renderer.xr.getSession()
        // XRSession.renderSta

        const supported = document.createElement("h1")
        supported.innerText = "XR (IAR) Supported"
        document.body.appendChild(supported)

        
        if (XRSession) {
            // XRSession.req
            // this.XR.requestSession("immersive-ar", {
            //     requiredFeatures: ['hit-test']
            // }).then((xrSession) => {
            //     this.XRSession = xrSession


            //     this.goButton.addEventListener('click', this.onGoButtonClick)
            //     this.goButton.innerText = "End Session"
            //     document.body.appendChild(this.goButton)

                const supported = document.createElement("h1")
                supported.innerText = "XR (IAR) Supported"
                document.body.appendChild(supported)

            //     this.initSession()

            //     this.XRSession.requestReferenceSpace("local").then((xrReferenceSpace) => {
            //         this.XRSession.requestAnimationFrame((time, xrFrame) => {
            //             this.viewer = xrFrame.getViewerPose(xrReferenceSpace);
                
            //             // @ts-ignore
            //             gl.bindFramebuffer(xrWebGLLayer.framebuffer);
            //             // @ts-ignore
            //             for (xrView of viewer.views) {
            //                 // @ts-ignore
            //                 let xrViewport = xrWebGLLayer.getViewport(xrView);
            //                 // @ts-ignore
            //                 gl.viewport(xrViewport.x, xrViewport.y, xrViewport.width, xrViewport.height);
            //             }
            //         });
            //     });
            // });
        } else { /* WebXR is not available */ }
    }

    // private initSession = async () => {
    //     this.localReferenceSpace = await this.XRSession.requestReferenceSpace('local')
    //     this.viewerReferenceSpace = await this.XRSession.requestReferenceSpace('viewer')
    //     /**
    //      * Get location of the device, and use it to create an anchor with the identity orientation
    //      */

    //     if (this.XRSession) {
    //         this.matrixDisplay.innerText = "WORKING"
    //     }
    //     this.XRSession.requestAnimationFrame((t, frame) => {

    //         // this.workingMatrix.compose(this.workingMatrix.clone(), )
    //     })
    // }

    // private onGoButtonClick = (e: any) => {
    //     if (this.XRSession) {
    //         this.XRSession.end()
    //         document.body.removeChild(this.goButton)
    //     }
    // }
}