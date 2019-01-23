import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators } from '../_helpers/custom.validators';

import { User } from '../_models/user';

@Component({
  selector: 'app-order-personal-data',
  templateUrl: './order-personal-data.component.html',
  styleUrls: ['./order-personal-data.component.scss']
})
export class OrderPersonalDataComponent implements OnInit {
  myForm: FormGroup; 
  validation_messages = CustomValidators.getMessages();
  @Input() user : User;
  @Output() data = new EventEmitter<any>();  //Brand selection  

  constructor() { }

  ngOnInit() {
    console.log(this.user);
    this.createForm();
  }
  createForm() {
    this.myForm =  new FormGroup({    
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
      //terms: new FormControl(false,null)
    });
    //this.myForm.controls["terms"].disable();
  }

  onSubmit(value) {
    if (this.myForm.invalid) return;
    this.data.emit(value);
    
  }
}
