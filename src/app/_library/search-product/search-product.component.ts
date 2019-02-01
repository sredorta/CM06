import { Component, OnInit, Input, Output,EventEmitter, SimpleChanges, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTab, MatSelectChange, MatSelect} from '@angular/material';
import { Product} from '../../_models/product';
import {ApiService, IApiProduct, IApiBrand} from '../../_services/api.service';
import {DataService} from '../../_services/data.service';
import { Subscription } from 'rxjs';
import {Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, flatMap, map, tap,mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {
  @Output() result = new EventEmitter<Product[]>();  //Brand selection  
  @Output() loading = new EventEmitter<boolean>(false);  //Brand selection 
  @ViewChild('sortList') sortElem : MatSelect; 
  products : Product[] = [];
  brands : IApiBrand[] = [];
  private _dataSource;
  keyUp = new Subject<string>();
  searchString : string = "";
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data: DataService, private api: ApiService) { }

  ngOnInit() {
    //Apply the filter with some debounce in order to avoid too slow input
    this._subscriptions.push(this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        delay(100),
      )),
    ).subscribe(res => {
      this.searchString = res;
      console.log("FILTER: " + res);
      this.applyFilter(res);
    }));
    this.getProducts();
    this.getBrands();
  }

  //Get all the products
  getProducts() {
    if (this.data.getProducts().length>0) {
      this.pushProducts();
    } else {
      this.loading.emit(true);
      this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
        this.data.setProducts(res,true);
        this.pushProducts();
        this.loading.emit(false)
      },()=>this.loading.emit(false)));
    }
  } 

  getBrands() {
    if (this.data.getBrands().length==0) {
      this._subscriptions.push(this.api.getBrands().subscribe((res: IApiBrand[]) => {
        this.data.setBrands(res,true);
        this.brands = res;
      }));
    } else {
      this.brands = this.data.getBrands();
    }
  } 



  pushProducts() {
    for (let product of this.data.getProducts()) {
        this.products.push(new Product(product));
    }
    this._dataSource = new MatTableDataSource(this.products);
    this._setFilter();
    this.result.emit(this.products);
  }


  private _setFilter() {
    let obj = this;
    this._dataSource.filterPredicate = function(data, filter: string): boolean {
      //Do not process when two short filter
      if (filter.length<=1) {
        data.fweight = 0;
        return true;
      }

      let weight = 0;
      let words = filter.split(" ");
      for (let word of words) {
        if(word.length>1) {  //Only process from two letters
            word = word.toLowerCase();
            weight = weight + obj._find(data.title,word)*4;
            weight = weight + obj._find(data.description,word)*2;
            weight = weight + obj._find(data.brand,word)*1;
            weight = weight + obj._find(data.model,word)*3;
        }
      }
      data.fweight = weight;  //Add weight of search in data
      if (weight>0)
       return true;
      else
       return false; 
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
         this.orderBy(this.sortElem.value);
         this.result.emit(this._dataSource.filteredData);
      } 
  }

  orderBy(order: string) {
    switch (order) {
         case "match":
            this._dataSource.filteredData.sort((a, b) => b.fweight - a.fweight); //Order by weights
            break;
         case "pricedown" :
            this._dataSource.filteredData.sort((a, b) => b.getFinalPrice() - a.getFinalPrice());
            break;
         case "priceup" :
            this._dataSource.filteredData.sort((a, b) => a.getFinalPrice() - b.getFinalPrice());
            break;
         default :
            this._dataSource.filteredData.sort((a, b) => b.fweight - a.fweight); //Order by weights
    }
  }
 
  //When order has been changed by user
  onOrderChange(selection: MatSelectChange) {
    this.orderBy(selection.value);
    this.result.emit(this._dataSource.filteredData);
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

}
