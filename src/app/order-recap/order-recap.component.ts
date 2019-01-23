import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Order } from '../_models/order';
import {Cart} from '../_models/cart';
import {Product} from '../_models/product';
import {ApiService, EApiImageSizes, IApiProduct} from '../_services/api.service';
import {DataService} from '../_services/data.service';
import { Subscription } from 'rxjs';
import { SpinnerOverlayService } from '../_library/spinner-overlay.service';

@Component({
  selector: 'app-order-recap',
  templateUrl: './order-recap.component.html',
  styleUrls: ['./order-recap.component.scss']
})
export class OrderRecapComponent implements OnInit {
  cart = new Cart();
  products : Product[] = [];
  size : EApiImageSizes = EApiImageSizes.medium;  //We use medium as it´s already loaded
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  spinner :boolean = true;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  @Input() order : Order;
  constructor(private api : ApiService, private data : DataService) { }

  ngOnInit() {
    //this.getProducts();
  }
  getProducts() {
    if (this.data.getProducts().length>0) {
      this.initCart();
    } else {
      this.spinner = true;
      this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
        this.data.setProducts(res,true);
        this.initCart();
        this.spinner = false;
      }, () => this.spinner = false));
    }
  } 

  initCart() {
    this.cart.fromStorage();
    let i = 0;
    for (let item of this.cart.data) {
      let obj = this.data.getProducts().find(obj => obj.id == item.id);
      if (obj != undefined) {
        this.products.push(new Product(this.data.getProducts().find(obj => obj.id == item.id)));
        i = i + 1;
      } else {
        //Product has been removed so we update the cart
        this.cart.remove(item);
      }
    }
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  

}
