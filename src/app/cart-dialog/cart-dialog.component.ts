import { Component, OnInit } from '@angular/core';
import {Cart, CartItem} from '../_models/cart';
import {Product} from '../_models/product';
import {DataService} from '../_services/data.service';
import {Config, EApiConfigKeys} from '../_models/config';
import {ApiService, IApiProduct, EApiImageSizes} from '../_services/api.service';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
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
      let obj = this.data.getProducts().find(obj => obj.id == item.id);
      if (obj != undefined) {
        this.products.push(new Product(this.data.getProducts().find(obj => obj.id == item.id)));
        i = i + 1;
      } else {
        //Product has been removed so we update the cart
        this.cart.remove(item);
      }
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
  getDeliveryPrice() {
    if (this.cart.getWeight()<=2) 
      return this.config.get(EApiConfigKeys.delivery1);
    if (this.cart.getWeight()<=10)  
      return this.config.get(EApiConfigKeys.delivery2);
//    if (this.cart.getWeight()<=30)
    return this.config.get(EApiConfigKeys.delivery3);  
    //return this.cart.getWeight();
  }

  //Return if cart is deliverable
  isDeliverable() {
    if (this.products.find(obj => obj.isDeliverable == false)!= undefined) return false;
    if (this.cart.getWeight()>30) return false;
    return true;
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