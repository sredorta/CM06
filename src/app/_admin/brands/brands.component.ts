import { Component, OnInit, ViewChild } from '@angular/core';
import {InputImageComponent} from '../../_library/input-image/input-image.component';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand } from '../../_library/services/api.service';
import { Subscription } from 'rxjs';
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
  loadingTableBrands  : boolean = true;
  dataSource = null;          //Store products array in table format
  expandedElement: any = null;   //Expanded panel for description
  displayedColumns: string[] = ['id','image','name','delete'];
  brandsCount : number = 0;
  brandsDisplayed : number = 0;
  lastBrandFilter : string = null;

  myForm: FormGroup; 
  myFormUpdate : FormGroup;
  validation_messages = CustomValidators.getMessages();
  //defaultImage :string = "./assets/images/no-photo-available.jpg";
  defaultImageUpdate : string = "./assets/images/no-photo-available.jpg";
  private _subscriptions : Subscription[] = new Array<Subscription>();
  constructor(private api : ApiService) { }
  @ViewChild('expansion') expansion : MatExpansionPanel;
  @ViewChild('inputImage') inputImage : InputImageComponent;
  @ViewChild('inputImageUpdate') inputImageUpdate : InputImageComponent;
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

  getFormattedUrl(url:string) {
    return "url("+url+")";
  }

  getBrands() {
    this._subscriptions.push(this.api.getBrands(EApiImageSizes.thumbnail).subscribe((res : IApiBrand[]) => {
      for(let brand of res) {
        brand.image.url = brand.image.url;
      }
      let brands = res;
      this.dataSource = new MatTableDataSource(brands);
      this.brandsCount = this.dataSource.data.length;
      this.brandsDisplayed = this.brandsCount;
      //Override filter
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
      };
      this.loadingTableBrands = false;
    }));    
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
      console.log("invalid");
      return;
    }
    this.expansion.close();
    console.log(value);
    this._subscriptions.push(this.api.createBrand(value.name,value.image, EApiImageSizes.thumbnail).subscribe((res: IApiBrand) => {
      console.log(res);
      this.addBrand(res);
    }));
    this.myForm.reset();
    this.onAddBrandReset();
  }

  //Reset also image when we reset form
  onAddBrandReset() {
    this.inputImage.resetImage();
    this.expansion.close();
  }

  //Push new element to array
  addBrand(brand: IApiBrand) {
    this.dataSource.data.push(brand);
    this.brandsCount = this.dataSource.data.length;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();

  }

  //When row is clicked
  rowClick(row) {
    console.log("Clicked " + row);
    let brand : IApiBrand = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === row)];
    this.myFormUpdate.controls['name'].setValue(brand.name);
    this.defaultImageUpdate = brand.image.url;
  }


  //When we update
  onUpdateBrandSubmit(value,id) {
    if (this.myFormUpdate.invalid) {
      return;
    }
    this._subscriptions.push(this.api.updateBrand(id,value.name,value.image, EApiImageSizes.thumbnail).subscribe((res: IApiBrand) => {
      this.updateBrand(res);
    }));
  }

  updateBrand(brand:IApiBrand) {
    //Find the corresponding datasource element
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === brand.id);
    this.dataSource.data[itemIndex] = brand;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();
  }

  //Delete the brand when clicking to delete
  onDeleteBrand(id) {
    console.log("Delete brand : " + id);
  }



  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
