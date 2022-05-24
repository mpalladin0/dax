import { PerspectiveCamera, Scene } from "three";

/**
 * Create a Scene and Grid for a Phone Controller
 */
export class Phone {
    camera = new PerspectiveCamera(35, window.innerWidth/window.innerHeight, 1, 1000)
    
    constructor(scene: Scene) {
        scene.add(this.camera)
        
    }
}