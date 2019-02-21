import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ElementRef, ViewChild,NgZone } from '@angular/core';
import { MatCheckboxChange, MatButton } from '@angular/material';
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
import {Observable, of, Subject} from 'rxjs';



@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  //@ViewChild('purchase') purchase : ElementRef;
  myForm: FormGroup; 
  validation_messages = CustomValidators.getMessages();
  user : User = new User(null);
  order : Order = new Order(null);
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  cartAvailable : boolean = false;
  checked: boolean = false;

  showPaymentSuccess : boolean = false;
  showPaymentFail : boolean = false;

  /*CARD PART*/
  card:any;
  isCardFilled : boolean = false;  //Contains if the Card is correctly filled
  cardError : boolean = false;     //Adds class if isCardFilled false and submit
  @ViewChild('card') elem : ElementRef;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, 
              private data: DataService, 
              private spinner: SpinnerOverlayService,
              private fb: FormBuilder,
              public dialog: MatDialog, 
              private router : Router,private ngZone: NgZone) { }

  ngOnInit() {
    this.showPaymentSuccess = true;
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

    //Get the current cart and then check if there are no changes on the products and update it
    this._subscriptions.push(this.data.getCart().subscribe(res => {
          this.order.cart = res;
          this.checkOrder();
    }));
  }


  ngAfterViewInit() {
/*    //Create the creditCard part of Stripe
    if (!this.card) { // Only mount the element the first time
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
    this.card.on('change', function(event) {
          if (event.complete && event.error == undefined) {
            obj.isCardFilled = true;
          } else {
            obj.isCardFilled = false;
          }
          obj.cardError = false ; //Remove additional error class
          console.log(obj.elem.nativeElement);
    });
  */
  }


  //Creates the form that handles everything except the card details
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
      cardName: ['', [Validators.required, Validators.minLength(4)]],
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

  //Gets images of products
  getImageUrl(url:string) {
    if (url==undefined || url == "") {
      return "url(" + this.defaultImage + ")";
    }
    return "url(" + url + ")";
  }
  
  //Handles the show or hide of the address depending on the checkbox
  deliveryCheckbox(checkbox : MatCheckboxChange) {
    this.checked = checkbox.checked;
    if (checkbox.checked) {
      this.disableAddressFields();
      this.order.total = this.order.cart.price;
    } else {
      this.enableAddressFields();
      this.order.total = Number(this.order.cart.price) + Number(this.order.cart.deliveryCost);
    }
  }

  //Do the payment
  buy(data) {
    //STEP0: Validate data
    if (this.myForm.invalid) {
      return;
    }
    if (!this.isCardFilled) {
      console.log("Card not filled");
      this.cardError = true;
      return;
    }
    this.spinner.show();
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
    this._subscriptions.push(this.api.createOrderIntent(this.order).subscribe(res => {

      let obj = this;
      stripe.handleCardPayment(
        res.key, this.card, {
          source_data: {
            owner: {
              name: obj.order.firstName + " " + obj.order.lastName,
              email: obj.order.email,
              phone: obj.order.mobile,
              address: {
                line1: obj.order.address1,
                line2: obj.order.address2,
                city: obj.order.city,
                postal_code: obj.order.cp,
                country: 'FR'                
              }
            }
          },
          receipt_email: obj.order.email
        }
      ).then(function(result) {
        console.log("HERE IS THE RESULT OF PAYMENT:");
        console.log(result);
        if (result.error) {
          obj.showPaymentFail = true;
          obj.spinner.hide();
          obj.router.navigate["/paiement-refusé"];
          // Display result.error.message in your UI.
        } else {
          //Empty the cart
          let cart = new Cart();
          cart.empty();
          obj.data.setCart(cart);
          obj.showPaymentSuccess = true;
          obj.spinner.hide();
          // The payment has succeeded. Display a success message.
        }
    });
    }));
  }




  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
    this.card.destroy(); //Destroy the card
  } 
}

