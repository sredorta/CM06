import { Component, OnInit, Input,ViewChildren,QueryList,ElementRef, ViewChild,HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate, group, query,stagger,keyframes } from '@angular/animations';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [
    trigger('galleryAnim', [
        state('enter', style({
          //opacity:1,
          //height:"100%"
        })),
        
        state('leave', style({
          //opacity:0,
          //height:"0%",
        })),
        transition('enter <=> leave', [
          animate('1s ease-in-out', keyframes([
            style({opacity: 1, transform: 'rotateY(0deg)', offset: 0}),
            style({opacity: 0, transform: 'rotateY(90deg)', offset: 0.3}),
            style({opacity: 0, transform: 'rotateY(90deg)', offset: 0.6}),
            style({opacity: 1, transform: 'rotateY(0deg)',  offset: 1}),
          ]))
        ])
      ])
    ]
})


export class GalleryComponent implements OnInit {
  @ViewChildren('thumbs') thumbs : QueryList<ElementRef>;
  @Input() images :string[];
  current:number = 0;
  currentElement :HTMLImageElement;
  state = "start";
  startHeight :number;
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
    this.state=="enter"?this.state = "leave":this.state="enter";

    setTimeout(()=>{
      this.current = img.attributes['id'].value;
      this.currentElement = img;
    },500);
  }

}
