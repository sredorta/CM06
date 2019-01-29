import { Component, OnInit, Input } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { Order } from '../_models/order';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  @Input() order : Order;
  public payPalConfig?: PayPalConfig;
  constructor() { }

  ngOnInit() {
    console.log("ORDER IS:");
    console.log(this.order);
    console.log("TOTAL IS : " + this.order.total);
    this.initConfig();
    }

    private initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: environment.payPalKey,
        },
        button: {
          label: 'paypal',
        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete');
          console.log(data);
          console.log(actions);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: (err) => {
          console.log('OnError');
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
  
}

