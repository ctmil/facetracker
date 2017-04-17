import { ElementRef } from '@angular/core';
//import { EmotionClassifier } from './emotionClassifier';  //Use for Emotion Detect
const Tracker = require('./lib/clmtrackr.js');
const faceModel = require('./lib/model_spca_20_svm.js');
//const Deformer = require('./lib/face_deformer.js'); //Use for FaceMasking

export class FaceTracker {

  private _video: ElementRef;
  private _overlayCC: ElementRef;
  private _videoReady: boolean = false;

  private _ctracker:any;

  public _scaleX:number = 1;
  public _scaleY:number = 1;
  public _rotationY:number = 0;
  public _rotationZ:number = 0;
  public _rotationX:number = 0;
  public _eyeLeft:any = 0;
  public _eyeRight:any = 0;
  public _posx:number = 0;
  public _posy:number = 0;

  public _face:boolean = false;

  constructor(video:ElementRef, overlayCC:ElementRef, videoReady:boolean) {
    this._video = video;
    this._overlayCC = overlayCC;
    this._videoReady = videoReady;
    ////////////////////////////////////////
    this._ctracker = new Tracker.tracker({useWebGL: true, searchWindow : 14});
  }

  public startTrack(debug:boolean) {
    //Tracking
    this._ctracker.init(faceModel);
    //Draw in Canvas
    this.drawLoop();
  }

  public stopFace(){
    this._ctracker.stop();
    this._face = false;
  }

  public startFace(){
    this._ctracker.start(this._video.nativeElement);
    this._face = true;
  }

  public drawLoop = () => {
    let canvasInput = this._overlayCC.nativeElement;

    if (this._ctracker.getCurrentPosition()) {

      let cc = canvasInput.getContext('2d');

      if(this._ctracker.getScore() > 0.5){
        cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
        if(this._face){
          this._ctracker.draw(canvasInput);
        }

        let w = this._ctracker.getCurrentPosition()[14][0] - this._ctracker.getCurrentPosition()[0][0];
        let h = this._ctracker.getCurrentPosition()[7][1] - this._ctracker.getCurrentPosition()[33][1];
        let pz = this._ctracker.getCurrentPosition()[47][0] - this._ctracker.getCurrentPosition()[37][0];
        let rizq = this._ctracker.getCurrentPosition()[3][0] - this._ctracker.getCurrentPosition()[44][0];
        let rder = this._ctracker.getCurrentPosition()[50][0] - this._ctracker.getCurrentPosition()[11][0];

        this._scaleX = w / 80;
        this._scaleY = h / 60;
        this._rotationY = rizq - rder;
        this._rotationZ = this._ctracker.getCurrentPosition()[0][1] - this._ctracker.getCurrentPosition()[14][1];
        this._rotationX = this._ctracker.getCurrentPosition()[0][1] - this._ctracker.getCurrentPosition()[23][1];
        this._eyeLeft = [this._ctracker.getCurrentPosition()[32][0], this._ctracker.getCurrentPosition()[32][1]];
        this._eyeRight = [this._ctracker.getCurrentPosition()[27][0], this._ctracker.getCurrentPosition()[27][1]];
        this._posx = this._ctracker.getCurrentPosition()[62][0];
        this._posy = this._ctracker.getCurrentPosition()[62][1];
      }else{
        cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
      }

    }
    requestAnimationFrame(this.drawLoop);
  }

}
