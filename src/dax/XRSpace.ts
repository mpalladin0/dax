import * as THREE from 'three'
import { WebXRManager, XRSession } from 'three'

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
    matrixDisplay
    localReferenceSpace: XRReferenceSpace | XRBoundedReferenceSpace
    viewerReferenceSpace: XRReferenceSpace | XRBoundedReferenceSpace


    constructor() {
        /** Create 'Go' Button */
        this.goButton = document.createElement("button")

        /** Debug matrix and vector */
        this.matrixDisplay = document.createElement("h3")
        this.matrixDisplay.innerText = "[Matrix Loading]"
        document.body.appendChild(this.matrixDisplay)


        this.initXR()


    }

    private initXR = () => {        
        if (this.XR) {
            this.XR.requestSession("immersive-ar", {
                requiredFeatures: ['hit-test']
            }).then((xrSession) => {
                this.XRSession = xrSession

                this.goButton.addEventListener('click', this.onGoButtonClick)
                this.goButton.innerText = "End Session"
                document.body.appendChild(this.goButton)

                const supported = document.createElement("h1")
                supported.innerText = "XR (IAR) Supported"
                document.body.appendChild(supported)

                this.initSession()

                // this.XRSession.requestReferenceSpace("local").then((xrReferenceSpace) => {
                //     this.XRSession.requestAnimationFrame((time, xrFrame) => {
                //         this.viewer = xrFrame.getViewerPose(xrReferenceSpace);
                
                //         // @ts-ignore
                //         gl.bindFramebuffer(xrWebGLLayer.framebuffer);
                //         // @ts-ignore
                //         for (xrView of viewer.views) {
                //             // @ts-ignore
                //             let xrViewport = xrWebGLLayer.getViewport(xrView);
                //             // @ts-ignore
                //             gl.viewport(xrViewport.x, xrViewport.y, xrViewport.width, xrViewport.height);
                //         }
                //     });
                // });
            });
        } else { /* WebXR is not available */ }
    }

    private initSession = async () => {
        this.localReferenceSpace = await this.XRSession.requestReferenceSpace('local')
        this.viewerReferenceSpace = await this.XRSession.requestReferenceSpace('viewer')
        /**
         * Get location of the device, and use it to create an anchor with the identity orientation
         */

        if (this.XRSession) {
            this.matrixDisplay.innerText = "wORKING"
        }
        this.XRSession.requestAnimationFrame((t, frame) => {

            // this.workingMatrix.compose(this.workingMatrix.clone(), )
        })
    }

    private onGoButtonClick = (e: any) => {
        if (this.XRSession) {
            this.XRSession.end()
            document.body.removeChild(this.goButton)
        }
    }
}