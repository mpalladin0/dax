import { Renderer, Scene } from "three";

export class DaxListener {
    scene: Scene;
    renderer: Renderer;

    constructor(scene: Scene, renderer: Renderer) {
        this.scene = scene
        this.renderer = renderer
    }

}