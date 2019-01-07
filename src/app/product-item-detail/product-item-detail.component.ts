import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.scss']
})
export class ProductItemDetailComponent implements OnInit {
  id:number;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this._subscriptions.push(this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log("Showing details for product id : " + this.id);
     /* this._subscriptions.push(this.api.getProduct(this.id).subscribe(res => {
        console.log(res);
      }));*/
    }));   
  }

}
