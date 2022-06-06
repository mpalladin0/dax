import { ControllerError } from "./ControllerError";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
    any: any
}
  
interface ClientToServerEvents {
    any: any
}
  
interface InterServerEvents {
    ping: () => void;
}
  
interface SocketData {
    name: string;
    age: number;
}

const TAG = '[Controller] '


export class Controller {
    public deviceMotionData: DeviceMotionEvent
    public deviceOrientationData: DeviceOrientationEvent
    private deviceMotionPermission: boolean = false
    private deviceOrientationPermission: boolean = false

    public liveHeader = document.createElement("h2")
    public alphaStatus = document.createElement("p")
    public betaStatus = document.createElement("p")
    public gammaStatus = document.createElement("p")

    public processedHeader = document.createElement("h2")
    public post_alphaStatus = document.createElement("p")
    public post_betaStatus = document.createElement("p")
    public post_gammaStatus = document.createElement("p")

    public socket: Socket<ServerToClientEvents | any, ClientToServerEvents | any> | undefined;

    constructor(DAX_ENPOINT: string) {
        if (this.isMobileDevice) {
            this.liveHeader.innerText = "Live: "
            this.alphaStatus.innerText = "Alpha: -"
            this.betaStatus.innerText = "Beta: -"
            this.gammaStatus.innerText = "Gamma: -"
            document.body.appendChild(this.liveHeader)
            document.body.appendChild(this.alphaStatus)
            document.body.appendChild(this.betaStatus)
            document.body.appendChild(this.gammaStatus)
    
            // this.processedHeader.innerText = "Post: "
            document.body.appendChild(this.processedHeader)
            document.body.appendChild(this.post_alphaStatus)
            document.body.appendChild(this.post_betaStatus)
            document.body.appendChild(this.post_gammaStatus)
        } else {
            // this.processedHeader.innerText = "Post: "
            document.body.appendChild(this.processedHeader)
            document.body.appendChild(this.post_alphaStatus)
            document.body.appendChild(this.post_betaStatus)
            document.body.appendChild(this.post_gammaStatus)
        }


        this.socket = io(DAX_ENPOINT)

        this.socket.on("connect", () => {
            if (this.isMobileDevice) {
                this.socket.emit("mobile connection")
            } else {
                this.socket.emit("desktop connection")
            }
            // this.socket.emit("")
        })

        this.socket.on("device-orientation-data-frame", (orientation: any) => {
            this.post_alphaStatus.innerText = `\t(around Z) [0, 360] Alpha: ${orientation[0]}`
            this.post_betaStatus.innerText = ` \t(around X) [-180, 180] Beta: ${orientation[1]}`
            this.post_gammaStatus.innerText = ` \t(around Y) [-90, 90] Gamma: ${orientation[2]}`
        })
    }

    public requestPermissionForDeviceMotonData(): void {
        console.log("[Controller] Requesting permission for device motion data.")
        // @ts-ignore
        if (typeof DeviceMotionEvent.requestPermission  === 'function') {
                // @ts-ignore
                DeviceMotionEvent.requestPermission()
                    .then((permissionState: string) => {
                        if (permissionState == 'granted') {
                            this.deviceMotionPermission = true;
                            console.log("[Controller] Permission granted: motion data")

                            window.addEventListener('devicemotion', (e) => {
                                this.deviceMotionData = e;
                                this.socket.emit("device motion data", e.acceleration, e.rotationRate)
                                
                            })
                        } else {
                            throw new Error(permissionState);
                        }
                    })
                    .catch((err: any) => console.error(err))
        }

    }

    public requestPermissionForDeviceOrientationData() {
        console.log("[Controller] Requesting permission for device orientation data.")
        // @ts-ignore
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                // @ts-ignore
                DeviceOrientationEvent.requestPermission()
                    .then((permissionState: string) => {
                        if (permissionState === 'granted') {
                            this.deviceOrientationPermission = true;
                            console.log("[Controller] Permission granted: orientation data.")

                            window.addEventListener('deviceorientation', (e) => {
                                this.deviceOrientationData = e;

                                // See https://www.w3.org/2008/geolocation/wiki/images/e/e0/Device_Orientation_%27alpha%27_Calibration-_Implementation_Status_and_Challenges.pdf
                                
                                // @ts-ignore
                                const initialOffset = e.webkitCompassHeading

                                let alpha = e.alpha
                                const beta = e.beta
                                const gamma = e.gamma

                                this.alphaStatus.innerText = `Alpha: ${alpha}`
                                this.betaStatus.innerText = `Beta: ${beta}`
                                this.gammaStatus.innerText = `Gamma: ${gamma}`
                                

                                this.socket.emit("device orientation data", alpha, beta, gamma)
                            })
                        } else {
                            throw new Error(permissionState);
                        }
                    })
                    .catch((err: any) => console.error(err))
            } catch (err) {
                throw new Error(err)
            }
        }
        
    }

    private getMotionData = () => {
        if (!this.deviceMotionPermission) this.requestPermissionForDeviceMotonData()
        return this.deviceMotionData
    }
    private getOrientationData = () => {
        if (this.deviceOrientationPermission) this.requestPermissionForDeviceMotonData()
        return this.deviceOrientationData
    }


    // public startCapture = () => {
    //     this.socket.emit("device motion", this.deviceMotionData)
    // }

    // // public async connectToDax(): Promise<void> {
    // //     console.log("[Controller] Connecting to DAX")
    // //     if (!this.socket.connected) try { 
    // //         this.socket.connect() 
    // //         console.log("[Controller] Connected to Server.")
    // //     } catch (err) { throw new ControllerError(err) } 

    // //     if (this.isMobileDevice()) {
    // //         console.log("[Controller] Connecting Mobile controller to DAX")
    // //         this.socket.emit("mobile connection")
    // //     } else {
    // //         console.log("[Controller] Connecting Desktop controller to DAX")
    // //         this.socket.emit("desktop connection")
    // //     }

    // //     this.addToParingPool();

    // // }

    // public async disconnectFromDax(): Promise<void> {
    //     // if (!this.connectedToDax) return true
    //     // else this.socket.disconnect()
    // }

    // private async addToParingPool() {
    //     if (this.isMobileDevice()) {
    //         console.log("[Controller] Adding MOBILE_CONTROLLER to pairing pool")
    //         this.socket.emit("add MOBILE_CONTROLLER to pairing pool")
    //     } else {
    //         console.log("[Controller] Adding DESKTOP_CONTROLLER to pairing pool")
    //         this.socket.emit("add DESKTOP_CONTROLLER to pairing pool")

    //     }

    // }
    // public async pair() {
    //     if (this.available_desktops.size === 0) return new Error("No available desktops to pair with")
        
    //     for (let desktop in this.available_desktops) {
    //         this.socket.emit("PAIR MOBILE_CONTROLLER WITH", desktop)
    //     }

    //     this.socket.on("Succesfully paired MOBILE_CONTROLLER to DESKTOP_CONTROLLER", (desktopId: string, mobileId: string) => {
    //         console.log(`[Controller] MOBILE_CONTROLLER ${mobileId} paired to ${desktopId}`)
    //     })

    // }
    // public async unpair() {}

    get isMobileDevice() {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else return false;
    }

}

