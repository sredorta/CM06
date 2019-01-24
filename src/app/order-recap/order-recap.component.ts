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
  spinner :boolean = false;
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
    if (changes.trigger)
      this.checkOrder();
  }

  //Sends all data to api and gets as if order was done
  checkOrder() {
    this.order.cart.fromStorage()
    if(this.order.delivery!=undefined && this.order.cart.data.length>0) { //Only check if delivery is set and we have items
      this.spinner = true;
      this._subscriptions.push(this.api.checkOrder(this.order).subscribe((res: any) => {
        console.log(res);
        this.order.cart = new Cart(res.cart);
        this.order.cart.deliveryCost = res.deliveryCost;
        this.order.cart.price = res.price;
        this.order.cart.isWeightExceeded = res.isWeightExceeded;
        this.order.total = res.total;
        console.log(this.order);
        this.spinner = false;
      }, () => this.spinner = false));  
    }
  }

  getImageUrl(url:string) {
    if (url==undefined || url == "") {
      return "url(" + this.defaultImage + ")";
    }
    return "url(" + url + ")";
  }

  goToPayment() {
    //TODO add emit here of the total to pay and any other things
    console.log("Payment !!");
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
