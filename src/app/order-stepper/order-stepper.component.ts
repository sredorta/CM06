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
  triggerChange : number = 0;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService) { }

  ngOnInit() {
    //If we are logged in we skip pass one
    this._subscriptions.push(this.api.getAuthUser().subscribe(res=> {
      this.user = new User(res);
      if (this.user.isAvailable()) {
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
    console.log("WE are in onDataReady");
    this.order.firstName = data.firstName;
    this.order.lastName = data.lastName;
    this.order.mobile = data.mobile;
    this.order.email = data.email;
    this.nextStep();
  }
  //When address is ready
  onAddressReady(data:any) {
    console.log("onAddressReady");
    this.order.delivery = data.delivery;
    this.order.address1 = data.address1;
    this.order.address2 = data.address2;
    this.order.city = data.city;
    this.order.cp = data.cp;
    console.log("ORDER IS:");
    console.log(this.order);
    this.triggerChange++; //Force onChanges to work !
    this.nextStep();
  }

  //Go to nextStep
  nextStep() {
      console.log("nextStep");
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
