import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IApiBrand, IApiModel } from '../../_library/services/api.service';
import {SearchBrandComponent} from '../../_library/search-brand/search-brand.component';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { Subscription } from 'rxjs';
import {OnlyNumberDirective} from '../../_library/directives/onlyNumber.directive';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';

@Component({
  selector: 'app-product-create-update',
  templateUrl: './product-create-update.component.html',
  styleUrls: ['./product-create-update.component.scss']
})
export class ProductCreateUpdateComponent implements OnInit {
  @Input() brand : IApiBrand;
  @Input() model : IApiModel;

  //Forms
  validation_messages = CustomValidators.getMessages();
  myForm: FormGroup; 
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor() { }

  ngOnInit() {
    this.myForm =  new FormGroup({    
      title: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.minLength(10)
      ])),     
      price: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])),  
      discount: new FormControl('', Validators.compose([
        Validators.minLength(1)
      ])),  
      stock: new FormControl('', Validators.compose([])),    
      isVehicle: new FormControl('', Validators.compose([])),  
    });        
  }


}
