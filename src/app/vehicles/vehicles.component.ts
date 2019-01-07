import { Component, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import {DataService} from '../_services/data.service';
import {SpinnerOverlayService} from '../_library/spinner-overlay.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ApiService, EApiImageSizes, IApiProduct} from '../_services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  products : Array<Product> = [];
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data: DataService, private spinner: SpinnerOverlayService, private api: ApiService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    console.log("getProducts !!!!");
    if (this.data.getProducts().length>1) {
      console.log("Got here");
      this.pushProducts();
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
        this.data.setProducts(res);
        this.pushProducts();
        this.spinner.hide();
      }, () => this.spinner.hide()));
    }
  }

  pushProducts() {
    console.log("Products are:")
    console.log(this.data.getProducts());
    for (let product of this.data.getProducts()) {
      if (product.isVehicle) {
        this.products.push(new Product(product));
        console.log("Pushed new product");
      }
    }
  }
}