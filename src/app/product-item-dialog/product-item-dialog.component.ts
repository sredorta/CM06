import { Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';

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
    for (let image of this.product.images) {
      this.images.push({source: image.sizes[EApiImageSizes.big].url, alt: image.alt_text, title: "Test Title"});
    }
  }

}
