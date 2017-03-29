import { ElementRef } from '@angular/core';
import { EmotionClassifier } from './emotionClassifier';
const Tracker = require('./lib/clmtrackr.js');
const Deformer = require('./lib/face_deformer.js');
const faceModel = require('./lib/model_spca_20_svm.js');
var lastLoop:any = new Date;

export class FaceTracker {

  private _video: ElementRef;
  private _overlayCC: ElementRef;
  private _videoReady: boolean = false;

  private _ctracker: any;
  private _fdeformer: any;
  private _positions: any;
  private _emotion: EmotionClassifier;

  public _scale: any = 0;
  public _rotationY: any = 0;
  public _rotationZ: any = 0;
  public _rotationX: any = 0;
  public _eyeLeft: any = 0;
  public _eyeRight: any = 0;
  public _posx: any = 0;
  public _posy: any = 0;

  constructor(video: ElementRef, overlayCC: ElementRef, videoReady: boolean) {
    this._video = video;
    this._overlayCC = overlayCC;
    this._videoReady = videoReady;
    ////////////////////////////////////////
    this._emotion = new EmotionClassifier();
  }

  public startTracke() {
    //Tracking
    this._ctracker = new Tracker.tracker({useWebGL: true});
    this._ctracker.init(faceModel);

    //Draw in Canvas
    this.drawLoop();
  }

  public drawLoop = () => {

    this._ctracker.track(this._video.nativeElement);
    var canvasInput = this._overlayCC.nativeElement;

    if (this._ctracker.getCurrentPosition()) {

      var cc = canvasInput.getContext('2d');

      if(this._ctracker.getScore() > 0.5){
        cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
        this._ctracker.draw(canvasInput);

        var er = this._emotion.meanPredict(this._ctracker.getCurrentParameters());

        var w = this._ctracker.getCurrentPosition()[14][0] - this._ctracker.getCurrentPosition()[0][0];
        var h = this._ctracker.getCurrentPosition()[7][0] - this._ctracker.getCurrentPosition()[33][0];
        var pz = this._ctracker.getCurrentPosition()[47][0] - this._ctracker.getCurrentPosition()[37][0];
        var rizq = this._ctracker.getCurrentPosition()[3][0] - this._ctracker.getCurrentPosition()[44][0];
        var rder = this._ctracker.getCurrentPosition()[50][0] - this._ctracker.getCurrentPosition()[11][0];

        console.log(w / 100);

        this._scale = w / 100;
        this._rotationY = rizq - rder;
        this._rotationZ = this._ctracker.getCurrentPosition()[0][1] - this._ctracker.getCurrentPosition()[14][1];
        this._rotationX = this._ctracker.getCurrentPosition()[0][1] - this._ctracker.getCurrentPosition()[23][1];
        this._eyeLeft = [this._ctracker.getCurrentPosition()[32][0], this._ctracker.getCurrentPosition()[32][1]];
        this._eyeRight = [this._ctracker.getCurrentPosition()[27][0], this._ctracker.getCurrentPosition()[27][1]];
        this._posx = this._ctracker.getCurrentPosition()[37][0];
        this._posy = this._ctracker.getCurrentPosition()[37][1];
      }else{
      }

      //Emotion
      if (er) {
        var positionString = "";
        for (var p = 0; p < er.length; p++) {
          positionString += er[p]["emotion"] + " : [" + er[p]["value"].toFixed(1) + "]\n";
        }
      }

    }
    //Debug
    //this.debug();
    //
    requestAnimationFrame(this.drawLoop);
  }

  public debug = () => {
    var thisLoop:any = new Date;
    var fps = 1000 / (Number(thisLoop) - Number(lastLoop));
    lastLoop = thisLoop;
    /////////////////////////////////////////////////
    console.log("SCORE: ", this._ctracker.getScore() );
    console.log("FPS: ", parseInt(fps.toString()) );
  }

}
