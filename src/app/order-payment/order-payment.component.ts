import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType, IPayPalButtonStyle } from 'ngx-paypal';
import { Order } from '../_models/order';
import {Cart} from '../_models/cart';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { DataService } from '../_services/data.service';

//declare let paypal:any;

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
/*  paypalLoad :boolean = true;
  addScript : boolean = false;
  payPalConfig = {
    commit: true,
    client: {
      sandbox: environment.payPalKey,
      production: '<your prod key>',
    },
    button: {
      label: 'paypal',
      size: 'responsive',
      fundingicons: true,
      branding: true

    },
    onAuthorize:  function(data) {
      return paypal.request.post(environment.apiURL, {
      paymentID: data.paymentID,
      payerID: data.payerID
      }).then(function() {
      // The payment is complete!
      // You can now show a confirmation message to the customer
      alert("Felicidades! El pago fue realizado.");
      }).catch(function(err) {
      console.log(err);
      });
      console.log(" Data " + data);
      },

    payment : function() {
      return paypal.request.post(CREATE_PAYMENT_URL).then(function(data) {
      
      //console.log(" ID del pago retornado: " + data);
      console.log(CREATE_PAYMENT_URL);
      return data.id;
      });
    },
    onPaymentComplete: (data, actions) => {

    },
    onCancel: (data, actions) => {
      this.error = true;
    },
    onError: (err) => {
      this.error = true;
    },
    experience: {
      noShipping: true,
      brandName: 'Casse Moto 06'
    },

    transactions: [{
      amount: {
        currency: 'EUR',
        total: 20, //this.order.total,
      }
    }]
  };*/


  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data: DataService) { }

  ngOnInit() {
    this.initConfig();
  }



  ngAfterViewInit() {
/*    if (!this.addScript) {
      this.addPaypalScript().then(()=> {
        paypal.Button.render(this.payPalConfig, '#paypal-checkout-button');
        this.paypalLoad = false;
      })
    }*/
    setTimeout(()=>this.initConfig());
  }

  //Adds paypalScript at the bottom of the body
/*  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject)=> {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }*/

    private initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: environment.payPalKey,
          production: '<your prod key>',
        },
        button: {
          label: 'paypal',
          size: 'responsive',
          fundingicons: true,
          branding: true

        },
        onPaymentComplete: (data, actions) => {
          this.order.paypalOrderId = data.orderID;
          this.order.paypalPaymentId = data.paymentID;
          this.createOrder();
        },
        onCancel: (data, actions) => {
          this.error = true;
        },
        onError: (err) => {
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

