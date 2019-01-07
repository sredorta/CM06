import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import {ApiService} from '../_services/api.service';
import { DeviceDetectorService } from 'ngx-device-detector';

//import {SpinnerComponent} from '../_library/spinner/spinner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isMobile = this.device.isMobile();
  products : Array<Product> = [];
  constructor(private api: ApiService, private route: Router,private device: DeviceDetectorService) { }

  ngOnInit() {
    this.api.getModels().subscribe(res => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!! DEBUG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(res)
    });
    /*for (let product of this.data.getProducts()) {
      this.products.push(new Product(product));
    }*/
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

