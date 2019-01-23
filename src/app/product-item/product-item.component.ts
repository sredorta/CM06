import { Component, OnInit, Input } from '@angular/core';
import {IApiProduct, EApiImageSizes} from '../_services/api.service';
import {Product} from '../_models/product';
import {Cart, CartItem} from '../_models/cart';
import {ProductItemDialogComponent} from '../product-item-dialog/product-item-dialog.component';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import {ViewEncapsulation} from '@angular/core';
import { DataService } from '../_services/data.service';
import {CurrencyFormatPipe} from '../_pipes/currency-format.pipe';
import { Router} from'@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class ProductItemComponent implements OnInit {
  @Input() product : Product;           //Product to display
  @Input() preview : boolean = false;   //When we are in preview mode

  defaultImage :string = "./assets/images/no-photo-available.jpg";
  cart : Cart = new Cart(null);

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data : DataService, private router:Router) { }

  ngOnInit() {
  }


  getProductPrimaryImage() {
    if (this.product.images)
      if(this.product.images[0])
        if (!this.preview)
          return this.product.images[0].sizes[EApiImageSizes.medium].url;
        else
          return this.product.images[0];  
    return this.defaultImage;    
  }

  showDetail() {
    if (!this.preview)
      this.router.navigate(["/produit", this.product.id]);
  }



  addToCart() {
    if (!this.preview) {
        console.log("Adding to cart");
        this.cart.fromStorage();
        this.cart.add(new CartItem({id:this.product.id,weight:this.product.weight,quantity:1}));    
        this.data.setCart(this.cart);
    }
  }
}
