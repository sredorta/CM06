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
  @Input() images :string[];// = ["./assets/images/logo.jpg","./assets/images/trace.png","./assets/images/galleria-debug-1.jpg","./assets/images/galleria-debug-2.jpg"];  //Input images if any
  @Input() maxSize : number = 500;
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
  base64 : string[] = new Array<string>();
  currentElement : HTMLImageElement;
  newElement : boolean = false;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor() { }


/*// helper to transform to base64
// see other question for more help
toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      console.log("Read data !!!");
      console.log(reader.result);
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);

  };
  xhr.open('GET', url);
  xhr.send();
}*/


/*
  ngOnInit() {
    this.processInputs();
  }


  processInputs() {
    this.currentElement = this.realImgElem.nativeElement;
    if (this.images) {
      if (this.images.length>0) {
        let obj : any = [];
        if (!this.isMultiple) {
          obj = this.images[0];
          this.images = [];
          this.images[0] = obj;
        }
        this.realImgElem.nativeElement.src = this.images[0];
        //Update current element to first image
        setTimeout(() => {
          this.selectImage(this.thumb.first.nativeElement);
        });  
        //Update shadow image with primary image and this will update canvas
        this.defaultImgLoaded = false;
      }
    } else {
      this.images = [];
      this.realImgElem.nativeElement.src = this.defaultImage;
      this.defaultImgLoaded = true;
    }

  }

  //TODO HAVE AN UPDATE INPUT FIELD TO DETECT EDIT
  ngOnChanges(changes: SimpleChanges) {
    //console.log("CHANGES !!!!");
    if (changes)
    if (changes.images) {
      this.images = changes.images.currentValue;
      console.log(changes.images.currentValue);
      this.processInputs();
    }
    
  }

  ngAfterViewInit() {
    //Update current element to first image, timeout is required to avoid Expression has changed before checked
    if (this.images.length>0)
    setTimeout(() => {
      this.generateInitalBlobs();
      this.selectImage(this.thumb.first.nativeElement);
    }); 

    let subscription = Observable.of(this.images).subscribe(res => {
      console.log("IMAGES CHANGED !!!");
      console.log(res);
      this.images = res;
      this.processInputs();
      //subscription.unsubscribe();
    });
  }

  //Copy the initial images to blobs
  generateInitalBlobs() {
    console.log("Generate initial Blobs ");
    this.thumb.forEach((elem: ElementRef,id:number) => {
      this.shadowImgElem.nativeElement.src = elem.nativeElement.src;
      var obj = this;
      var myImageData = new Image();
      var obj = this;
      myImageData.src = elem.nativeElement.src;
      myImageData.onload = function () {
        var canvas = obj.shadowCanvasElem;  
        var ctx = canvas.nativeElement.getContext("2d");
        canvas.nativeElement.width = myImageData.width;
        canvas.nativeElement.height = myImageData.height;
        ctx.drawImage(myImageData, 0, 0);
        obj.setFormField(id,canvas.nativeElement.toDataURL('image/jpeg',0.9));
      }
    });
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
      obj.canvasToReal();
    }
  }

  //We copy the shadow image to the canvas for processing when new image is set into shadow image
  onShadowImageLoaded() {
      var canvas = this.shadowCanvasElem.nativeElement;   
      if (this.crop) this.resizeAndCropCanvas(this.shadowImgElem,this.shadowCanvasElem);
      else this.resizeCanvas(this.shadowImgElem,this.shadowCanvasElem);
      return canvas;
  }

  canvasToReal() {
    //We set the real image with the canvas data
    var canvas = this.shadowCanvasElem.nativeElement;  
    this.currentElement.src = canvas.toDataURL('image/jpeg',0.9);
    this.shadowImgElem.nativeElement.src = canvas.toDataURL('image/jpeg',0.9);
    this.realImgElem.nativeElement.src = canvas.toDataURL('image/jpeg',0.9);
    this.defaultImgLoaded = false;
    //Update the form data
    this.setFormField(this.currentElement.attributes['id'].value,canvas.toDataURL('image/jpeg',0.9));
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
    this.canvasToReal();
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
          if (!obj.isMultiple)
            obj.images[0] = reader.result.toString();
          else   
            obj.images.push(reader.result.toString()); //Updates currentElement
        }
        let subscription = this.thumb.changes.subscribe(res => {
          setTimeout(() => {
            this.selectImage(res.last.nativeElement);
          });
          subscription.unsubscribe();
        });
      };
    }
  }

  //Handle now removal
  resetImage() {
    if (this.isMultiple) {
      let index = this.currentElement.attributes['id'].value;
      if (index>0){
        this.images.splice(index,1);
        this.base64.splice(index,1);
        this.updateFormField();
        let subscription = this.thumb.changes.subscribe(res => {
          //Update current element to first image
          setTimeout(() => {
            this.selectImage(this.thumb.first.nativeElement); 
          });   
          subscription.unsubscribe();
        });
      } else {
        //We are removing first element
        this.defaultImgLoaded = true;
        this.realImgElem.nativeElement.src = this.defaultImage;
        this.images = [];
        this.base64 = [];
        this.updateFormField();
      } 
    } else {
        //We are removing first element
        this.defaultImgLoaded = true;
        this.realImgElem.nativeElement.src = this.defaultImage;
        this.images = [];
        this.base64 = [];
        this.updateFormField();
    }

  }

  //Returns if thumb is selected or not for css class
  isSelected(id) {
      if (this.currentElement.attributes['id'])
        if (id == this.currentElement.attributes['id'].value) return true;
        else return false;
      else 
        return false;  
  }

  //Sets the form field as specified in fieldName input with blobs of all images
  setFormField(id:number, data:string) {
    let obj;
    let field = this.fieldName;
    if (this.isMultiple) {
      this.base64[id] = data;
      obj = {
        [field] : this.base64
      };
    } else {
      this.base64[id] = data;
      obj = {
        [field] : this.base64[0]
      };
    }
    console.log("Setting final data to:");
    console.log(this.base64);
    this.parentForm.patchValue(obj);
  }

  //Updates output with current blobs
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
    console.log("Setting final data to:");
    console.log(obj);
    this.parentForm.patchValue(obj);
  }
*/

  ngOnInit() {
    console.log("OnInit");
    this.currentElement = this.realImgElem.nativeElement;
    if (this.images) {
      if (this.images.length>0) {
        let obj : any = [];
        if (!this.isMultiple) {
          obj = this.images[0];
          this.images = [];
          this.images[0] = obj;
          console.log("Set images to :");
          console.log(this.images);
        }
        this.realImgElem.nativeElement.src = this.images[0];
        //Update current element to first image
/*        setTimeout(() => {
          this.selectImage(this.thumb.first.nativeElement);
        });  */
        //Update shadow image with primary image and this will update canvas
        this.defaultImgLoaded = false;
      }
    } else {
      this.images = [];
      this.realImgElem.nativeElement.src = this.defaultImage;
      this.defaultImgLoaded = true;
    }
  }

  ngAfterViewInit() {
    console.log("thumbs !!!!");
    console.log(this.thumb);
    console.log("Images :::");
    console.log(this.images);

    this._subscriptions.push(this.thumb.changes.subscribe(res => {
      console.log("Thumbs changed !!!!");
      console.log(res);
      //Update current element to first image, timeout is required to avoid Expression has changed before checked
      setTimeout(() => {
        console.log("We are here");
        console.log(this.thumb);
        if (this.thumb)
          if (this.thumb.length>0)
            this.selectImage(this.thumb.first.nativeElement);
      });        
    }));

  }


  //Returns if thumb is selected or not for css class
  isSelected(id) {
    if (this.currentElement.attributes['id'])
      if (id == this.currentElement.attributes['id'].value) return true;
      else return false;
    else 
      return false;  
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
      obj.canvasToReal();
    }
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
          if (!obj.isMultiple)
            obj.images[0] = reader.result.toString();
          else   
            obj.images.push(reader.result.toString()); //Updates currentElement
        }
        let subscription = this.thumb.changes.subscribe(res => {
          setTimeout(() => {
            this.selectImage(res.last.nativeElement);
          });
          subscription.unsubscribe();
        });
      };
    }
  }


  //We copy the shadow image to the canvas for processing when new image is set into shadow image
  onShadowImageLoaded() {
    var canvas = this.shadowCanvasElem.nativeElement;   
    if (this.crop) this.resizeAndCropCanvas(this.shadowImgElem,this.shadowCanvasElem);
    else this.resizeCanvas(this.shadowImgElem,this.shadowCanvasElem);
    return canvas;
}

  canvasToReal() {
    //We set the real image with the canvas data
    var canvas = this.shadowCanvasElem.nativeElement;  
    console.log("width : " + canvas.width);
    console.log("height : " + canvas.height);
    this.currentElement.src = canvas.toDataURL('image/png');
    this.shadowImgElem.nativeElement.src = canvas.toDataURL('image/png');
    this.realImgElem.nativeElement.src = canvas.toDataURL('image/png');
    this.defaultImgLoaded = false;
    //Update the form data
    this.setFormField(this.currentElement.attributes['id'].value,canvas.toDataURL('image/png'));
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
    this.canvasToReal();
  }

  //Handle now removal
  resetImage() {
    if (this.isMultiple) {
      let index = this.currentElement.attributes['id'].value;
      if (index>0){
        this.images.splice(index,1);
        this.base64.splice(index,1);
        this.updateFormField();
        let subscription = this.thumb.changes.subscribe(res => {
          //Update current element to first image
          setTimeout(() => {
            this.selectImage(this.thumb.first.nativeElement); 
          });   
          subscription.unsubscribe();
        });
      } else {
        //We are removing first element
        this.defaultImgLoaded = true;
        this.realImgElem.nativeElement.src = this.defaultImage;
        this.images = [];
        this.base64 = [];
        this.updateFormField();
      } 
    } else {
        //We are removing first element
        this.defaultImgLoaded = true;
        this.realImgElem.nativeElement.src = this.defaultImage;
        this.images = [];
        this.base64 = [];
        this.updateFormField();
    }

  }  

  //Sets the form field as specified in fieldName input with blobs of all images
  setFormField(id:number, data:string) {
    let obj;
    let field = this.fieldName;
    if (this.isMultiple) {
      this.base64[id] = data;
      obj = {
        [field] : this.base64
      };
    } else {
      this.base64[id] = data;
      obj = {
        [field] : this.base64[0]
      };
    }
    console.log("Setting final data to:");
    console.log(this.base64);
    //console.log("Length is: " + this.base64[0].length);
    this.parentForm.patchValue(obj,{ onlySelf: false, emitEvent: true });
  }

  //Updates output with current blobs
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
    console.log("Setting final data to:");
    console.log(obj);
    //console.log("Length is: " + this.base64[0].length);
    this.parentForm.patchValue(obj,{ onlySelf: false, emitEvent: true });
  }

  ngOnDestroy(): void {
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
