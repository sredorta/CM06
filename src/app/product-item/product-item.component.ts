import { Component, OnInit } from '@angular/core';
import {IApiProduct, EApiImageSizes} from '../_library/services/api.service';
import {Product} from '../_library/models/product';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ProductItemDialogComponent} from '../product-item-dialog/product-item-dialog.component';
import { Subscription } from 'rxjs';
import { ApiService } from '../_library/services/api.service';
import {TooltipModule} from 'primeng/tooltip';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class ProductItemComponent implements OnInit {
  product : Product = new Product(null);
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private dialog: MatDialog, private api : ApiService) { }

  ngOnInit() {
    //For debug only
    this.product.title = "Amortisseur avant titre";
    this.product.description = "Amortisseur avant de 150mm de debatement pour une moto qui dechire";
    this.product.price = 2800;
    this.product.discount = 10;
    this.api.getBrands().subscribe(res => {
/*      this.product.brand = res[0];
      this.api.getModels(this.product.brand.id).subscribe(res => {
        this.product.model = res[0];
        console.log(this.product.model);
      });*/
    });

  }

  showDetailDialog() {
    let dialogRef = this.dialog.open(ProductItemDialogComponent, {
      disableClose :true,
      panelClass : "product-item-dialog",
      data:  {product: this.product} 
    });
    this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
      if (result) {   
        console.log("Result is : " + result);
      } 
    }));        
    console.log("Showing detail dialog");
  }

  addToCart() {
    console.log("Adding to cart");
  }
}
