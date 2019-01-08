import { Component, OnInit, Input } from '@angular/core';
import {IApiProduct, EApiImageSizes} from '../_services/api.service';
import {Product} from '../_models/product';
import {ProductItemDialogComponent} from '../product-item-dialog/product-item-dialog.component';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';
import {TooltipModule} from 'primeng/tooltip';
import {ViewEncapsulation} from '@angular/core';
import { DataService } from '../_services/data.service';
import {CurrencyFormatPipe} from '../_pipes/currency-format.pipe';
import { Router} from'@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class ProductItemComponent implements OnInit {
  @Input() product : Product;           //Product to display
  @Input() preview : boolean = false;   //When we are in preview mode
  defaultImage :string = "./assets/images/no-photo-available.jpg";

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api : ApiService, private data : DataService, private router:Router) { }

  ngOnInit() {
//    this.product = new Product(this.data.getProducts()[11]);
    console.log(this.product);
    //For debug only
/*    this.product.title = "Amortisseur avant titre";
    this.product.description = "Amortisseur avant de 150mm de debatement pour une moto qui dechire";
    this.product.price = 2800;
    this.product.discount = 10;
    this.api.getBrands().subscribe(res => {
/*      this.product.brand = res[0];
      this.api.getModels(this.product.brand.id).subscribe(res => {
        this.product.model = res[0];
        console.log(this.product.model);
      });
    });*/

  }


  getProductPrimaryImage() {
    if (this.product.images)
      if(this.product.images[0])
        if (!this.preview)
          return this.product.images[0].sizes[EApiImageSizes.small].url;
        else
          return this.product.images[0];  
    return this.defaultImage;    
  }

  showDetailDialog() {
    this.router.navigate(["/produit", this.product.id]);
  }

  addToCart() {
    if (!this.preview) {
        console.log("Adding to cart");
    }
  }
}
