import { Component, OnInit } from '@angular/core';
import {ProductItemComponent} from '../product-item/product-item.component';
import {Product} from '../_models/product';
import { Subscription } from 'rxjs';
import { trigger, style, transition, animate, group, query,stagger,keyframes } from '@angular/animations';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  animations: [
    trigger('productAnim', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), {optional: true}),
        query(':enter',
          animate('0.6s ease-in', keyframes([
            style({opacity: 0, transform: 'rotateY(-90deg)', width:"0%", offset: 0}),
            style({opacity: 0, transform: 'rotateY(-90deg)', width:"100%", offset: 0.4}),
            style({opacity: 1, transform: 'rotateY(0deg)', width:"100%",    offset: 1.0}),
          ])), {optional: true}),
        query(':leave', 
            animate('0.6s ease-out', keyframes([
              style({opacity: 1, transform: 'rotateY(0)',     width:"100%", offset: 0}),
              style({opacity: 1, transform: 'rotateY(90deg)', width:"100%", offset: 0.6}),
              style({opacity: 0, transform: 'rotateY(90deg)', width:"0%",    offset: 1.0}),
            ])), {optional: true})
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