import { Component, Input, OnDestroy, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FaceTracker } from "./FaceTracker";

@Component({
  selector: 'webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})

export class WebcamComponent implements OnInit, AfterViewInit {

  public track:any;
  public scaleX:number = 1;
  public scaleY:number = 1;
  public rotationY:number = 0;
  public rotationZ:number = 0;
  public rotationX:number = 0;
  public eyeLeft:any = 0;
  public eyeRight:any = 0;
  public posx:number = 0;
  public posy:number = 0;
  private _videosrc: SafeUrl;
  @ViewChild("video") private _videoCamElem: ElementRef;
  @ViewChild("overlay") private _overlay: ElementRef;

  private _constraints: any = {
    video: {
      mandatory: {
        minAspectRatio: 1.333,
        maxAspectRatio: 1.334,
        minFrameRate: 30,
        maxFrameRate: 60,
      }
    }
  };

  constructor(myElement: ElementRef, private sanitizer: DomSanitizer) {

    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    this.startVideo();

  }

  private startVideo() {

    var promise = new Promise<MediaStream>((resolve, reject) => {
      navigator.getUserMedia(this._constraints, (stream) => {
        resolve(stream);
      }, (err) => reject(err));
    }).then((stream) => {
      this._videosrc = this.sanitizer.bypassSecurityTrustResourceUrl( URL.createObjectURL(stream) );
    }).catch(this.logError);

  }

  private ctrack() {
    this.track = new FaceTracker(this._videoCamElem, this._overlay, true);
    this.track.startTrack();
  }

  private gotStream(stream: any) {
    stream.getTracks().forEach(function(track: any) {
      track.onended = function() {

      };
    });
  }

  private logError(error: any) {
    console.log(error.name + ": " + error.message);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.ctrack();
    this.drawLoop();
  }

  get videosrc(): SafeUrl {
    return this._videosrc;
  }

  set videosrc(videosrc: SafeUrl) {
    this._videosrc = videosrc;
  }

  drawLoop = () =>{
    this.scaleX = this.track._scaleX;
    this.scaleY = this.track._scaleY;
    this.rotationY = this.track._rotationY;
    this.rotationZ = this.track._rotationZ;
    this.rotationX = this.track._rotationX;
    this.posx = this.track._posx;
    this.posy = this.track._posy;

    requestAnimationFrame(this.drawLoop);
  }

}
