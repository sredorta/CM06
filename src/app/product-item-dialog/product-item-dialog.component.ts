import { Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {GalleriaModule} from 'primeng/galleria';
import { HostListener } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Product } from '../_models/product';
import { EApiImageSizes } from '../_services/api.service';


@Component({
  selector: 'app-product-item-dialog',
  templateUrl: './product-item-dialog.component.html',
  styleUrls: ['./product-item-dialog.component.scss']
})
export class ProductItemDialogComponent implements OnInit {
  screenWidth:number;
  screenHeight:number;
  product: Product = new Product(null);
  images: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.product = this.data.product;
    console.log(this.product);
    for (let image of this.product.images) {
      this.images.push({source: image.sizes[EApiImageSizes.big].url, alt: image.alt_text, title: "Test Title"});
    }
/*    this.images = [];
    this.images.push({source:'assets/images/logo.jpg', alt:'Description for Image 1', title:'Title 1'});
    this.images.push({source:'assets/images/no-photo-available.jpg', alt:'Description for Image 2', title:'Title 2'});
    this.images.push({source:'assets/images/galleria-debug-1.jpg', alt:'Description for Image 3', title:'Title 3'});
    this.images.push({source:'assets/images/galleria-debug-2.jpg', alt:'Description for Image 4', title:'Title 4'});
*/
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
//    this.screenHeight = window.innerHeight * 0.8;
//    this.screenWidth = 0.8 * window.innerWidth -50;
//    console.log("Width : " + this.screenWidth);
}
}
