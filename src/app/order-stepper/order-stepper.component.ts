import { Component, OnInit, ViewChild } from '@angular/core';
import { MatVerticalStepper } from '@angular/material';
import { IApiModel,IApiBrand, IApiProduct } from '../_services/api.service';
import {DataService} from '../_services/data.service';
import {ApiService} from '../_services/api.service';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Order } from '../_models/order';
@Component({
  selector: 'app-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrls: ['./order-stepper.component.scss']
})
export class OrderStepperComponent implements OnInit {
  @ViewChild('stepper') stepper: MatVerticalStepper;
  step : number = 1;              //Current complted step
  user : User;                    //User if connected
  order : Order = new Order();//We store here the order
  finalOrder: Order = new Order(); //Final order not modifiable before payment
  triggerChange : number = 0;
  isEditable : boolean = true;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data : DataService) { }

  ngOnInit() {
    //If we are logged in we skip pass one
    this._subscriptions.push(this.api.getAuthUser().subscribe(res=> {
      this.user = new User(res);
      if (this.user.isAvailable()) {
        this.order.user_id = this.user.id;
        this.order.firstName = this.user.firstName;
        this.order.lastName = this.user.lastName;
        this.order.mobile = this.user.mobile;
        this.order.email = this.user.email;
        this.nextStep();
      }
    }));
  }
  ngAfterViewInit() {

  }

  //When first step is completed without having a user we get here
  onDataReady(data:any) {
    this.order.user_id = null;
    this.order.firstName = data.firstName;
    this.order.lastName = data.lastName;
    this.order.mobile = data.mobile;
    this.order.email = data.email;
    this.nextStep();
  }
  //When address is ready
  onAddressReady(data:any) {
    this.order.delivery = data.delivery;
    this.order.address1 = data.address1;
    this.order.address2 = data.address2;
    this.order.city = data.city;
    this.order.cp = data.cp;
    this.triggerChange++; //Force onChanges to work !
    this.nextStep();
  }

  onOrderReady(order:Order) {
    this.finalOrder = order;
    this.isEditable = false; //Not allow changes from now
    this.nextStep();
  }

  onPaymentReady(order:Order) {
    this.nextStep();
    this.data.forceProductsReload(); //Forces products to be reload on next time we go to pieces...
  }

  //Go to nextStep
  nextStep() {
      this.step = this.step+1;
      setTimeout(()=> { this.stepper.next();}, 200);
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}
