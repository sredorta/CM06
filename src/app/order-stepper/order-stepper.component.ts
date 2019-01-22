import { Component, OnInit, ViewChild } from '@angular/core';
import { MatVerticalStepper } from '@angular/material';
import { IApiModel,IApiBrand, IApiProduct } from '../_services/api.service';
import {DataService} from '../_services/data.service';
import {ApiService} from '../_services/api.service';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrls: ['./order-stepper.component.scss']
})
export class OrderStepperComponent implements OnInit {
  @ViewChild('stepper') stepper: MatVerticalStepper;
  step : number = 1;              //Current complted step
  user : User;                    //User if connected
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService) { }

  ngOnInit() {
    //If we are logged in we skip pass one
    this._subscriptions.push(this.api.getAuthUser().subscribe(res=> {
      this.user = new User(res);
      if (this.user.id !=null) {
        this.nextStep();
      }
    }));

  }
  ngAfterViewInit() {

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
