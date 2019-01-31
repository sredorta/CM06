import { Component, OnInit } from '@angular/core';
import {Cart, CartItem} from '../_models/cart';
import {Product} from '../_models/product';
import {DataService} from '../_services/data.service';
import {Config, EApiConfigKeys} from '../_models/config';
import {ApiService, IApiProduct, EApiImageSizes} from '../_services/api.service';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
import { isTemplateExpression } from 'typescript';
@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {
  config : Config = new Config(this.data.getConfig());
  cart : Cart = new Cart(null);
  products : Product[] = [];
  size : EApiImageSizes = EApiImageSizes.medium;  //We use medium as it´s already loaded
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  loading : boolean = false;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, private api : ApiService, public spinner : SpinnerOverlayService) { }

  ngOnInit() {
    this.initCart();
  }

  initCart() {
    this.cart.fromStorage();
    if (this.cart.data.length>0) {
      this.spinner.show();
      this.loading = true;
      this._subscriptions.push(this.api.checkCart(this.cart).subscribe((res:any)=> {
        this.cart = new Cart(res.cart);
        this.cart.toStorage();
        this.data.setCart(this.cart);
        this.cart.deliveryCost = res.deliveryCost;
        this.cart.price = res.price;
        this.cart.isWeightExceeded = res.isWeightExceeded;
        console.log(this.cart);
        this.spinner.hide();
        this.loading = false;
      },()=> {
        this.spinner.hide();
        this.loading = false;
      }));
    }
  }
  getImageUrl(url:string) {
    if (url==undefined || url == "") {
      return "url(" + this.defaultImage + ")";
    }
    return "url(" + url + ")";
  }


  //Increments counter of the specific index
  plusCount(item:CartItem) {
    if (item.stock > item.quantity) {
      item.quantity++;
      item.tprice = item.quantity * item.price;
      this.cart.toStorage();
      this.data.setCart(this.cart);
    }
  }


  //Decrements counter of the specific index
  minusCount(item:CartItem) {
    
    if (item.quantity>0) {
      item.quantity--;
      item.tprice = item.quantity * item.price;
      this.cart.toStorage();
      this.data.setCart(this.cart);
    }
  }

  getTotal() {
    let result = 0;
    let i = 0;
    for (let item of this.cart.data) {
      result = result + item.tprice;
    }
    return result;
  }


  //Remove item from cart
  removeItem(item:CartItem) {
    this.cart.remove(item);
    this.data.setCart(this.cart);
    this.cart.toStorage();
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}