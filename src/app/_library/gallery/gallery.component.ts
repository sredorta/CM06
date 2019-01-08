import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})



export class GalleryComponent implements OnInit {
  @Input() images :string[] = [];
  current:number = 0;
  animate : boolean = false;
  currentElement :HTMLImageElement;
  constructor() { }

  ngOnInit() {
    console.log("We are in app-gallery");
    console.log(this.images);
  }


  isSelected(id) {
    if (this.currentElement)
      if (this.currentElement.attributes['id'])
        if (id == this.currentElement.attributes['id'].value) return true;
        else return false;
      else 
        return false; 
  }

  selectImage(img:HTMLImageElement) { 
    console.log(img);


    this.animate = true;
    setTimeout(()=> {
      this.animate = false;
    },1000);
    setTimeout(()=>{
      this.current = img.attributes['id'].value;
      this.currentElement = img;
    },500);
  }

}
