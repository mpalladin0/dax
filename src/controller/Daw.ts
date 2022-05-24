import { BoxGeometry, Camera, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from "three"

export class Daw {
    public startSound = () => {}
    public stopSound = () => {}
    public startOrbit = () => {}

    private scene = new Scene()
    private perspectiveCamera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    private renderer = new WebGLRenderer()

    private geometry = new BoxGeometry()
    private material = new MeshBasicMaterial({ color: 0x00ff00 })
    private cube = new Mesh(this.geometry, this.material)

    private sphereGeometry = new SphereGeometry(1, 8, 6, 0, Math.PI * 2, 0, Math.PI);
    private sphereMaterial = new MeshBasicMaterial({ color: 0xffff00 })
    private sphere = new Mesh(this.sphereGeometry, this.sphereMaterial)

    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.scene.add(this.sphere)

        this.perspectiveCamera.position.z = 5;

        this.animate()

    }
    

    private animate = () => {
        this.sphere.rotation.x += 0.01;
        this.sphere.rotation.y += 0.01;

        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.perspectiveCamera)
    }

}