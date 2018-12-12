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
  displayedColumns: string[] = ['id','image','name'];
  brandsCount : number = 0;
  brandsDisplayed : number = 0;
  lastBrandFilter : string = null;

  myForm: FormGroup; 
  private _subscriptions : Subscription[] = new Array<Subscription>();
  constructor(private api : ApiService) { }
  @ViewChild('expansion') expansion : MatExpansionPanel;
  @ViewChild('inputImage') inputImage : InputImageComponent;
  @ViewChild('myTable') table : MatTable<any>;   

  createForm() {
    this.myForm =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),        
      image: new FormControl(null,null)
    });
  }


  ngOnInit() {
    this.createForm();
    this.getBrands();
  }


  getBrands() {
    this._subscriptions.push(this.api.getBrands(EApiImageSizes.thumbnail).subscribe((res : IApiBrand[]) => {
      for(let brand of res) {
        brand.image.url = "url("+brand.image.url+")";
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

  //Reset also image when we reset form
  reset() {
    this.inputImage.resetImage();
  }

  //Filter
  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.brandsDisplayed = this.dataSource.filteredData.length;
      this.lastBrandFilter = filterValue;
  }

  //From submit
  onSubmit(value) {
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
    this.reset();
  }

  //Push new element to array
  addBrand(brand: IApiBrand) {
    brand.image.url = "url("+brand.image.url+")";
    this.dataSource.data.push(brand);
    this.brandsCount = this.dataSource.data.length;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();

  }

  //When row is clicked
  rowClick(row) {
    console.log("Clicked " + row);
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
