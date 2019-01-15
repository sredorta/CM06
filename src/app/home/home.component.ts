import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import {ApiService} from '../_services/api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FacebookService, InitParams } from 'ngx-facebook';
//import {SpinnerComponent} from '../_library/spinner/spinner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isMobile = this.device.isMobile();
  products : Array<Product> = [];
  selected :number = 0;  //Used for animations in the gui
  text : string[] = ["home.header1","home.header2","home.header3","home.header4"]
  imgSrc : string = "./assets/images/icon-moto.jpg";

  constructor(private api: ApiService, 
              private route: Router,
              private device: DeviceDetectorService,
              private fb:FacebookService) { }

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
    },10000);




    //FB part to be moved to footer
    let initParams: InitParams = {
      appId: '397476587654542',
      xfbml: true,
      version: 'v2.8'
    };
    this.fb.init(initParams);
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

  //Gets correct image size depending if is mobile or not
  getImage(image:string) {
    if (this.isMobile)
      return "./assets/images/small/" + image;
    else 
      return "./assets/images/" + image;  
  }
}

