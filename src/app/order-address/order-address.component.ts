import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators } from '../_helpers/custom.validators';
import { MatCheckboxChange } from '@angular/material';
import { trigger, style, transition, animate, group,query,stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.scss'],
  animations: [
    trigger('animation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), {optional: true}),
        query(':enter',
          animate('0.6s ease-in', keyframes([
            style({opacity: 0, height:"0%", offset: 0}),
            style({opacity: 1, height:"100%", offset: 1.0}),
          ])), {optional: true}),
        query(':leave', 
            animate('0.6s ease-out', keyframes([
              style({opacity: 1, height:"100%", offset: 0}),
              style({opacity: 0, height:"0%",    offset: 1.0}),
            ])), {optional: true})
      ])
    ])
  ]
})
export class OrderAddressComponent implements OnInit {
  checked:boolean = false;
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
      cp: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),      
    });
  }

  deliveryCheckbox(checkbox : MatCheckboxChange) {
    this.checked = checkbox.checked;
  }

  //When address is submitted
  onSubmit(value) {
    if (this.myForm.invalid) return;
    value.delivery = true;
    this.data.emit(value);
  }

  noDelivery() {
    this.data.emit({delivery:false});
  }

}
