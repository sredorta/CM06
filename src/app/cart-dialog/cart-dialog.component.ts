import { Component, OnInit } from '@angular/core';
import {Cart, CartItem} from '../_models/cart';
import {Product} from '../_models/product';
import {DataService} from '../_services/data.service';
import {ApiService, IApiProduct, EApiImageSizes} from '../_services/api.service';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {
  cart : Cart = new Cart(null);
  products : Product[] = [];
  size : EApiImageSizes = EApiImageSizes.medium;  //We use medium as it´s already loaded
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  //count : number[] = [];
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, private api : ApiService, public spinner : SpinnerOverlayService) { }

  ngOnInit() {
    this.getProducts();
  }


  getProducts() {
    if (this.data.getProducts().length>0) {
      this.initCart();
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
        this.data.setProducts(res,true);
        this.initCart();
        this.spinner.hide();
      }, () => this.spinner.hide()));
    }
  } 

  initCart() {
    this.cart.fromStorage();
    let i = 0;
    for (let item of this.cart.data) {
      this.products.push(new Product(this.data.getProducts().find(obj => obj.id == item.id)));
      //this.count[i] = item.quantity;
      i = i + 1;
    }
    console.log("This is your cart !!!");
    console.log(this.cart);
    //console.log(this.count);
  }

  getImageUrl(product: Product) {
    if (product.getImages(this.size)[0] == undefined) {
      return "url(" + this.defaultImage + ")";
    }
    return "url(" + product.getImages(this.size)[0] + ")";

  }

  //Increments counter of the specific index
  plusCount(index:number) {
    if (this.products[index].stock > this.cart.data[index].quantity) {
      this.cart.data[index].quantity++;
      this.cart.toStorage();
    }
  }

  //Decrements counter of the specific index
  minusCount(index:number) {
    if (this.cart.data[index].quantity>0) {
      this.cart.data[index].quantity--;
      this.cart.toStorage();
    }
  }

  //Estimate the price depending on total weight
  //TODO
  getLivraison() {
    return 100;
  }
  getTotal() {
    let result = 0;
    let i = 0;
    for (let product of this.products) {
      result = result + product.getFinalPrice()*this.cart.data[i].quantity;
      i++;
    }
    return result;
  }


  //Remove item from cart
  removeItem(index:number) {
    this.cart.remove(this.cart.data[index]);
    this.products.splice(index,1);
    this.data.setCartCount(this.cart.getCount());
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}