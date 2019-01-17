import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService, IApiProduct, EApiImageSizes } from '../_services/api.service';
import { DataService } from '../_services/data.service';
import {Product} from '../_models/product';
import { GalleryComponent } from '../_library/gallery/gallery.component';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {CustomValidators, ParentErrorStateMatcher  } from '../_helpers/custom.validators';
import {OnlyNumberDirective} from '../_directives/onlyNumber.directive';
import { TranslateService } from '@ngx-translate/core';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import {Cart, CartItem} from '../_models/cart';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.scss']
})
export class ProductItemDetailComponent implements OnInit {
  id:number;
  product : Product = new Product(null);
  images : string[] = [];
  disable : boolean = false;
  myForm: FormGroup; 
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private route: ActivatedRoute, 
              private api: ApiService, 
              private data : DataService,
              private spinner : SpinnerOverlayService) { }

  ngOnInit() {
    this.myForm =  new FormGroup({    
      quantity: new FormControl('', Validators.compose([])),    
    });   
    this.myForm.controls['quantity'].setValue(1); 
    this._subscriptions.push(this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getProduct();
    }));   

    //Make sure that we do not try to order more than stock available
    this._subscriptions.push(this.myForm.statusChanges.subscribe(res=> {
      if (this.myForm.get('quantity').value >  this.product.stock) {
          this.myForm.controls['quantity'].setValue(this.product.stock); 
      }
      if (this.myForm.get('quantity').value == 0) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    }))
  }

  getProduct() {
    if (this.data.getProducts().length>0) {
      let myProduct = this.data.getProducts().find(obj => obj.id == this.id);
      this.product = new Product(myProduct);
      this.images = this.product.getImages(EApiImageSizes.large);
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getProduct(this.id).subscribe(res => {
        this.product = new Product(res);
        this.images = this.product.getImages(EApiImageSizes.large);
        this.spinner.hide();
      },()=> this.spinner.hide()));
    }
  }

  //Add to cart the element
  onSubmit() {
      let cart = new Cart(null);
      cart.fromStorage();
      cart.add(new CartItem({id:this.product.id,quantity:this.myForm.controls["quantity"].value}));    
      this.data.setCartCount(cart.getCount());
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
