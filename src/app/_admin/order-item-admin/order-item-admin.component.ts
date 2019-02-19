import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Order } from '../../_models/order';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { DeviceDetectorService } from 'ngx-device-detector';

import { Subscription } from 'rxjs';
import { ApiService } from '../../_services/api.service';
import { SpinnerOverlayService } from '../../_library/spinner-overlay.service';

@Component({
  selector: 'app-order-item-admin',
  templateUrl: './order-item-admin.component.html',
  styleUrls: ['./order-item-admin.component.scss']
})
export class OrderItemAdminComponent implements OnInit {

  @Input() order : Order = new Order();
  @Output() onUpdatedStatus = new EventEmitter<Order>();
  validation_messages = CustomValidators.getMessages();
  isMobile = this.device.isMobile();
  private _subscriptions : Subscription[] = new Array<Subscription>();


  myForm: FormGroup; 
  constructor(private api : ApiService, private spinner : SpinnerOverlayService,private device: DeviceDetectorService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.myForm =  new FormGroup({    
      status: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      tracking:new FormControl('', Validators.compose([
        Validators.minLength(11),
        Validators.maxLength(15)
      ])),
    });   
    this.myForm.controls["status"].setValue(this.order.status);
    this.myForm.controls["tracking"].setValue(this.order.tracking);
  }

  //Modify the status of the order
  onStatusSubmit(result:any) {
      this.spinner.show();
      this._subscriptions.push(this.api.updateOrderStatus(this.order.id, result.status, result.tracking).subscribe(res => {
        this.spinner.hide()
        //Update the order with the result
        this.order = res;
        this.onUpdatedStatus.emit(res);
      },()=>this.spinner.hide()));
  }

  //Get back original value
  onStatusReset() {
    this.myForm.reset();
    this.myForm.controls["status"].setValue(this.order.status);
    this.myForm.controls["status"].setValue(this.order.tracking);
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }   
}
