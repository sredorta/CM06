import { Component, OnInit, ViewChild, SimpleChanges,Output,EventEmitter,Input } from '@angular/core';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';

import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators} from '../../_helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand } from '../../_services/api.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
//import { MediaMatcher } from '@angular/cdk/layout';
import {BreakpointObserver,Breakpoints,BreakpointState} from '@angular/cdk/layout';
import {DataService} from '../../_services/data.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'], 
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],   
})
export class BrandsComponent implements OnInit {
  @Input() brand : IApiBrand;                                 //Current brand selected
  @Output() onBrandSelected = new EventEmitter<IApiBrand>();  //Brand selection  

  dataSource = null;          //Store brands array in table format
  expandedElement: any = null;   //Expanded panel for adding brand
  displayedColumns: string[] = ['image','name','modify','delete'];
  brandsCount : number = 0;
  brandsDisplayed : number = 0;
  lastBrandFilter : string = null;

  expand : boolean = false;
  myForm: FormGroup; 
  myFormUpdate : FormGroup;
  validation_messages = CustomValidators.getMessages();
  size : EApiImageSizes = EApiImageSizes.thumbnail; //Default image size for logos
  defaultImage :string = "./assets/images/no-photo-available.jpg";
  //defaultImageUpdate : string = "./assets/images/no-photo-available.jpg";
  inputImageUpdateDataIn : string[] = [];
  expandedBrandId : number = 0;
  selected = [];
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, 
              private breakpointObserver: BreakpointObserver,
              private route: Router,
              private translate: TranslateService, 
              private api : ApiService,
              private dialog: MatDialog,
              private spinner : SpinnerOverlayService) { }

  @ViewChild('expansion') expansion : MatExpansionPanel;
  @ViewChild('inputImage') inputImage : InputImagesComponent;
  @ViewChild('inputImageUpdate') inputImageUpdate : InputImagesComponent;
  @ViewChild('myTable') table : MatTable<any>;   


  createForms() {
    this.myForm =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),        
      image: new FormControl(null,null)
    });
    this.myFormUpdate =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),        
      image: new FormControl(null,null)
    });
  }


  ngOnInit() {
    this.createForms();
    this.getBrands();
  }

  getImageUrl(brand: IApiBrand) {
    if (brand.image)
      return "url(" + brand.image.sizes['thumbnail'].url + ")";
    return "url(" + this.defaultImage + ")";  
  }

  getBrands() {
    if (this.data.getBrands().length>0) {
      this.initTable(this.data.getBrands());
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getBrands().subscribe((res: IApiBrand[]) => {
        this.data.setBrands(res,true);
        this.initTable(res);
        this.spinner.hide();
      }, () => this.spinner.hide()));
    }
  }

  initTable(brands: IApiBrand[]) {
    if ( brands !== null) {
      this.dataSource = new MatTableDataSource(brands);
      this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
      this.brandsCount = this.dataSource.data.length;
      this.brandsDisplayed = this.brandsCount;
      //Override filter
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
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
      this.brandsDisplayed = this.dataSource.filteredData.length;
      this.lastBrandFilter = filterValue;
     }
  }

  //From submit
  onAddBrandSubmit(value) {
    //Handle invalid form
    if (this.myForm.invalid) {
      return;
    }
    this.spinner.show();
    this._subscriptions.push(this.api.createBrand(value.name,value.image).subscribe((res: IApiBrand) => {
        this._addBrand(res);
        this.spinner.hide();
      },()=>this.spinner.hide()));
    this.onAddBrandReset();
  }

  //Reset also image when we reset form
  onAddBrandReset() {
    this.inputImage.resetImage();
    this.myForm.reset();
    this.expansion.close();
  }

  //Update the datamodel by push new element to array
  private _addBrand(brand: IApiBrand) {
    this.dataSource.data.push(brand);
    this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
    this.brandsCount = this.dataSource.data.length;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();
    this.data.setBrands(this.dataSource.data);

  }

  //When we update
  onUpdateBrandSubmit(value,id) {
    if (this.myFormUpdate.invalid) {
      return;
    }
    //Hide the expansion
    this.expand = false;
    this.table.renderRows();

    this.spinner.show();
    this._subscriptions.push(this.api.updateBrand(id,value.name,value.image).subscribe((res: IApiBrand) => {
        this._updateBrand(res);
        this.spinner.hide();
      },()=>this.spinner.hide()));
  }

  //Update the datamodel
  private _updateBrand(brand:IApiBrand) {
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === brand.id);
    this.dataSource.data[itemIndex] = brand;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();
    this.data.setBrands(this.dataSource.data);
    if (this.brand)
      this.brand = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === this.brand.id)]; //Selected brand
  }

  //When we click on update we update the expanded pannel values
  onUpdateBrand(id) {
    let brand : IApiBrand = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
    this.myFormUpdate.controls['name'].setValue(brand.name);
    this.inputImageUpdateDataIn = [];
    if (brand.image)
      this.inputImageUpdateDataIn[0] = brand.image.sizes['full'].url;
    else 
      this.inputImageUpdateDataIn[0] = this.defaultImage; 
    
    this.expandedBrandId = id;
  }



  //Delete the brand when clicking to delete
  onDeleteBrand(id) {   
    this._subscriptions.push(this.translate.get(["brands.admin.dialog.delete.header","brands.admin.dialog.delete.content"]).subscribe( trans => {
      let dialogRef = this.dialog.open(MakeSureDialogComponent, {
        disableClose :true,
        panelClass : "admin-theme",
        data:  {title: trans['brands.admin.dialog.delete.header'],
                text:trans['brands.admin.dialog.delete.content']
              } 
      });
      this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
        if (result) {   
          this.spinner.show();
          this._subscriptions.push(this.api.deleteBrand(id).subscribe(res=> {
            this._deleteBrand(id);
            this.spinner.hide();
          },()=>this.spinner.hide()));           
        } 
      }));    
    }));
  }

  //Update the data model
  private _deleteBrand(id:number) {
    //Find the corresponding datasource element
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === id);
    //Emit no brand selected if we deleted the selection
    if (this.brand)
      if (this.dataSource.data[itemIndex].id === this.brand.id) {
        this.onBrandSelected.emit(null);
        this.brand = null;
      }
    this.dataSource.data.splice(itemIndex, 1); 
    this.data.setBrands(this.dataSource.data);
    //Remove all products of the brand
    let products = this.data.getProducts();
    this.data.setProducts(products.filter(obj => obj.brand_id != id));

    const itemIndexFilter = this.dataSource.filteredData.findIndex(obj => obj.id === id);
    if (itemIndexFilter>=0) {
      this.dataSource.filteredData.splice(itemIndexFilter, 1); 
    }
    this.table.renderRows();
    this.brandsCount = this.dataSource.data.length;
    this.brandsDisplayed = this.dataSource.filteredData.length;

    
  }

  //When row is clicked we need to redirect to brand models page
  rowClick(brand) {
    this.brand = brand;
    this.selected = [];
    for (let brand of this.dataSource.data) {
      this.selected[brand.id] = false;
    }
    this.selected[brand.id] = true;
    this.onBrandSelected.emit(brand);
  }



  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
