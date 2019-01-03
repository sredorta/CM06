import { Component, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import {DataService} from '../_services/data.service';
import {SpinnerComponent} from '../_library/spinner/spinner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products : Array<Product> = [];
  constructor(private data: DataService) { }

  ngOnInit() {
    for (let product of this.data.getProducts()) {
      this.products.push(new Product(product));
    }
  }

}
