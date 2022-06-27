import { WebGLRenderer } from "three";

export class DaxSpace {
    public readonly renderer: WebGLRenderer
    
    constructor() {
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.xr.enabled = true
    }
}