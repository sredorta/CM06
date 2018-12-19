import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {MatMenu} from '@angular/material';
import {MatTable, MatTableDataSource, MatMenuTrigger, MatInput} from '@angular/material';
import { ApiService, EApiImageSizes, IApiBrand } from '../../_library/services/api.service';
import {FormGroup, FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import {DataService} from '../../_services/data.service';


@Component({
  selector: 'app-search-brand',
  templateUrl: './search-brand.component.html',
  styleUrls: ['./search-brand.component.scss']
})
export class SearchBrandComponent implements OnInit {
  @Input() brand : IApiBrand;
  @Output() onBrandSelected = new EventEmitter<IApiBrand>();
  @ViewChild('menuBrandTrigger') triggerMenuBrands: MatMenuTrigger;
  @ViewChild('brandSearchInput') brandSearchInput: ElementRef;
  @ViewChild('menuBrands') menuBrands : MatMenu;
//  selectedBrand : boolean = false;
//  currentBrand : IApiBrand = null;
  dataSource = null;          //Store brands array in table format
  lastBrandFilter : string = null;
  formSearchBrand : FormGroup;
  brands : IApiBrand[] = null;
  defaultImage :string = "./assets/images/no-photo-available.jpg";

  private _subscriptions : Subscription[] = new Array<Subscription>();


  constructor(private data : DataService) { 
  }

  ngOnInit() {
    this._subscriptions.push(this.data.getBrands().subscribe((res : IApiBrand[]) => {
      this.brands = res;
      this.dataSource = new MatTableDataSource(this.brands);
    }));    
    this.formSearchBrand =  new FormGroup({    
      search: new FormControl(null,null)
    });    

    //Override filter
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };    
  }

  //Sanityze url
  getImageUrl(brand: IApiBrand) {
    if (brand.image)
      return "url(" + brand.image.sizes['thumbnail'].url + ")";
    return "url(" + this.defaultImage + ")";  
  }


  //Filter
  applyFilter(filterValue: string) {
    if(filterValue!== null) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     this.lastBrandFilter = filterValue;
    }
    console.log(this.dataSource.filteredData.length);
    if (this.dataSource.filteredData.length< 5 && this.dataSource.filteredData.length>1) {
      this.menuBrands.yPosition
      this.menuBrands.setPositionClasses();
        this.triggerMenuBrands.openMenu();
    } else if (this.dataSource.filteredData.length == 1){
      this.triggerMenuBrands.closeMenu();
      this.brandSelected(this.dataSource.filteredData[0]);
    } else {
        this.triggerMenuBrands.closeMenu();
    }
    //Keep focus on input
    this.brandSearchInput.nativeElement.focus();
 }

 //When we select a brand from the menu
 brandSelected(brand:IApiBrand) {
   this.formSearchBrand.controls['search'].setValue(brand.name);
   //this.selectedBrand = true;
   this.brand = brand;
   //We need to emit the new brand !!! here
   this.onBrandSelected.emit(brand);
 }

 newBrandSearch() {
  this.formSearchBrand.controls['search'].setValue("");
  this.brand = null;
  this.onBrandSelected.emit(null);
//  this.data.setCurrentBrand(null);
 }
}
