import { Component, OnInit, ViewChild, Input,ElementRef, Output, EventEmitter} from '@angular/core';
import { IApiBrand, IApiModel, IApiProduct, ApiService, EApiImageSizes, IApiAttachment } from '../../_services/api.service';
import { DataService } from '../../_services/data.service';
import { Router} from '@angular/router';

import {SearchBrandComponent} from '../../_library/search-brand/search-brand.component';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { Subscription } from 'rxjs';
import {OnlyNumberDirective} from '../../_directives/onlyNumber.directive';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {Product} from '../../_models/product';
import {CurrencyFormatPipe} from '../../_pipes/currency-format.pipe';
import {CurrencyFormatDirective} from '../../_directives/currency-format.directive';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';

@Component({
  selector: 'app-product-create-update',
  templateUrl: './product-create-update.component.html',
  styleUrls: ['./product-create-update.component.scss']
})
export class ProductCreateUpdateComponent implements OnInit {
  @Input() brand : IApiBrand;
  @Input() model : IApiModel;
  @Input() currentProduct : IApiProduct; //Current product for update
  @Output() productUpdated = new EventEmitter<Boolean>();

  @ViewChild('imagesCreate') imagesElem : InputImagesComponent;           //File input element
  //Forms
  validation_messages = CustomValidators.getMessages();
  myForm: FormGroup; 
  products : IApiProduct[] = null;
  product : Product = new Product(null);
  stock : number = 1;
  images : IApiAttachment[] = [];

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data : DataService, private router : Router, private spinner: SpinnerOverlayService) { }

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
        Validators.minLength(1),
        Validators.maxLength(7)
      ])),  
      discount: new FormControl('', Validators.compose([
        Validators.minLength(0),
        Validators.maxLength(7)
      ])),  
      stock: new FormControl('', Validators.compose([])),    
      isVehicle: new FormControl('', Validators.compose([])),  
      images: new FormControl(null,null),
    });   
    this.myForm.controls['isVehicle'].setValue(false); 

    //If there is an input product then we set all fields
    if (this.currentProduct) {
      this.product = new Product(this.currentProduct);
      this.myForm.controls['title'].setValue(this.product.title);
      this.myForm.controls['description'].setValue(this.product.description);
      this.myForm.controls['price'].setValue(this.product.price);
      this.myForm.controls['discount'].setValue(this.product.discount);
      this.stock = this.product.stock;
      this.images = [];
      for(let image of this.product.images) {
          this.images.push(image.sizes['full'].url);
      }
      this.product.images = this.images;
      this.myForm.valueChanges.scan
      this.myForm.controls['isVehicle'].setValue(this.product.isVehicle);
    } else {
      this.images = null;
    }

    //Subscribe to form changes to update the product preview
    this._subscriptions.push(this.myForm.valueChanges.subscribe(res => {
      let id = this.product.id;
      this.product = new Product(res);
      this.product.id = id;
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
    if (!value.discount) value.discount = 0;
    //this.myForm.disable();
    this.spinner.show();
    if (!this.currentProduct)
      this._subscriptions.push(this.api.createProduct(this.model.id,value.title,value.description,value.price,value.discount,value.stock,value.isVehicle,value.images).subscribe((res: IApiProduct) => {
        this.spinner.hide();
        this.products = this.data.getProducts();
        this.products.push(res);
        this.data.setProducts(this.products);
        this.router.navigate(["/admin-products"]);
      }, () => this.spinner.hide()));
    else {
      //Case of update product
      this._subscriptions.push(this.api.updateProduct(this.currentProduct.id,value.title,value.description,value.price,value.discount,value.stock,value.isVehicle,value.images).subscribe((res: IApiProduct) => {
        this.spinner.hide();
        this.products = this.data.getProducts();
        const itemIndex = this.products.findIndex(obj => obj.id === this.currentProduct.id);
        this.products[itemIndex] = res;
        this.data.setProducts(this.products);
        this.router.navigate(["/admin-products"]);
        this.productUpdated.emit(true);
      }, () => this.spinner.hide()));     
    }
      
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
