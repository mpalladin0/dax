import { Connection } from "../Connection";
import { createSound } from "./createSound";

/**
 * Creates everythign associated with Dax Client Desktop
 * @param connection 
 */
export function createDesktop(connection: Connection) {
    const diplay = {}
    const sound = createSound()

    connection.socket.on("move sound from phone", (x: number, y: number, z: number) => {
        sound.move(x, y, z)
    })

    function addSound(name: string, url: string) {

    }


    return {
        addSound
    }
}