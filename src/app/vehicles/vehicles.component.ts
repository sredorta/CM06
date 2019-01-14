import { Component, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import { Subscription } from 'rxjs';
import { trigger, style, transition, animate, group } from '@angular/animations';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  animations: [
    trigger('productAnim', [
      transition(':enter', [
        style({transform: 'translateX(-100vw)'}),
        animate(350)
      ]),
      transition(':leave', [
        group([
          animate('0.35s ease', style({
            transform: 'translateX(100vw)'
          })),
          animate('0.35s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
})
export class VehiclesComponent implements OnInit {

  matches  : number = 0;
  products : Array<Product> = [];
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor() { }

  ngOnInit() {
  }

  updateFilter(result:Product[]) {
    console.log("updateFilter");
    this.products = result.filter(obj => obj.isVehicle == true);
    this.matches = this.products.length;
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}