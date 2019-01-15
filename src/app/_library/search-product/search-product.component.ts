import { Component, OnInit, Input, Output,EventEmitter, SimpleChanges, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTab, MatSelectChange, MatSelect} from '@angular/material';
import { Product} from '../../_models/product';
import {ApiService, IApiProduct, IApiBrand} from '../../_services/api.service';
import {DataService} from '../../_services/data.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {
  @Output() result = new EventEmitter<Product[]>();  //Brand selection  
  @ViewChild('sortList') sortElem : MatSelect; 
  products : Product[] = [];
  brands : IApiBrand[] = [];
  private _dataSource;
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data: DataService, private spinner: SpinnerOverlayService, private api: ApiService) { }

  ngOnInit() {
    this.getProducts();
    this.getBrands();
  }

  //Get all the products
  getProducts() {
    if (this.data.getProducts().length>0) {
      this.pushProducts();
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
        this.data.setProducts(res);
        this.pushProducts();
        this.spinner.hide();
      }, () => this.spinner.hide()));
    }
  } 

  getBrands() {
    if (this.data.getBrands().length==0) {
      //this.spinner.show();
      this._subscriptions.push(this.api.getBrands().subscribe((res: IApiBrand[]) => {
        this.data.setBrands(res);
        this.brands = res;
        this.spinner.hide();
      }, () => this.spinner.hide()));
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
      let value = false;
//      let words = filter.split(" ");
      let weight = 0;
      let word = filter;
 //     let wordweight = words.length - 1;
 //     for (let word of words) {
 //         if (word.length>0) {
            word = word.toLowerCase();
            weight = weight + obj._find(data.title,word)*10;
            weight = weight + obj._find(data.description,word)*5;
            weight = weight + obj._find(data.brand,word)*1;
            weight = weight + obj._find(data.model,word)*1;
            if (data.title.toLowerCase().includes(word) || (data.description==null?false:data.description.toLowerCase().includes(word)) || data.brand.toLowerCase().includes(word) || data.model.toLowerCase().includes(word))
              value = true;
  //        }
 //         wordweight = wordweight - 1;
 //     }
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
         console.log(this._dataSource.filteredData);
         this.orderBy(this.sortElem.value);
         this.result.emit(this._dataSource.filteredData);
      }
  }

  orderBy(order: string) {
    switch (order) {
         case "match":
            this._dataSource.filteredData.sort((a, b) => b.weight - a.weight); //Order by weights
            break;
         case "pricedown" :
            this._dataSource.filteredData.sort((a, b) => b.getFinalPrice() - a.getFinalPrice());
            break;
         case "priceup" :
            this._dataSource.filteredData.sort((a, b) => a.getFinalPrice() - b.getFinalPrice());
            break;
         default :
            this._dataSource.filteredData.sort((a, b) => b.weight - a.weight); //Order by weights
    }
  }
 
  //When order has been changed by user
  onOrderChange(selection: MatSelectChange) {
    console.log("onOrderChange !");
    this.orderBy(selection.value);
    this.result.emit(this._dataSource.filteredData);
    console.log("sortBy");
    console.log(selection.value);
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

}