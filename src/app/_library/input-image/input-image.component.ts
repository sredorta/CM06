
import { HostListener, Component, OnInit,ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FlexLayoutModule  } from "@angular/flex-layout";
import { FormControlName } from '@angular/forms';
import {FormGroup,FormControl,Validators} from '@angular/forms';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss']
})
export class InputImageComponent implements OnInit {
  isImgLoaded : boolean = false;    //Stores if image has been loaded or default is loaded
  imgSize : number = 200;   //Final size of the image cropped

  defaultImageString : string;

  constructor() { }


  //Inputs
  @Input() parentForm : FormGroup;
  @Input() defaultImage : string;
  @Input() maxSize : number = 200;
  @Input() crop : boolean = true;
  //Child views for refs
  @ViewChild('fileInput') inputElem : ElementRef;           //File input element
  @ViewChild('realImg') realImgElem : ElementRef;           //Real image element
  @ViewChild('shadowImg') shadowImgElem : ElementRef;       //Shadow image for manipulation
  @ViewChild('shadowCanvas') shadowCanvasElem : ElementRef; //Shadow canvas for manipulation

  //OnInit
  ngOnInit() {
    console.log(this.defaultImage);
    this.realImgElem.nativeElement.src = this.defaultImage;
  }

  //We have clicked on the galery fab
  openFileViewer() {
    this.inputElem.nativeElement.click();
  }
  loadImage(event) {
    const reader = new FileReader();
    console.log("CROP IS : " + this.crop);
    const doCrop = this.crop;
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.isImgLoaded = true;
        //Resize and crop image to 200x200
        console.log("crop value : " + doCrop);
        if (doCrop === true) {
          this.resizeAndCropImageToSpecificSize(reader.result, this.maxSize);
        } else {
          this.resizeImageToSpecificSize(reader.result,this.maxSize);
        }
      };
    }
  }

  resetImage() {
    this.parentForm.patchValue({
      avatar: null
    });    
    this.realImgElem.nativeElement.src = this.defaultImage;
    this.isImgLoaded = false;
  }

  //Get Base64 from reader and then resize to max size by scaling
  //Sets the avatar to the new blob
  //Updates the canvas
  resizeImageToSpecificSize(image, maxSize) {
    var form = this.parentForm;
    var real = this.realImgElem;
    var myImageData = new Image();
    myImageData.src = image;
    var canvas = this.shadowCanvasElem.nativeElement;
    var ctx =canvas.getContext('2d');
    myImageData.onload = function () {
      if (myImageData.width > maxSize && myImageData.height > maxSize) {
        var factor = 1;
        if (myImageData.width > myImageData.height) {
            factor = Math.round(myImageData.width / maxSize);
        } else {
            factor = Math.round(myImageData.height / maxSize);
        }
        var fWidth = Math.round(myImageData.width / factor);
        var fheight = Math.round(myImageData.height / factor);
        ctx.clearRect(0,0,canvas.width, canvas.heigth);
        ctx.drawImage(myImageData, 0,0, myImageData.width, myImageData.height, 0, 0, fWidth,fheight);
        canvas.toBlob(function(blob){
          form.patchValue({
            avatar: blob
          });
          real.nativeElement.src = canvas.toDataURL();
        }, 'image/jpeg', 0.95);     
      } else {
        ctx.clearRect(0,0,canvas.width, canvas.heigth);
        ctx.drawImage(myImageData, 0,0, myImageData.width, myImageData.height, 0, 0, myImageData.width, myImageData.height);
        canvas.toBlob(function(blob){
          form.patchValue({
            avatar: blob
          });
          real.nativeElement.src = canvas.toDataURL();
        }, 'image/jpeg', 0.95);     
      }
    }
  }


  //Get Base64 from reader and then resize to max size by scaling and croping
  //Sets the avatar to the new blob
  //Updates the canvas
  resizeAndCropImageToSpecificSize(image, destSize) {
    var form = this.parentForm;
    var real = this.realImgElem;
    var myImageData = new Image();
    myImageData.src = image;
    var canvas = this.shadowCanvasElem.nativeElement;
    var ctx =canvas.getContext('2d');
    myImageData.onload = function () {
      var sourceSize;
      var sourceWidth = myImageData.width;
      var sourceHeight = myImageData.height;
      if (sourceWidth>=sourceHeight) {
          var sourceX = (sourceWidth - sourceHeight)/2;
          var sourceY = 0;
          sourceSize=sourceHeight;
      } else {
          var sourceX = 0;
          var sourceY = (sourceHeight - sourceWidth)/2;
          sourceSize=sourceWidth;
      }
      canvas.width = destSize;
      canvas.height= destSize;
      ctx.clearRect(0,0,canvas.width, canvas.heigth);
      ctx.drawImage(myImageData, sourceX,sourceY, sourceSize, sourceSize, 0, 0, destSize,destSize);
      canvas.toBlob(function(blob){
        form.patchValue({
          avatar: blob
        });
        real.nativeElement.src = canvas.toDataURL();
      }, 'image/jpeg', 0.95);
    }
  }



//Rotate the image by rotating the canvas
rotateImage() {
    var form = this.parentForm;
    var angle = Math.PI / 2;
    var canvas = this.shadowCanvasElem.nativeElement;
    var img = this.shadowImgElem.nativeElement;
    var result = this.realImgElem.nativeElement;
    var ctx =canvas.getContext('2d');
    var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    myImageData = new Image();
    myImageData.src = canvas.toDataURL();

    myImageData.onload = function () {
      var cw = canvas.width;
      var ch = canvas.height;
      ctx.save();
      // translate and rotate
      ctx.translate(cw, ch / cw);
      ctx.rotate(angle);
      // draw the previows image, now rotated
      ctx.drawImage(myImageData, 0, 0);   
      canvas.toBlob(function(blob){
        form.patchValue({
          avatar: blob
        });  
      });      
      result.src = canvas.toDataURL();
      ctx.restore();
      // clear the temporary image
      myImageData = null;       
    }

}

} //End of component 