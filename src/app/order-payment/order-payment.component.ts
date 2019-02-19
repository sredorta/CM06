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
        Validators.minLength(2),
        Validators.pattern('[0-9]| +')
      ])),
      ccExpiryMonth: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        Validators.pattern('[0-9]+')
      ])),         
      ccExpiryYear: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern('[0-9]+')
      ])),       
      cvvNumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3), 
        Validators.pattern('[0-9]+')
      ])),
    });
  }

  formatCardNumber(data:string) {
    //Redo the spaces
    let dataTmp= data.replace(/\s/g, "");
    data = "";
    let index = 0;
    for(let char of dataTmp) {
      let lastChar = dataTmp.slice(-1);
      if ('0123456789'.indexOf(lastChar) !== -1) {
        data = data + char;
        if (index == 3 || index == 7 || index == 11) {
          data = data + " ";
        }
        index = index + 1;
      }
    }
    this.myForm.controls['ccNumber'].patchValue(data);
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

