import { Component, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { trigger, style, transition, animate, group } from '@angular/animations';

@Component({
  selector: 'app-pieces',
  templateUrl: './pieces.component.html',
  styleUrls: ['./pieces.component.scss'],
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
export class PiecesComponent implements OnInit {

  products : Array<Product> = [];
  matches  : number = 0;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor() { }

  ngOnInit() {}

  updateFilter(result:Product[]) {
    console.log("updateFilter");
    this.products = result.filter(obj => obj.isVehicle == false);
    this.matches = this.products.length;
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}