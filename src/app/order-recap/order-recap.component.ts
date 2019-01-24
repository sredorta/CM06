import { Component, OnInit, Input, Output,EventEmitter, SimpleChanges } from '@angular/core';
import { Order } from '../_models/order';
import {Cart} from '../_models/cart';
import {Product} from '../_models/product';
import {Config, EApiConfigKeys} from '../_models/config';
import {MobileFormatPipe} from '../_pipes/mobile-format.pipe';
import {ApiService, EApiImageSizes, IApiProduct, IApiOrder} from '../_services/api.service';
import {DataService} from '../_services/data.service';
import { Subscription } from 'rxjs';
import { SpinnerOverlayService } from '../_library/spinner-overlay.service';

@Component({
  selector: 'app-order-recap',
  templateUrl: './order-recap.component.html',
  styleUrls: ['./order-recap.component.scss']
})
export class OrderRecapComponent implements OnInit {
  config : Config = new Config(this.data.getConfig());
  products : Product[] = [];
  size : EApiImageSizes = EApiImageSizes.medium;  //We use medium as it´s already loaded
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  spinner :boolean = true;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  @Input() order : Order;
  @Input() trigger : number = 0;

  constructor(private api : ApiService, private data : DataService) { }

  // We check first order by sending to API check order (i.e.: like create order but without creation)
  // The check order returns all prices and details that we show here
  // If there is a cart change then we redo a check order
  // We will go to payment after and if payment is accepted then we do the create order

  ngOnInit() {
    this._subscriptions.push(this.data.getCart().subscribe(res => {
      this.order.cart = res;
      this.checkOrder();
    }));
  }

  //When trigger changes we recheck the order
  ngOnChanges(changes : SimpleChanges) {
    this.checkOrder();
  }

  //Sends all data to api and gets as if order was done
  checkOrder() {
    if(this.order.delivery!=undefined) { //Only check if delivery is set
      this.spinner = true;
      this._subscriptions.push(this.api.checkOrder(this.order).subscribe((res: IApiOrder) => {
        console.log("Result of checkOrder :");
        console.log(res);
  /*      this.data.setProducts(res,true);
        this.initCart();*/
        this.spinner = false;
      }, () => this.spinner = false));  
    }
  }
/*
  initCart() {
      let i = 0;
      this.products = [];
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

  getImageUrl(product: Product) {
    if (product.getImages(this.size)[0] == undefined) {
      return "url(" + this.defaultImage + ")";
    }
    return "url(" + product.getImages(this.size)[0] + ")";

  }


  //Return if cart is deliverable
  isDeliverable() {
    if (this.products.find(obj => obj.isDeliverable == false)!= undefined) return false;
    if (this.cart.getWeight()>30) return false;
    return true;
  }

  //Estimate the price depending on total weight
  getDeliveryPrice() {
    if (this.cart.getWeight()<=2) 
      return this.config.get(EApiConfigKeys.delivery1);
    if (this.cart.getWeight()<=10)  
      return this.config.get(EApiConfigKeys.delivery2);
    return this.config.get(EApiConfigKeys.delivery3);  
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

  getFinalPrice() {
    if (this.isDeliverable())
      return this.getTotal() + parseFloat(this.getDeliveryPrice());
    else
    return this.getTotal();
  }

  goToPayment() {
    //TODO add emit here of the total to pay and any other things
    console.log("Payment !!");
  }
*/
  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
