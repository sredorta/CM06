import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import {TermsDialogComponent} from '../_auth/terms-dialog/terms-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router} from '@angular/router';

import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import { DataService } from '../_services/data.service';
import {FormGroup,FormControl,Validators, FormBuilder} from '@angular/forms';
import {CustomValidators } from '../_helpers/custom.validators';
import { SpinnerOverlayService } from '../_library/spinner-overlay.service';
import { User } from '../_models/user';
import { Order } from '../_models/order';
import {Cart} from '../_models/cart';
import { environment } from '../../environments/environment';
import { EventListener } from '@angular/core/src/debug/debug_node';



@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  @ViewChild('purchase') purchase : ElementRef;
  myForm: FormGroup; 
  validation_messages = CustomValidators.getMessages();
  user : User = new User(null);
  order : Order = new Order(null);
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  cartAvailable : boolean = false;
  checked: boolean = false;

  showCVV : boolean = false;

  error: boolean = false;
  errorAjax:boolean = false;

  /*CARD PART*/
  card:any;
  isCardFilled : boolean = false;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, 
              private data: DataService, 
              private spinner: SpinnerOverlayService,
              private fb: FormBuilder,
              public dialog: MatDialog, 
              private router : Router) { }

  ngOnInit() {
    this.order.delivery = true; //Expect delivery to true initially

    this.createForm();
    //If we are logged in fill the personal data part
    this._subscriptions.push(this.api.getAuthUser().subscribe(res=> {
      this.user = new User(res);
        if (this.user.isAvailable()) {
          this.myForm.controls['firstName'].patchValue(this.user.firstName);
          this.myForm.controls['lastName'].patchValue(this.user.lastName);
          this.myForm.controls['mobile'].patchValue(this.user.mobile);
          this.myForm.controls['email'].patchValue(this.user.email);
          this.myForm.controls['cardName'].patchValue((this.user.firstName + " " + this.user.lastName).toUpperCase());

          this.order.user_id = this.user.id;
          this.order.firstName = this.user.firstName;
          this.order.lastName = this.user.lastName;
          this.order.mobile = this.user.mobile;
          this.order.email = this.user.email;
        }
    }));



    this._subscriptions.push(this.data.getCart().subscribe(res => {
          this.order.cart = res;
          this.checkOrder();
    }));


        // Only mount the element the first time
        if (!this.card) {
          this.card = elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '14px',
                '::placeholder': {
                  color: '#CFD7E0'
                },
              }
            }
          });
          this.card.mount('#card-element');
        }
        //Detect card changes and set variable to say that card is filled correctly
        let obj = this;
        this.isCardFilled = true;
        /* CHANGE THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.card.on('change', function(event) {
          if (event.complete && event.error == undefined) {
            obj.isCardFilled = true;
          } else {
            obj.isCardFilled = false;
          }
        })*/

        //Not sure if required
        stripe._betas = ['payment_intent_beta_3'];

        console.log(this.purchase);
        this.purchase.nativeElement.addEventListener('click', function(ev) {
          console.log("Button clicked");
          console.log(ev);
          stripe.handleCardPayment(
            'test', this.card, {
              source_data: {
                owner: {
                  name: 'Jane Doe',
                  email: 'janedoe@example.com',
                  address: {
                    line1: '123 Foo St.',
                    postal_code: '94103',
                    country: 'US'
                  }
                }
              }
            }
          ).then(function(result) {
            console.log("HERE IS THE RESULT OF PAYMENT:");
            console.log(result);
            if (result.error) {
              // Display result.error.message in your UI.
            } else {
              // The payment has succeeded. Display a success message.
            }
          });
        });

  }

  createForm() {
    this.myForm = this.fb.group({
      firstName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),         
      mobile: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),       
        CustomValidators.validMobile
      ])),       
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      delivery: new FormControl(false, Validators.compose([
        Validators.required])),
      address1: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200)
      ])),
      address2: new FormControl('', Validators.compose([
        Validators.maxLength(200)
      ])),         
      city: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])),       
      cp: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])),        
      cardName: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  //Disable all address fields 
  disableAddressFields() {
    this.myForm.controls['address1'].disable();
    this.myForm.controls['address2'].disable();
    this.myForm.controls['city'].disable();
    this.myForm.controls['cp'].disable();
  }

  //Enable all address fields
  enableAddressFields() {
    this.myForm.controls['address1'].enable();
    this.myForm.controls['address2'].enable();
    this.myForm.controls['city'].enable();
    this.myForm.controls['cp'].enable();
  }




  //Returns if CardNameHolder is invalid for adding class
  getCardNameInvalid() : boolean {
    let result = false;
    for(let validation of this.validation_messages) {
      if (this.myForm.get('cardName').hasError(validation.type) && (this.myForm.get('cardName').dirty)) result = true;
    }
    return result;

  }

  //Opens the dialog of the CGV
  openCGVDialog() {
    let dialogRef = this.dialog.open(TermsDialogComponent, {
      panelClass: 'signup-dialog',
      width: '98%',
      height: '98%',
      data:  null 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.router.navigate([""]);
      }
      //this.myForm.patchValue({"terms" : result});
    });
  }

  //Sends all data to api and gets as if order was done
  checkOrder() {
    this.order.cart.fromStorage()
    if(this.order.cart.data.length>0) { //Only check if we have items and purge any 0 items
      this.spinner.show();
      this._subscriptions.push(this.api.checkOrder(this.order).subscribe((res: any) => {
        this.order.cart = new Cart(res.cart);
        this.order.cart.deliveryCost = res.deliveryCost;
        this.order.cart.price = res.price;
        this.order.cart.isWeightExceeded = res.isWeightExceeded;
        this.order.total = res.total;
        if (this.order.cart.isWeightExceeded) {
          this.order.delivery = false;
          this.myForm.controls['delivery'].patchValue('false');
          this.myForm.controls['delivery'].disable({onlySelf:true,emitEvent:false});
          this.disableAddressFields();
          this.checked = true;
        }
        this.spinner.hide();
        this.cartAvailable = true;
      }, () => this.spinner.hide()))  
    }
  }

  getImageUrl(url:string) {
    if (url==undefined || url == "") {
      return "url(" + this.defaultImage + ")";
    }
    return "url(" + url + ")";
  }

  deliveryCheckbox(checkbox : MatCheckboxChange) {
    this.checked = checkbox.checked;
    if (checkbox.checked) {
      this.disableAddressFields();
      this.order.total = this.order.cart.price;
    } else {
      this.enableAddressFields();
      this.order.total = Number(this.order.cart.price) + Number(this.order.cart.deliveryCost);
      console.log("TOTAL IS: " + this.order.total);
    }
  }

  buy(data) {
    //STEP1: Create a preOrder
    this.order.firstName = data.firstName;
    this.order.lastName = data.lastName;
    this.order.email = data.email;
    this.order.mobile = data.mobile;
    this.order.delivery = !data.delivery;
    if (this.order.delivery) {
      this.order.address1 = data.address1;
      this.order.address2 = data.address2;
      this.order.city = data.city;
      this.order.cp = data.cp;
    } else {
      this.order.address1 = null;
      this.order.address2 = null;
      this.order.city = null;
      this.order.cp = null;
    }

    console.log(this.order);
    console.log("DATA IS:");
    console.log(data);
    this._subscriptions.push(this.api.createOrderIntent(this.order).subscribe(res => {
      console.log(res);
      console.log(stripe);
      stripe.confirmPaymentIntent(
        res.key,
        {
          source: 10,
          use_stripe_sdk: true,
        }
      );
      }));
/*

      stripe.handleCardPayment(
        res.key, this.card, {
          source_data: {
            owner: {
              name: 'Jane Doe',
              email: 'janedoe@example.com',
              address: {
                line1: '123 Foo St.',
                postal_code: '94103',
                country: 'US'
              }
            }
          }
        }
      ).then(function(result) {
        console.log("HERE IS THE RESULT OF PAYMENT:");
        console.log(result);
        if (result.error) {
          // Display result.error.message in your UI.
        } else {
          // The payment has succeeded. Display a success message.
        }
      });
      //Here we have created a preorder and we have the key of the intent of the payment

    }));*/

    //STEP2: Create the payment
/*    const name = this.myForm.get('cardName').value;
    this.stripeService.createToken(this.card, { name }).subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });*/
  }




  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}

