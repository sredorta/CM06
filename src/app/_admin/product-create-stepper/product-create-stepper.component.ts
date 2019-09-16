import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material';
import { IApiModel,IApiBrand, IApiProduct } from '../../_services/api.service';
import {DataService} from '../../_services/data.service';
import {ApiService} from '../../_services/api.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';
import { Router} from '@angular/router';

@Component({
  selector: 'app-product-create-stepper',
  templateUrl: './product-create-stepper.component.html',
  styleUrls: ['./product-create-stepper.component.scss']
})
export class ProductCreateStepperComponent implements OnInit {
  @ViewChild('stepper') stepper: MatHorizontalStepper;

  isBrandCompleted : boolean = false;
  isModelCompleted : boolean = false;
  isProductCompleted : boolean = false;
  currentBrand: IApiBrand;
  currentModel: IApiModel;
  hasProducts : boolean = false;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService,
              private data: DataService,
              private spinner: SpinnerOverlayService, private router : Router) { }

  ngOnInit() {
    this.getProducts();
  }


  getProducts() {
    if (this.data.getProducts().length==0) {
      this.spinner.show();
      this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
        this.data.setProducts(res);
        this.spinner.hide();
        this.hasProducts = true;
      }, () => this.spinner.hide()));
    } else {
      this.hasProducts = true;
    }
  }

  goToModels(brand:IApiBrand) {
    if (brand) {
      this.currentBrand = brand;
      this.isBrandCompleted = true;
      this.isModelCompleted = false;
      this.isProductCompleted = false;
      //We need to wait some time otherwise it doesn't work
      setTimeout(()=> { this.stepper.next();}, 200);
    }
  }

  goToProducts(model: IApiModel) {
    this.currentModel = model;
    this.isModelCompleted = true;
    //We need to wait some time otherwise it doesn't work
    setTimeout(()=> { this.stepper.next();}, 200);   
  }

  
  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
  onBackToProducts() {
      this.router.navigate(["/admin-products"]);
  }
}
