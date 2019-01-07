import { Component, OnInit, ViewChild, SimpleChanges,Output,EventEmitter,Input } from '@angular/core';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {NiceDateFormatPipe} from '../../_pipes/nice-date-format.pipe';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand, IApiProduct} from '../../_services/api.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import {MessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
//import { MediaMatcher } from '@angular/cdk/layout';
import {BreakpointObserver,Breakpoints,BreakpointState} from '@angular/cdk/layout';
import {DataService} from '../../_services/data.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';

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
  //brands : IApiBrand[] = null;

  expand : boolean = false;
  //myForm: FormGroup; 
  //myFormUpdate : FormGroup;
  validation_messages = CustomValidators.getMessages();
  size : EApiImageSizes = EApiImageSizes.thumbnail; //Default image size for logos
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  //defaultImageUpdate : string = "./assets/images/no-photo-available.jpg";
  inputImageUpdateDataIn : string[] = [];
  selected = [];

  expandedProductId : number = 0;


  private _subscriptions : Subscription[] = new Array<Subscription>();
  @ViewChild('expansion') expansion : MatExpansionPanel;
  @ViewChild('inputImage') inputImage : InputImagesComponent;
  @ViewChild('inputImageUpdate') inputImageUpdate : InputImagesComponent;
  @ViewChild('myTable') table : MatTable<any>;   


  constructor(private data : DataService, 
    private breakpointObserver: BreakpointObserver,
    private route: Router,
    private translate: TranslateService, 
    private api : ApiService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private spinner : SpinnerOverlayService) { }

  ngOnInit() {
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
        console.log("Brands :");
        console.log(res);
        this.data.setBrands(res);
        this._subscriptions.push(this.api.getProducts().subscribe((res: IApiProduct[]) => {
          this.data.setProducts(res);
          this.initTable(this.data.getProducts());
          this.spinner.hide();
        }, () => this.spinner.hide()));
      }, () => this.spinner.hide()));
    }
  }

  initTable(products: IApiProduct[]) {
      if (products !== null) {
        this.dataSource = new MatTableDataSource(products);
        this.productsCount = this.dataSource.data.length;
        this.productsDisplayed = this.productsCount;
        //Override filter
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          //TODO add here brand/model
          return data.title.toLowerCase().includes(filter) || data.brand.toLowerCase().includes(filter) || data.model.toLowerCase().includes(filter);
        };
        //Init as all not selected
        this.selected = [];
        for (let brand of this.dataSource.data) {
          this.selected[brand.id] = false;
        }
      }  
  }


  //Filter
  applyFilter(filterValue: string) {
     if(filterValue!== null) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.productsDisplayed = this.dataSource.filteredData.length;
      this.lastProductFilter = filterValue;
     }
  }

    //When we click on update we update the expanded pannel values
    onUpdateProduct(id) {
      console.log("OnUpdateProduct");
      let product : IApiProduct = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
      this.expandedProductId = id;
    }
  
    //Delete the brand when clicking to delete
    onDeleteProduct(id) {
      console.log("OnDeleteProduct");
      this._subscriptions.push(this.translate.get(["products.admin.dialog.delete.header","products.admin.dialog.delete.content","products.admin.toast.delete.summary", "products.admin.toast.delete.detail"]).subscribe( trans => {
        let dialogRef = this.dialog.open(MakeSureDialogComponent, {
          disableClose :true,
          panelClass : "admin-theme",
          data:  {title: trans['products.admin.dialog.delete.header'],
                  text:trans['products.admin.dialog.delete.content']
                } 
        });
        this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
          if (result) {   
            this._subscriptions.push(this.api.deleteProduct(id).subscribe(res=> {
              this._deleteProduct(id);
              this.messageService.add({severity:'success', summary: trans['products.admin.toast.delete.summary'], detail:trans['products.admin.toast.delete.detail']});
            }));           
          } 
        }));    
      }));
    }

  //Update the data model
  private _deleteProduct(id:number) {
    //Find the corresponding datasource element
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === id);
    this.dataSource.data.splice(itemIndex, 1); 
    this.data.setProducts(this.dataSource.data);

    const itemIndexFilter = this.dataSource.filteredData.findIndex(obj => obj.id === id);
    if (itemIndexFilter>=0) {
      this.dataSource.filteredData.splice(itemIndexFilter, 1); 
    }
    this.table.renderRows();
    this.productsCount = this.dataSource.data.length;
    this.productsDisplayed = this.dataSource.filteredData.length;

    
  }


    rowClick(id) {
      console.log("Row click " + id);
    }

}
