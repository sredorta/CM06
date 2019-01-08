import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService, IApiProduct, EApiImageSizes } from '../_services/api.service';
import { DataService } from '../_services/data.service';
import {Product} from '../_models/product';
import { GalleryComponent } from '../_library/gallery/gallery.component';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.scss']
})
export class ProductItemDetailComponent implements OnInit {
  id:number;
  product : Product = new Product(null);
  images : string[] = [];
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private route: ActivatedRoute, 
              private api: ApiService, 
              private data : DataService) { }

  ngOnInit() {
    this._subscriptions.push(this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log("Showing details for product id : " + this.id);
      this.getProduct();

     /* this._subscriptions.push(this.api.getProduct(this.id).subscribe(res => {
        console.log(res);
      }));*/
    }));   
  }

  getProduct() {
    if (this.data.getProducts().length>0) {
      let myProduct = this.data.getProducts().find(obj => obj.id == this.id);
      console.log(myProduct);
      this.product = new Product(myProduct);
    } else {
      console.log("need to download !");
      //TODO change this to load only one product !!!!
      this.api.getProducts().subscribe(res => {
        let myProduct = res.find(obj => obj.id == this.id);
        this.product = new Product(myProduct);
        console.log(this.product.images);
        this.images = this.product.getImages(EApiImageSizes.large);
      })
    }
  }


}
