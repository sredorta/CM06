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

  private _dataSource;
  total: number = 0;    //Total data count
  matches: number = 0;  //Matches count
  constructor() { }

  //We need to init the products once are available and keep the ones stored 
  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      if (changes.products.previousValue == undefined) {
        setTimeout(()=> {
          this._dataSource = new MatTableDataSource(changes.products.currentValue);
          this._setFilter();
          this.total = this._dataSource.data.length;
          this.matches = this.total;
        },1000);
      }
    }
  }

  ngOnInit() {
    this._dataSource = new MatTableDataSource(this.products);
    this.total = this._dataSource.data.length;
    this.matches = this.total;

    //Override filter and set weights so that we can order afterwards

  }

  private _setFilter() {
    let obj = this;
    this._dataSource.filterPredicate = function(data, filter: string): boolean {
      let value = false;
      let words = filter.split(" ");
      let weight = 0;
      for (let word of words) {
          if (word.length>1) {
            word = word.toLowerCase();
            weight = weight + obj._find(data.title,word)*10;
            weight = weight + obj._find(data.description,word)*5;
            weight = weight + obj._find(data.brand,word)*1;
            weight = weight + obj._find(data.model,word)*1;
            if (data.title.toLowerCase().includes(word) || (data.description==null?false:data.description.toLowerCase().includes(word)) || data.brand.toLowerCase().includes(word) || data.model.toLowerCase().includes(word))
              value = true;
          }
      }
      data.weight = weight;
      return value;
    };
  }

  private _find(str, find) {
    let regex = new RegExp(find, "i"),result=false;
    return regex.exec(str)==null?0:1;
  }

  //Filter
  applyFilter(filterValue: string) {
      if(filterValue!== null) {
         this._dataSource.filter = filterValue.trim().toLowerCase();
         this._dataSource.applyFilter;
         console.log(this._dataSource.filteredData);
         this.sortByPrice();
         this.matches = this._dataSource.filteredData.length;
         this.total = this._dataSource.data.length;
         this.result.emit(this._dataSource.filteredData);
      }
  }

  //Order by match weights
  sortByMatch() {
    this._dataSource.filteredData.sort((a, b) => b.weight - a.weight); //Order by weights
  }

  //Order by final price
  sortByPrice() {
    this._dataSource.filteredData.sort((a, b) => b.getFinalPrice() - a.getFinalPrice()); //Order by weights
  }


}
