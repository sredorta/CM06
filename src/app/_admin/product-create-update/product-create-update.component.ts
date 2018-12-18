import { Component, OnInit, ViewChild, Input,ElementRef} from '@angular/core';
import { IApiBrand, IApiModel, IApiProduct, ApiService } from '../../_library/services/api.service';
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

  @ViewChild('images') imagesElem : InputImagesComponent;           //File input element
  //Forms
  validation_messages = CustomValidators.getMessages();
  myForm: FormGroup; 
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService) { }

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
      images: new FormControl(null,null),
    });   
    this.myForm.controls['isVehicle'].setValue(false);     
  }

  //On reset form
  onCreateProductReset() {
    this.myForm.reset();
    this.imagesElem.resetImage();
  }

  //On create product
  onSubmit(value) {
    console.log(value);
    if (this.myForm.invalid) {
      return;
    }
    this._subscriptions.push(this.api.createProduct(this.model.id,value.title,value.description,value.price,value.discount,value.stock,value.isVehicle,value.images).subscribe((res: IApiProduct) => {
      console.log("Finished create !");
      console.log(res);
      //this._addBrand(res);
      //this.messageService.add({severity:'success', summary:trans['brands.admin.toast.create.summary'], detail:trans['brands.admin.toast.create.detail']});
    }));
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
