import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'layer-3d',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit {
  private camera: THREE.OrthographicCamera;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  /* PROPERTIES */
  @Input()
  public size:number = 100;

  @Input()
  public cameraZ:number = 400;
  @Input()
  public fieldOfView:number = 50;
  @Input('nearClipping')
  public nearClippingPane:number = 1;
  @Input('farClipping')
  public farClippingPane:number = 1000;

  @Input('scaleX')
  public scaleX:number = 1;
  @Input('scaleY')
  public scaleY:number = 1;

  @Input('rotationY')
  public rotationY:number = 0;
  @Input('rotationZ')
  public rotationZ:number = 0;
  @Input('rotationX')
  public rotationX:number = 0;

  @Input('eyeLeft')
  public eyeLeft:any;
  @Input('eyeRight')
  public eyeRight:any;

  @Input('posx')
  public posx:number = 0;
  @Input('posy')
  public posy:number = 0;

  constructor() { }

  /* STAGING, ANIMATION, AND RENDERING */

  private animate() {
    this.scene.scale.set(this.scaleX, this.scaleY, this.scaleX);
    this.scene.position.x = ( (this.posx-(this.canvas.clientWidth/2) )*-1 );
    this.scene.position.y = ( (this.posy-(this.canvas.clientHeight/2) )*-1);
    this.scene.rotation.y = this.rotationY / 50;
    this.scene.rotation.z = this.rotationZ / 100*-1;
    this.scene.rotation.x = this.rotationX / 50*-1;
  }

  private create() {
    //Scena
    let scena = new THREE.Scene();
    //Cube for Debug
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    let geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);
    let cube = new THREE.Mesh(geometry, material);
    scena.add(cube);//Comment for hide Debug Cube*/

    /*let loader = new THREE.TextureLoader();
    let pathToTexture = '';
    loader.load(pathToTexture, function ( texture ) {
      let geometry = new THREE.PlaneBufferGeometry( 60, 20, 32 );
      let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
      let plano = new THREE.Mesh( geometry, material );
      scena.add(plano);
    });//Uncomment for use Texture on Plane*/

    /*let dae;
    let loader = require('three-collada-loader')(THREE);
    let pathToDae = './assets/mask.dae';  //Path to Collada Model
		loader.options.convertUpAxis = true;
		loader.load( pathToDae, function ( collada ) {
				dae = collada.scene;
				dae.scale.x = dae.scale.y = dae.scale.z = 1;
				dae.updateMatrix();
        scena.add(dae);
		}); //Uncomment for use Collada Model*/

    var directionalLight = new THREE.DirectionalLight(0xffeedd);

    this.scene.add(directionalLight);
    this.scene.add(scena);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.OrthographicCamera(this.canvas.clientWidth / - 2, this.canvas.clientWidth / 2,
      this.canvas.clientHeight / 2, this.canvas.clientHeight / - 2, this.nearClippingPane, this.farClippingPane);
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /* LOOP */
  private startRenderingLoop() {
    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animate();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  /* EVENTS */
  public onResize() {
    //this.camera.aspect = this.getAspectRatio();
    //this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  /* LIFECYCLE */
  public ngAfterViewInit() {
    this.createScene();
    this.create();
    this.startRenderingLoop();
  }
}
