import { Component, OnInit, ViewChild, SimpleChanges,Output,EventEmitter,Input } from '@angular/core';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {NiceDateFormatPipe} from '../../_pipes/nice-date-format.pipe';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel,MatCheckboxChange} from '@angular/material';
import {MatTable,MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand, IApiProduct} from '../../_services/api.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
//import { MediaMatcher } from '@angular/cdk/layout';
import {BreakpointObserver,Breakpoints,BreakpointState} from '@angular/cdk/layout';
import {DataService} from '../../_services/data.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';
import {Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, flatMap, map, tap,mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],    
})
export class ProductsComponent implements OnInit {


  dataSource = null;          //Store brands array in table format
  expandedElement: any = null;   //Expanded panel for adding brand
  displayedColumns: string[] = ['image','name','model','stock','created','modify','delete'];
  productsCount : number = 0;
  productsDisplayed : number = 0;
  lastProductFilter : string = null;
  expand : boolean = false;
  validation_messages = CustomValidators.getMessages();
  size : EApiImageSizes = EApiImageSizes.thumbnail; //Default image size for logos
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  inputImageUpdateDataIn : string[] = [];
  selected = [];

  expandedProductId : number = 0;
  onlyVehicles : boolean = false;  //Disable filtering
  onlyPieces : boolean = false;
  onlyZeroStock:boolean = false;
  keyUp = new Subject<string>();
  searchString : string = "";
  private _subscriptions : Subscription[] = new Array<Subscription>();

  @ViewChild('expansion') expansion : MatExpansionPanel;
  @ViewChild('inputImage') inputImage : InputImagesComponent;
  @ViewChild('inputImageUpdate') inputImageUpdate : InputImagesComponent;
  @ViewChild('myTable') table : MatTable<any>;   
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private data : DataService, 
    private breakpointObserver: BreakpointObserver,
    private route: Router,
    private translate: TranslateService, 
    private api : ApiService,
    private dialog: MatDialog,
    private spinner : SpinnerOverlayService) { }



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
      this.applyFilter(res);
    }));

    this.getProducts();
  }

  getImageUrl(product: IApiProduct) {
    if (product.images)
      if (product.images[0])
        return "url(" + product.images[0].sizes['thumbnail'].url + ")";
    return "url(" + this.defaultImage + ")";  
  }

  
  getBrandUrl(product: IApiProduct) {
    let brands = this.data.getBrands();
    if (brands) {
      let brand = brands[brands.findIndex(obj => obj.id === product.brand_id)];
      if (brand.image)
         return brand.image.sizes[EApiImageSizes.tinythumbnail].url ;
      else
         return  this.defaultImage;  
    }
  }

  getProducts() {
    if (this.data.getBrands().length>0) {
      this.initTable(this.data.getProducts());
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getBrands().subscribe((res: IApiBrand[]) => {
        this.data.setBrands(res,true);
        this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
          this.data.setProducts(res,true);
          this.initTable(this.data.getProducts());
          this.spinner.hide();
        }, () => this.spinner.hide()));
      }, () => this.spinner.hide()));
    }
  }

  initTable(products: IApiProduct[]) {
      if (products !== null) {
        this.productsCount = products.length;
        if (this.onlyVehicles) {
          products = products.filter(obj => obj.isVehicle == true);
        }
        if (this.onlyPieces) {
          products = products.filter(obj => obj.isVehicle == false);
        }
        if (this.onlyZeroStock) {
          products = products.filter(obj => obj.stock == 0);
        }        
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
        this.productsDisplayed = products.length;
        //Override filter
        this._setFilter();
        
        //Apply filter with value of the string of search !!!!!!!
        this.applyFilter(this.searchString);

        //Init as all not selected
        this.selected = [];
        for (let brand of this.dataSource.data) {
          this.selected[brand.id] = false;
        }
      }  
  }

  private _setFilter() {
    let obj = this;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      //Do not process when two short filter
      if (filter.length<=1) {
        data.fweight=0;
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
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.filteredData.sort((a, b) => b.fweight - a.fweight); //Order by weights
      this.dataSource.data.sort((a, b) => b.fweight - a.fweight);
      this.productsDisplayed = this.dataSource.filteredData.length;
      this.lastProductFilter = filterValue;
     } else {
      //Reorder by creation date
      this.dataSource.filteredData.sort((a, b) => a.id - b.id); //Order by id
      this.dataSource.data.sort((a, b) => a.id - b.id);
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

    //When we click on update we update the expanded pannel values
    onUpdateProduct(id) {
      let product : IApiProduct = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
      this.expandedProductId = id;
    }
  
    //Delete the brand when clicking to delete
    onDeleteProduct(id) {
      this._subscriptions.push(this.translate.get(["products.admin.dialog.delete.header","products.admin.dialog.delete.content"]).subscribe( trans => {
        let dialogRef = this.dialog.open(MakeSureDialogComponent, {
          disableClose :true,
          panelClass : "admin-theme",
          data:  {title: trans['products.admin.dialog.delete.header'],
                  text:trans['products.admin.dialog.delete.content']
                } 
        });
        this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
          if (result) {   
            this.spinner.show();
            this._subscriptions.push(this.api.deleteProduct(id).subscribe(res=> {
              this._deleteProduct(id);
              this.spinner.hide();
            },()=>this.spinner.hide()));           
          } 
        }));    
      }));
    }

  //Update the data model
  private _deleteProduct(id:number) {
    //Find the corresponding datasource element
    let products = this.data.getProducts();
    const itemIndex = products.findIndex(obj => obj.id === id);
    products.splice(itemIndex, 1); 
    this.data.setProducts(products);
    this.getProducts()

  }

  showVehicles(checkbox:MatCheckboxChange) {
    this.onlyVehicles = checkbox.checked;
    this.getProducts();
  }

  showPieces(checkbox:MatCheckboxChange) {
    this.onlyPieces = checkbox.checked;
    this.getProducts();
  }

  showZeroStock(checkbox: MatCheckboxChange) {
    this.onlyZeroStock = checkbox.checked;
    this.getProducts();
  }


    rowClick(id) {
    }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
