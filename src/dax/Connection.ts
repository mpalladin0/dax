import { io, Socket } from "socket.io-client";
import { EventDispatcher } from "three";

interface ServerToClientEvents {
  any: any;
}

interface ClientToServerEvents {
  any: any;
}

/**
 * Handles/establishes all socket connections and interactions between the phone and esktop
 */
export class Connection extends EventDispatcher {
  public socket:
    | Socket<ServerToClientEvents | any, ClientToServerEvents | any>
    | undefined;
  private deviceType: Mobile | Desktop;

  constructor(url: string) {
    super();

    console.log("Connecting...");
    this.socket = io(url);

    this.socket.on("connect", () => {
      if (this.isMobile) this.onMobileConnection();
      else this.onDesktopConnection();
    });
  }

  public requestDeviceMotion(): void {}

  public requestDeviceOrientation() {
    console.log(
      "[Controller] Requesting permission for device orientation data."
    );
    // @ts-ignore
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        // @ts-ignore
        DeviceOrientationEvent.requestPermission()
          .then((permissionState: string) => {
            if (permissionState === "granted") {
              console.log("[Controller] Permission granted: orientation data.");

              window.addEventListener("deviceorientation", (e) => {
                const alpha = e.alpha;
                const beta = e.beta;
                const gamma = e.gamma;

                const orientationPayload = {
                  alpha,
                  beta,
                  gamma,
                };

                this.dispatchEvent({
                  type: "orientationData",
                  orientationPayload,
                });

                // See https://www.w3.org/2008/geolocation/wiki/images/e/e0/Device_Orientation_%27alpha%27_Calibration-_Implementation_Status_and_Challenges.pdf

                // @ts-ignore
                // const initialOffset = e.webkitCompassHeading

                // this.alphaStatus.innerText = `Alpha: ${alpha}`
                // this.betaStatus.innerText = `Beta: ${beta}`
                // this.gammaStatus.innerText = `Gamma: ${gamma}`

                // this.socket.emit("device orientation data", alpha, beta, gamma)
              });
            } else {
              throw new Error(permissionState);
            }
          })
          .catch((err: any) => console.error(err));
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  private onMobileConnection() {
    this.deviceType = "Mobile";

    this.socket.emit("mobile connection");
    console.log("Mobile connection established.");
  }
  private onDesktopConnection() {
    this.deviceType = "Desktop";

    this.socket.emit("desktop connection");
    console.log("Desktop connection established");
  }

  public sendMobile(event: MobileToServer) {
    if (!this.isMobile)
      throw new Error(`Cannot send a mobile command as ${this.deviceType}`);
  }

  public sendDesktop(event: DesktopToServer) {
    if (!this.isDesktop)
      throw new Error(`Cannot send a desktop command as ${this.deviceType}`);
  }

  public get isMobile() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else return false;
  }

  public get isDesktop() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return false;
    } else return true;
  }
}

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

type Mobile = "Mobile";
type Desktop = "Desktop";

interface DeviceMotionData {
  x: number;
  y: number;
  z: number;
  alpha: number;
  beta: number;
  gamma: number;
}

interface DeviceOrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

interface MobileToServer {
  DeviceMotionData: DeviceMotionData;
  DeviceOrientationData: DeviceOrientationData;
}

interface ServerToMobile {}

interface DesktopToServer {}
interface ServerToDesktop {}

interface SendEvent {
  MobileToServer: MobileToServer;
  DesktopToServer: DesktopToServer;
}
