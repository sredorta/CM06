import { Component, OnInit, Input,ViewChildren,QueryList,ElementRef } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';




@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})



export class GalleryComponent implements OnInit {
  @ViewChildren('thumbs') thumbs : QueryList<ElementRef>;

  @Input() images :string[];
  current:number = 0;
  animate : boolean = false;
  currentElement :HTMLImageElement;
  constructor() { }

  ngOnInit() {
    if (this.images.length == 0)
       this.images[0] = "./assets/images/no-photo-available.jpg";
  }

  //Select by default first thumb if they exist
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.thumbs.first)
        this.selectImage(this.thumbs.first.nativeElement.children[0]);
      });
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
