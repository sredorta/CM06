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
  constructor(private api: ApiService, 
              private route: Router,
              private device: DeviceDetectorService,
              private fb:FacebookService) { }

  ngOnInit() {
    this.api.getModels().subscribe(res => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!! DEBUG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(res)
    });
    /*for (let product of this.data.getProducts()) {
      this.products.push(new Product(product));
    }*/
    let initParams: InitParams = {
      appId: '397476587654542',
      xfbml: true,
      version: 'v2.8'
    };
    //href="https://www.facebook.com/cassemoto/"   fb-iframe-plugin-query="app_id=334341610034299&amp;color_scheme=light&amp;container_width=406&amp;header=false&amp;height=200&amp;href=https%3A%2F%2Fwww.facebook.com%2Fcassemoto%2F&amp;locale=en_US&amp;sdk=joey&amp;show_border=false&amp;show_faces=true&amp;stream=false"><span style="vertical-align: bottom; width: 300px; height: 154px;"><iframe name="f20b78bfb670848" width="1000px" height="200px" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" allow="encrypted-media" title="fb:like_box Facebook Social Plugin" src="https://www.facebook.com/plugins/like_box.php?app_id=334341610034299&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2Fj-GHT1gpo6-.js%3Fversion%3D43%23cb%3Df5730ccb60eccc%26domain%3Dwww.cassemoto06.fr%26origin%3Dhttp%253A%252F%252Fwww.cassemoto06.fr%252Ff38246f7d76b3c%26relation%3Dparent.parent&amp;color_scheme=light&amp;container_width=406&amp;header=false&amp;height=200&amp;href=https%3A%2F%2Fwww.facebook.com%2Fcassemoto%2F&amp;locale=en_US&amp;sdk=joey&amp;show_border=false&amp;show_faces=true&amp;stream=false" style="border: none; visibility: visible; width: 300px; height: 154px;" class=""></iframe></span></div>

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

