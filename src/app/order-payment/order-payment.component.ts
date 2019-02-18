import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Order } from '../_models/order';
import {Cart} from '../_models/cart';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { DataService } from '../_services/data.service';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators } from '../_helpers/custom.validators';
import { SpinnerOverlayService } from '../_library/spinner-overlay.service';

//declare let paypal:any;

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  @Input() order : Order;
  @Output() result = new EventEmitter<Order>();
  myForm: FormGroup; 
  validation_messages = CustomValidators.getMessages();
  showCVV : boolean = false;

  error: boolean = false;
  errorAjax:boolean = false;



  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data: DataService, private spinner: SpinnerOverlayService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.myForm =  new FormGroup({    
      ccName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      ccNumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      ccExpiryMonth: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)
      ])),         
      ccExpiryYear: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ])),       
      cvvNumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),  
      ])),
      //terms: new FormControl(false,null)
    });
    //this.myForm.controls["terms"].disable();
  }

  formatCardNumber(data:string) {
    let lastChar = data.slice(-1);
    if ('0123456789'.indexOf(lastChar) !== -1) {
      if (data.length == 4 || data.length == 9 || data.length == 14) {
        data =data + " ";
        this.myForm.controls['ccNumber'].patchValue(data);
      }
    } else {
      //Remove last inserted data
      data = data.substring(0, data.length-1);
      this.myForm.controls['ccNumber'].patchValue(data);
    }
  }

  onSubmit(data) {
    //Remove spaces on ccNumber
    data.ccNumber = data.ccNumber.replace(/\s/g, "");

    //Start the payment and if order is payed create the order...
    this.spinner.show();
    this._subscriptions.push(this.api.createOrder(this.order, data.ccName, data.ccNumber, data.ccExpiryMonth,data.ccExpiryYear, data.cvvNumber).subscribe(res => {
      let cart = new Cart();
      cart.empty;
      this.data.setCart(cart);
      this.result.emit(this.order);
      console.log(res);
      this.spinner.hide();
    },error => {
      console.log(error);
      this.spinner.hide();
    },()=>this.spinner.hide()));

  }
  


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}

