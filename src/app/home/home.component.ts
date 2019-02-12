import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import {ApiService} from '../_services/api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { trigger, style, transition, animate, group,query,stagger, keyframes,state } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('headerAnim', [
        state('enter', style({
        })),
        
        state('leave', style({
        })),
        transition('* <=> *', [
          animate('5s ease-in-out', keyframes([
            style({opacity: 0, transform: 'rotateY(90deg)', offset: 0}),
            style({opacity: 1, transform: 'rotateY(0deg)', offset: 0.1}),
            style({opacity: 1, transform: 'rotateY(0deg)', offset: 0.9}),
            style({opacity: 0, transform: 'rotateY(90deg)',  offset: 1}),
          ]))
        ]),      
      ])
    ]
})
export class HomeComponent implements OnInit {
  isMobile = this.device.isMobile();
  products : Array<Product> = [];
  selected :number = 0;  //Used for animations in the gui
  text : string[] = ["home.header1","home.header2","home.header3","home.header4"]
  imgSrc : string = "./assets/images/icon-moto.jpg";

  constructor(private api: ApiService, 
              private route: Router,
              private device: DeviceDetectorService) { }

  ngOnInit() {
 
    //Interval for animations
    setInterval(()=> {
      this.selected = this.selected + 1;
      if (this.selected>3) this.selected = 0;
      switch (this.selected) {
        case 0: this.imgSrc = "./assets/images/icon-moto.jpg"; break;
        case 1: this.imgSrc = "./assets/images/icon-pieces.jpg"; break;
        case 2: this.imgSrc = "./assets/images/icon-pieces-new.jpg"; break;
        case 3: this.imgSrc = "./assets/images/icon-service.jpg"; break;
      }
    },5000);
  }

  //Goes to the route with delay to show animation on mobile
  goToRoute(route:string[]) {
    if (this.isMobile)
      setTimeout( () => {
        this.route.navigate(route);
      },700);
    else 
      this.route.navigate(route);  
  }

  goToMenu() {
    const contentContainer = document.querySelector('.mat-sidenav-content') || window;
    contentContainer.scrollBy(0, 350);
  }

  //Gets correct image 
  getImage(image:string) {
      return "./assets/images/" + image;  
  }
}

