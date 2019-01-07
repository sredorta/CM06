import { Component, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import {ApiService} from '../_services/api.service';
//import {SpinnerComponent} from '../_library/spinner/spinner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products : Array<Product> = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getModels().subscribe(res => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!! DEBUG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(res)
    });
    /*for (let product of this.data.getProducts()) {
      this.products.push(new Product(product));
    }*/
  }

}
