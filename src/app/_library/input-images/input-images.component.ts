import { HostListener, Component, OnInit,ViewChild,ViewChildren, ElementRef, Input, Output, EventEmitter, SimpleChanges,QueryList} from '@angular/core';
import { FlexLayoutModule  } from "@angular/flex-layout";
import { FormControlName } from '@angular/forms';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import * as ts from "typescript";
import { Observable,Observer, of, throwError } from 'rxjs';

@Component({
  selector: 'app-input-images',
  templateUrl: './input-images.component.html',
  styleUrls: ['./input-images.component.scss']
})
export class InputImagesComponent implements OnInit {
  //Inputs
  @Input() parentForm : FormGroup;
  @Input() fieldName : string = "image";
  @Input() defaultImage : string = "./assets/images/no-photo-available.jpg";
  @Input() images :string[] = ["./assets/images/galleria-debug-1.jpg","./assets/images/logo.jpg","./assets/images/trace.png","./assets/images/galleria-debug-1.jpg","./assets/images/galleria-debug-2.jpg"];  //Input images if any
  @Input() maxSize : number = 200;
  @Input() crop : boolean = true;
  @Input() isMultiple : boolean = false;

  //References
  @ViewChild('fileInput') inputElem : ElementRef;           //File input element
  @ViewChild('realImg') realImgElem : ElementRef;           //Real image element
  @ViewChild('shadowCanvas') shadowCanvasElem : ElementRef; //Shadow canvas for manipulation
  @ViewChild('shadowImg') shadowImgElem : ElementRef;       //Shadow image for manipulation
  @ViewChild('gallery') gallery : ElementRef;       //Shadow image for manipulation
  @ViewChildren('thumb') thumb : QueryList<ElementRef>;

  defaultImgLoaded : boolean = true;
  base64Img : string[] = new Array<string>();
  currentElement : HTMLImageElement;
  newElement : boolean = false;

  constructor() { }

  ngOnInit() {
    this.currentElement = this.realImgElem.nativeElement;
    if (this.images) {
      //Update shadow image with primary image and this will update canvas
      this.shadowImgElem.nativeElement.src = this.images[0];
      var myImageData = new Image();
      var obj = this;
      myImageData.src = this.images[0];
      myImageData.onload = function () {
        obj.onShadowImageLoaded();
      }
      this.defaultImgLoaded = false;
    } else
      this.realImgElem.nativeElement.src = this.defaultImage;

   
  }


  //When an image is selected we update the shadow
  selectImage(img:HTMLImageElement) {
    this.currentElement = img;
    this.shadowImgElem.nativeElement.src = img.src;

    var myImageData = new Image();
    var obj = this;
    myImageData.src = img.src;
    myImageData.onload = function () {
      obj.onShadowImageLoaded();
    }
  }

  //We copy the shadow image to the canvas for processing when new image is set into shadow image
  onShadowImageLoaded() {
    console.log("Running onShadowImageLoaded !");
      var canvas = this.shadowCanvasElem.nativeElement;   
      if (this.crop) this.resizeAndCropCanvas(this.shadowImgElem,this.shadowCanvasElem);
      else this.resizeCanvas(this.shadowImgElem,this.shadowCanvasElem);
      this.canvasToReal(canvas);
  }

  canvasToReal(canvas:HTMLCanvasElement) {

 /*   if (this.newElement) {
      this.images.push(canvas.toDataURL('image/jpeg',0.9).toString()); //Updates currentElement
      this.newElement = false;
    }*/
    //We set the real image with the canvas data
    this.currentElement.src = canvas.toDataURL('image/jpeg',0.9);
    this.shadowImgElem.nativeElement.src = canvas.toDataURL('image/jpeg',0.9);
    this.realImgElem.nativeElement.src = canvas.toDataURL('image/jpeg',0.9);
  }

  resizeCanvas(img:ElementRef,canvas:ElementRef) {
    let width : number = 0;
    let height : number = 0;
    var ctx = canvas.nativeElement.getContext("2d");
    if (img.nativeElement.width>this.maxSize || img.nativeElement.height>this.maxSize) {
      if (img.nativeElement.width>img.nativeElement.height) {
        width = this.maxSize;
        height = Math.round(img.nativeElement.height / (img.nativeElement.width / this.maxSize));
        canvas.nativeElement.width = width;
        canvas.nativeElement.height = height;
        ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.heigth);
        ctx.drawImage(img.nativeElement, 0,0, img.nativeElement.width, img.nativeElement.height, 0, 0, width,height);
      } else {
        height = this.maxSize;
        width = Math.round(img.nativeElement.width / (img.nativeElement.height / this.maxSize));
        canvas.nativeElement.width = width;
        canvas.nativeElement.height = height;
        ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.heigth);
        ctx.drawImage(img.nativeElement, 0,0, img.nativeElement.width, img.nativeElement.height, 0, 0, width,height);
      }
    } else {
      canvas.nativeElement.width = img.nativeElement.width;
      canvas.nativeElement.height = img.nativeElement.height;
      ctx.drawImage(img.nativeElement, 0, 0);
    }

  }

  resizeAndCropCanvas(img:ElementRef,canvas:ElementRef) {
    console.log("CROP : TRUE");
    let sourceWidth = img.nativeElement.width;
    let sourceHeight = img.nativeElement.height;
    let sourceSize;
    var ctx = canvas.nativeElement.getContext("2d");

    if (sourceWidth>=sourceHeight) {
      var sourceX = (sourceWidth - sourceHeight)/2;
      var sourceY = 0;
      sourceSize=sourceHeight;
    } else {
        var sourceX = 0;
        var sourceY = (sourceHeight - sourceWidth)/2;
        sourceSize=sourceWidth;
    }    
    canvas.nativeElement.width = this.maxSize;
    canvas.nativeElement.height= this.maxSize;
    ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.heigth);
    ctx.drawImage(img.nativeElement, sourceX,sourceY, sourceSize, sourceSize, 0, 0, this.maxSize,this.maxSize);
  }

//Rotate the image by rotating the canvas
rotateImage() {
    let img = this.shadowImgElem;
    let canvas = this.shadowCanvasElem;
    let angle = Math.PI / 2;
    let cw = canvas.nativeElement.width;
    let ch = canvas.nativeElement.height;
    canvas.nativeElement.width = ch;
    canvas.nativeElement.height = cw;
    var ctx = canvas.nativeElement.getContext("2d");
    ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.heigth);
    // translate and rotate
    ctx.translate(canvas.nativeElement.width/2, canvas.nativeElement.height /2);
    ctx.rotate(angle);
    // draw the previows image, now rotated
    var delta = Math.abs(ch-cw)/2;
    if (cw>=ch){
      var origX = -(canvas.nativeElement.width/2) - delta ;
      var origY = -(canvas.nativeElement.height/2) + delta ;
    } else {
      var delta = Math.abs(ch-cw)/2;
      var origX = -(canvas.nativeElement.width/2) + delta;
      var origY = -(canvas.nativeElement.height/2) - delta ;
    } 
    ctx.drawImage(img.nativeElement, 0,0,img.nativeElement.width,img.nativeElement.height,origX,origY,cw,ch); 
    this.canvasToReal(canvas.nativeElement);
  }

  //We have clicked on the galery fab
  openFileViewer() {
    this.inputElem.nativeElement.click();
  }  

  loadImage(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.shadowImgElem.nativeElement.src = reader.result;
        var myImageData = new Image();
        var obj = this;
        myImageData.src = reader.result.toString();
        myImageData.onload = function () {
          obj.images.push(reader.result.toString()); //Updates currentElement
          console.log("Setting current to : " + obj.thumb.last.nativeElement);
          obj.currentElement = obj.thumb.last.nativeElement;
          obj.onShadowImageLoaded();
        }
      };
    }
  }

  //Handle now removal
  resetImage() {
    console.log("Reset image");
    console.log(this.currentElement);
    this.currentElement;
  }




}
