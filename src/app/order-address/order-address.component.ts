import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators } from '../_helpers/custom.validators';

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.scss']
})
export class OrderAddressComponent implements OnInit {
  myForm: FormGroup; 
  validation_messages = CustomValidators.getMessages();
  @Output() data = new EventEmitter<any>();  //Data send

  constructor() { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.myForm =  new FormGroup({    
      address1: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      address2: new FormControl('', Validators.compose([
      ])),         
      city: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
      ])),       
/*      region: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),*/
      cp: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),      
    });
  }

  onSubmit(value) {
    if (this.myForm.invalid) return;
    this.data.emit(value);
  }

}
