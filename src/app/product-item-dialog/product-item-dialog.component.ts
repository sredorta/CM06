import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-item-dialog',
  templateUrl: './product-item-dialog.component.html',
  styleUrls: ['./product-item-dialog.component.scss']
})
export class ProductItemDialogComponent implements OnInit {

  product : Product = new Product(null);
  images : string[] = [];
  disable : boolean = false;
  myForm: FormGroup; 
  unknown: boolean = false; //Determines if a product is no longer available
  shareUrl :string = environment.URL + '/produit/'+this.dataDialog.id;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(@Inject(MAT_DIALOG_DATA) public dataDialog: any, private data : DataService) { }

  ngOnInit() {
    console.log(this.shareUrl);
    this.myForm =  new FormGroup({    
      quantity: new FormControl('', Validators.compose([])),    
    });   
    this.myForm.controls['quantity'].setValue(1); 
    this.getProduct();
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
    }));
  }

  getProduct() {
      let myProduct = this.data.getProducts().find(obj => obj.id == this.dataDialog.id);
      if (myProduct == undefined) {
        this.unknown = true;
      } else {
        this.product = new Product(myProduct);
        this.images = this.product.getImages(EApiImageSizes.large);
      }
      this.images = this.product.getImages(EApiImageSizes.large);
  }

  //Add to cart the element
  onSubmit() {
      let cart = new Cart(null);
      cart.fromStorage();
      cart.add(new CartItem({id:this.product.id,quantity:this.myForm.controls["quantity"].value}));    
      this.data.setCart(cart);
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}