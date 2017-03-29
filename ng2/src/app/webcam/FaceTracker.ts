import { ElementRef } from '@angular/core';
import { EmotionClassifier } from './emotionClassifier';
const Tracker = require('./lib/clmtrackr.js');
const Deformer = require('./lib/face_deformer.js');
const faceModel = require('./lib/model_spca_20_svm.js');
var lastLoop:any = new Date;

export class FaceTracker {

  private _video: ElementRef;
  private _overlayCC: ElementRef;
  private _webglCC: ElementRef;
  private _mask: ElementRef;
  private _videoReady: boolean = false;

  private _ctracker: any;
  private _fdeformer: any;
  private _positions: any;
  private _emotion: EmotionClassifier;
  private _mask_coords: any;

  public _scale: any = 0;
  public _rotationY: any = 0;
  public _rotationZ: any = 0;
  public _rotationX: any = 0;
  public _eyeLeft: any = 0;
  public _eyeRight: any = 0;
  public _posx: any = 0;
  public _posy: any = 0;

  constructor(video: ElementRef, overlayCC: ElementRef, webglCC: ElementRef, mask: ElementRef, videoReady: boolean) {
    this._video = video;
    this._overlayCC = overlayCC;
    this._webglCC = webglCC;
    this._videoReady = videoReady;
    this._mask = mask;
    ////////////////////////////////////////
    this._emotion = new EmotionClassifier();
    this._mask_coords = [[94.36614797199479,301.0803014941178],[103.3112341317163,370.94425891220794],[120.32682383634102,423.44019820073913],[136.47515990999432,479.5313526801685],[144.0368892689739,530.2345465095229],[172.36671158523987,580.3629853084399],[217.01976787749376,619.1929480747351],[269.34754914721543,625.5185645282593],[326.48254316405735,621.3861472887296],[367.5697682338512,588.2815093455445],[396.3225813396373,544.5241298700507],[423.17220298223486,485.34023789625417],[433.9843247454375,424.6310467376783],[459.5753658677024,376.88741971189734],[465.6871064619868,309.4410229689395],[439.2202424949693,261.17900856324786],[404.95656878888406,237.16839138607617],[349.4475953084992,224.72336816106127],[307.5262703136751,246.56374069983377],[111.59908955786085,255.73818792771897],[140.77843006651088,236.25905776423554],[198.25614310392174,221.75964368670276],[238.0607640650076,244.705502740957],[147.51722669161887,322.2920755920064],[179.96374258674177,303.20283557208495],[219.89652431504095,321.63741406437117],[181.93382178127874,336.62855114616417],[181.67029281471235,321.84674383355735],[409.08887297158253,319.49332724817634],[372.08555159755235,302.6637205310945],[332.21673690859785,314.25212117506817],[371.9034386455536,336.7928247239386],[370.73203771018734,318.2549362647991],[275,262],[241.49292248091808,382.6509156918952],[228.65540058230079,403.67602315679153],[246.4207645046435,428.633436281585],[281.6262637981823,429.7101230850766],[320.3090052424696,429.4111504923561],[337.71957018298144,408.9834145077307],[324.9443408840292,383.11655691739367],[277,336],[262.6247652804272,418.02062856158705],[305.62131595904475,419.9849042391749],[192.0888434079335,501.27870633434],[227.89330220055228,491.767986224554],[254.82152484033276,488.28172522414377],[274.58325738122585,496.93117201682657],[298.6427918040954,490.9689564164321],[325.48328507490595,499.3328015524256],[350.42668910649365,508.3776245292422],[327.3034449428819,532.1604992353581],[302.413708672554,539.1078344701017],[266.7645104587291,540.3023216343349],[237.0072802317868,530.3260142620247],[215.71258213035736,519.4068856743318],[222.47713501183063,502.96356939871526],[278.19882029298384,511.73001012850216],[321.89078331130554,511.2982898921548],[318.4792941712966,518.8634093151715],[277.74782145336667,522.9574136207773],[230.31017878122015,512.4917843225409],[281.2762389085891,407.8752450214805],[163.2415047021451,306.7465365446632],[202.42996875366381,307.91977418268493],[204.91393138279884,330.1328065429834],[161.72396129164846,332.9605656535211],[394.08708850976745,308.0776176192674],[354.1514690637372,305.45718896085043],[349.5616880820385,328.5223891568975],[391.4980892099413,331.1427807886423]];
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
        //var rarr = this._ctracker.getCurrentPosition()[62][1] - this._ctracker.getCurrentPosition()[37][1];
        //var rabj = this._ctracker.getCurrentPosition()[37][1] - this._ctracker.getCurrentPosition()[62][1];

        this._scale = this._ctracker.getCurrentParameters()[0];
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
