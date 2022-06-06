import * as THREE from 'three'
import { Connection } from "../../../dax/Connection";
import { Desktop } from "../../desktop/Desktop";
import { Phone } from "../../phone/Phone";
import { Sound } from "./Sound";

export class Controller {
    public readonly sounds: Map<string, Sound> = new Map()
    public readonly connection: Connection;

    private readonly phone: Phone
    private readonly desktop: Desktop

    private selectedSound: Sound

    private readonly clock = new THREE.Clock()

    constructor(connection: Connection) {
        this.connection = connection

        if (this.connection.isDesktop) this.desktop = new Desktop(connection)
        if (this.connection.isMobile) this.phone = new Phone(connection)

        this.connection.socket.on("move sound from phone", (name: string, x: number, y: number, z: number) => this.moveSoundFromPhone)
        this.connection.socket.on("move sound from desktop", (name: string, x: number, y: number, z: number) => this.moveSoundFromDesktop)

        this.connection.socket.on("sound selected from phone", (name: string) => this.selectedSound = this.sounds.get(name))
        this.connection.socket.on("sound selected from desktop", (name: string) => this.selectedSound = this.sounds.get(name))

    }

    public readonly addSound = (name: string, url: string) => {
        /**
         * Adding a sound from Desktop needs to inform the Phone that the sound as been added
         */
        if (this.connection.isDesktop) {
            this.connection.socket.emit("add sound", name)
            const sound = this.desktop.addSound(name, url)
            this.sounds.set(name, sound)
        }

        if (this.connection.isMobile) {
            const sound = this.phone.addSound(name, url)
            this.sounds.set(name, sound)
        }

    }

    public readonly moveSoundFromPhone = (x: number, y: number, z: number) => {
        if (!this.connection.isMobile) throw new Error("Cannot move sound from this device")
        this.desktop.moveSound(x, y, z)
    }

    public readonly moveSoundFromDesktop = (x: number, y: number, z: number) => {
        if (!this.connection.isDesktop) throw new Error("Cannot move sound from this device") 
        this.phone.moveSound(x, y, z)
    }

    private checkOrExpireSelectedSound() {
        if (this.clock.elapsedTime > 5) {
        }
    }
}