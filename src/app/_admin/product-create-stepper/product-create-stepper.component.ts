import { Component, OnInit, ViewChild } from '@angular/core';
import {BrandsComponent} from '../brands/brands.component';
import {ModelsComponent} from '../models/models.component';
import {ProductCreateUpdateComponent} from '../product-create-update/product-create-update.component';
import { MatHorizontalStepper } from '@angular/material';
import { IApiModel,IApiBrand } from '../../_library/services/api.service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private translate : TranslateService) { }

  ngOnInit() {
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
}
