import { Component, OnInit, Input, Output,EventEmitter, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTab} from '@angular/material';

import { Product } from '../../_models/product';
@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {

  @Input() products : Product[] = [];
  @Output() result = new EventEmitter<Product[]>();  //Brand selection  

  private _loaded = false;
  private _dataSource;
  constructor() { }

  //We need to init the products once are available and keep the ones stored 
  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) 
      if (changes.products.previousValue == undefined) {
        this._dataSource = new MatTableDataSource(changes.products.currentValue);
        this._loaded = true;
      }
  }

  ngOnInit() {
    this._dataSource = new MatTableDataSource(this.products);
    //Override filter
    this._dataSource.filterPredicate = function(data, filter: string): boolean {
      let value = false;
      let words = filter.split(" ");
        for (let word of words) {
          if (word.length>0) {
            if (data.title.toLowerCase().includes(word) || (data.description==null?false:data.description.toLowerCase().includes(word)) || data.brand.toLowerCase().includes(word) || data.model.toLowerCase().includes(word))
              value = true;
          }
        }
        return value;
    };
  }



    //Filter
    applyFilter(filterValue: string) {
        if(filterValue!== null) {
         this._dataSource.filter = filterValue.trim().toLowerCase();
         this._setWeights(this._dataSource.filteredData, filterValue);
         this._dataSource.filteredData.sort((a, b) => b.weight - a.weight); //Order by weights
         this.result.emit(this._dataSource.filteredData);
        }
     }


    //Set matching weights in the results
    private _setWeights(data:any[], filter:string) {
        let words = filter.split(" ");
        for (let product of data) {
          let weight = 0;
          for (let word of words) {
            if (word.length>1) {
              weight = weight + this._find(product.title,word)*10;
              weight = weight + this._find(product.description,word)*5;
              weight = weight + this._find(product.brand,word)*1;
              weight = weight + this._find(product.model,word)*1;
            }
          }
          product.weight = weight;
        }
      }

   //We return 1 of the occurrence happens, 0 if not
   private _find(str, find) {
    let regex = new RegExp(find, "i"),result=false;
    return regex.exec(str)==null?0:1;
  }
}
