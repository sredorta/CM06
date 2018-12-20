import { Component, OnInit, ViewChild, Input,ElementRef} from '@angular/core';
import { IApiBrand, IApiModel, IApiProduct, ApiService, EApiImageSizes } from '../../_library/services/api.service';
import { DataService } from '../../_services/data.service';
import { Router } from '@angular/router';

import {SearchBrandComponent} from '../../_library/search-brand/search-brand.component';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { Subscription } from 'rxjs';
import {OnlyNumberDirective} from '../../_library/directives/onlyNumber.directive';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {Product} from '../../_library/models/product';

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
  products : IApiProduct[] = null;
  product : Product = new Product(null);

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data : DataService, private router : Router) { }

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

    //Subscribe to form changes to update the product preview
    this._subscriptions.push(this.myForm.valueChanges.subscribe(res => {
      console.log("CHANGES !!");
      console.log(res);
      this.product = new Product(res);
    }));
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
      this.products = this.data.getProducts();
      this.products.push(res);
      this.data.setProducts(this.products);
      this.router.navigate(["/admin-products"]);


      //this.data.
      //this._addBrand(res);
      //this.messageService.add({severity:'success', summary:trans['brands.admin.toast.create.summary'], detail:trans['brands.admin.toast.create.detail']});
    }));
  }

  addToCart() {
    console.log("Adding to cart");
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
