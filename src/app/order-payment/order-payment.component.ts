import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType, IPayPalButtonStyle } from 'ngx-paypal';
import { Order } from '../_models/order';
import {Cart} from '../_models/cart';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  @Input() order : Order;
  @Output() result = new EventEmitter<Order>();

  error: boolean = false;
  errorAjax:boolean = false;

  public payPalConfig?: PayPalConfig;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data: DataService) { }

  ngOnInit() {
    console.log("ORDER IS:");
    console.log(this.order);
    console.log("TOTAL IS : " + this.order.total);
    //this.initConfig();
  }



  ngAfterViewInit() {
    setTimeout(()=>this.initConfig());
  }
    private initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: environment.payPalKey,
        },
        button: {
          label: 'paypal',
          size: 'responsive',
          fundingicons: true,
          branding: true

        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete');
          console.log(data);
          console.log(actions);
          this.order.paypalOrderId = data.orderID;
          this.order.paypalPaymentId = data.paymentID;
          this.createOrder();
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
          this.error = true;
        },
        onError: (err) => {
          console.log('OnError');
          this.error = true;
        },
        experience: {
          noShipping: true,
          brandName: 'Casse Moto 06'
        },

        transactions: [{
          amount: {
            currency: 'EUR',
            total: this.order.total,
          }
        }]
      });
  }
  
  private createOrder() {
        //Create a preliminary order
        this._subscriptions.push(this.api.createOrder(this.order).subscribe(res=> {
          console.log("Order !!!");
          console.log(res);
          //empty the cart
          let cart = new Cart();
          cart.empty;
          this.data.setCart(cart);
          this.result.emit(this.order);
        }, err => {
          this.errorAjax = true;
        }));
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}

