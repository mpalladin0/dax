import { io, Socket } from 'socket.io-client';
import { EventDispatcher } from 'three';

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
	public socket: Socket<ServerToClientEvents | any, ClientToServerEvents | any> | undefined;
	// private deviceType: Mobile | Desktop

	constructor(url: string) {
		super();

		console.log('Connecting...');
		this.socket = io(url);

		this.socket.on('connect', () => {
			if (this.isMobile) this.onMobileConnection();
			else this.onDesktopConnection();
		});
	}

	private onMobileConnection() {
		// this.deviceType = 'Mobile'

		this.socket.emit('mobile connection');
		console.log('Mobile connection established.');
	}
	private onDesktopConnection() {
		// this.deviceType = 'Desktop'

		this.socket.emit('desktop connection');
		console.log('Desktop connection established');
	}

	public get isMobile() {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		) {
			return true;
		} else return false;
	}

	public get isDesktop() {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		) {
			return false;
		} else return true;
	}
}

type Mutable<T> = {
	-readonly [k in keyof T]: T[k];
};

type Mobile = 'Mobile';
type Desktop = 'Desktop';

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
