import { HostListener, Component, OnInit,ViewChild,ViewChildren, ElementRef, Input, Output, EventEmitter, SimpleChanges,QueryList} from '@angular/core';
import { FlexLayoutModule  } from "@angular/flex-layout";
import { FormControlName } from '@angular/forms';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import * as ts from "typescript";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';


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
  @Input() images :string[] = [];  //Input images if any
  @Input() maxSize : number = 500;
  @Input() crop : boolean = true;
  @Input() isMultiple : boolean = false;
  @Input() disabled : boolean = false;

  //References
  @ViewChild('fileInput') inputElem : ElementRef;           //File input element
  @ViewChild('realImg') realImgElem : ElementRef;           //Real image element
  @ViewChild('shadowCanvas') shadowCanvasElem : ElementRef; //Shadow canvas for manipulation
  @ViewChild('gallery') gallery : ElementRef;       //Shadow image for manipulation
  @ViewChildren('thumb') thumb : QueryList<ElementRef>;

  base64 : string[] = new Array<string>();
  currentElement : HTMLImageElement;
  defaultImgLoaded : boolean = false;
  compress : boolean = false; //Define compression when we load from file   
  compression_rate = 0.9;    //Compression rate when we load a file
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor() { }



  //Detect changes on input and if there are changes re-initialize the component
  ngOnChanges(changes: SimpleChanges) {
    if (changes.images)
      if (changes.images.previousValue != changes.images.currentValue) {
        this.images = changes.images.currentValue;
        this.initComponent();
        this.setDefaultImage();
      }
    if (changes.currentElement) {
        this.currentElement = changes.currentElement.currentValue;
        this.realImgElem.nativeElement.src = changes.currentElement.currentValue.nativeElement.src;
    }
  }



  //Initialize the component
  initComponent() {
    if (!this.images) {
      this.resetImage();
    } else {
      this.base64 = [];
      //We need to add interval to avoid smaller images to be loaded first
      let i = 0;
      for (let image of this.images) {
        i = i+200;
        setTimeout(()=> {
          this.imageToBase64Array(image);
        },i);

      }
    }
  }



  //We create all base64 array and this triggers the update of the list of thumbs
  imageToBase64Array(data: string) {
    var obj = this;
    var canvas = this.shadowCanvasElem;
    let myImage = new Image();
    myImage.crossOrigin = "anonymous";
    myImage.src = data;
    myImage.onload = function() {
      if (obj.isMultiple) {
        if (obj.crop) obj.base64.push(obj._resizeAndCropCanvas(myImage,canvas)); 
        else obj.base64.push(obj._resizeCanvas(myImage,canvas));
      } else {
        if (obj.crop) obj.base64[0] = obj._resizeAndCropCanvas(myImage,canvas); 
        else obj.base64[0] = obj._resizeCanvas(myImage,canvas);      
      }        
      //Avoid that each time we call the function we redo the resize
      myImage.onload = function() {};
    };
  }


  //When an image is selected from the gallery we update the shadow
  selectImage(img:HTMLImageElement) { 
    if (!this.disabled) {
      this.currentElement = img;
      this.realImgElem.nativeElement.src = img.src;
    }
  }


  rotateImage() {
    let obj = this;
    let myImage = new Image();
    myImage.src = this.base64[this.currentElement.attributes['id'].value];
    myImage.onload = function () {
      //obj.realImgElem.nativeElement.src = myImage.src;
      let result = obj._rotateImage(myImage,obj.shadowCanvasElem);
      obj.base64[obj.currentElement.attributes['id'].value] = result;
      obj.realImgElem.nativeElement.src = result;
    };
  }


  ngOnInit() {
    this.setDefaultImage();
  }

  setDefaultImage() {
    if (!this.images) this.defaultImgLoaded =true;
    else {
      if (this.images.length == 0) this.defaultImgLoaded = true;
      else this.defaultImgLoaded = false;
    }
  }


  ngAfterViewInit() {
    this._subscriptions.push(this.thumb.changes.subscribe(res => {
        setTimeout(() => {
          if (this.thumb.length>=1) {
            this.defaultImgLoaded = false;
          }          
          if (!this.currentElement) {
            if (this.thumb.length>0) {
              this.currentElement = this.thumb.first.nativeElement;
              this.realImgElem.nativeElement.src = this.thumb.first.nativeElement.src;
            }
          }
          this.updateFormField();
        });
    })); 
    if (this.thumb.length == 0) {
      setTimeout(() => {
        this.resetImage();
      });
    }

  }



  //We have clicked on the galery fab
  openFileViewer() {
    this.inputElem.nativeElement.click();
  }  

  //Load the image and update everything
  loadImage(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.compress = true; //Compress as we load from file first time
        this.imageToBase64Array(reader.result.toString());
        setTimeout(() => {
            this.currentElement = this.thumb.last.nativeElement;
            this.realImgElem.nativeElement.src = this.thumb.last.nativeElement.src;
            this.defaultImgLoaded = false;
        });
      };
    }
  }



  //Returns if thumb is selected or not for css class
  isSelected(id) {
    if (this.currentElement)
      if (this.currentElement.attributes['id'])
        if (id == this.currentElement.attributes['id'].value) return true;
        else return false;
      else 
        return false;  
  }

  //Removes the current selected image
  removeImage() {
    if (this.base64.length>1) {
      this.base64.splice( this.currentElement.attributes['id'].value, 1);
      this.currentElement = this.gallery.nativeElement.first;
    } else {
      this.resetImage();
    }
  }

  //Resets the component to default
  resetImage() {
    this.realImgElem.nativeElement.src = this.defaultImage;
    this.base64 = [];
    this.images = [];
    this.defaultImgLoaded = true;
    this.updateFormField();
    //this.imageToBase64Array(this.defaultImage);
//    this.defaultImgLoaded = true;
  }

  //Updates output with current base64 data
  updateFormField() {
    let obj;
    let field = this.fieldName;
    if (this.isMultiple) {
      obj = {
        [field] : this.base64
      };    
    } else {
      obj = {
        [field] : this.base64[0]
      };  
    }
    if (this.base64)
      if (this.base64[0]) {
      }
    this.parentForm.patchValue(obj,{ onlySelf: false, emitEvent: true });
  }


  //Give input image and canvas and resizes and returns base64
  private _resizeCanvas(img:HTMLImageElement,canvas:ElementRef) {
    let width : number = 0;
    let height : number = 0;
    var ctx = canvas.nativeElement.getContext("2d");
    if (img.width>this.maxSize || img.height>this.maxSize) {
      if (img.width>img.height) {
        width = this.maxSize;
        height = Math.round(img.height / (img.width / this.maxSize));
        canvas.nativeElement.width = width;
        canvas.nativeElement.height = height;
        ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.height);
        ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, width,height);
      } else {
        height = this.maxSize;
        width = Math.round(img.width / (img.height / this.maxSize));
        canvas.nativeElement.width = width;
        canvas.nativeElement.height = height;
        ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.height);
        ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, width,height);
      }
    } else {
      canvas.nativeElement.width = img.width;
      canvas.nativeElement.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
    let rate = this.compress?this.compression_rate:1.0;
    this.compress = false; //Disable compression now
    return canvas.nativeElement.toDataURL("image/jpeg",rate);
  }

  private _resizeAndCropCanvas(img:HTMLImageElement,canvas:ElementRef) {
    let sourceWidth = img.width;
    let sourceHeight = img.height;
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
    ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.height);
    ctx.drawImage(img, sourceX,sourceY, sourceSize, sourceSize, 0, 0, this.maxSize,this.maxSize);
    let rate = this.compress?this.compression_rate:1.0;
    this.compress = false; //Disable compression now
    return canvas.nativeElement.toDataURL("image/jpeg",rate);
  }

  //Rotate the image by rotating the canvas
  private _rotateImage(img:HTMLImageElement, canvas:ElementRef) {
    let angle = Math.PI / 2;
    canvas.nativeElement.width = img.height;
    canvas.nativeElement.height = img.width;
    let ch = canvas.nativeElement.width;
    let cw = canvas.nativeElement.height;
    var ctx = canvas.nativeElement.getContext("2d");
    ctx.clearRect(0,0,canvas.nativeElement.width, canvas.nativeElement.height);
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
    ctx.drawImage(img, 0,0,img.width,img.height,origX,origY,img.width,img.height); 
    return canvas.nativeElement.toDataURL("image/jpeg",1);
  }




  ngOnDestroy(): void {
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
