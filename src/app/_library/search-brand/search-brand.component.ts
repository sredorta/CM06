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
//  @Input() brands : IApiBrand[];
  //@Output() onBrandSelected = new EventEmitter<IApiBrand>();
  @ViewChild('menuBrandTrigger') triggerMenuBrands: MatMenuTrigger;
  @ViewChild('brandSearchInput') brandSearchInput: ElementRef;
  @ViewChild('menuBrands') menuBrands : MatMenu;
  selectedBrand : boolean = false;
  currentBrand : IApiBrand = null;
  dataSource = null;          //Store brands array in table format
  lastBrandFilter : string = null;
  formSearchBrand : FormGroup;
  brands : IApiBrand[] = null;
  private _subscriptions : Subscription[] = new Array<Subscription>();


  constructor(private data : DataService) { 
  }

  ngOnInit() {
    this._subscriptions.push(this.data.getBrands().subscribe((res : IApiBrand[]) => {
      this.brands = res;
      this.dataSource = new MatTableDataSource(this.brands);
    }));    
    this._subscriptions.push(this.data.getCurrentBrand().subscribe((res : IApiBrand) => {
      if (res !== null) this.selectedBrand = true;
      else this.selectedBrand = false;
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
  getFormattedUrl(url:string) {
    return "url("+url+")";
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

 //When we selecte a brand from the menu
 brandSelected(brand:IApiBrand) {
   this.formSearchBrand.controls['search'].setValue(brand.name);
   this.selectedBrand = true;
   this.currentBrand = brand;
   //We need to emit the new brand !!! here
   //this.onBrandSelected.emit(brand);
   this.data.setCurrentBrand(brand);
 }

 newBrandSearch() {
  this.formSearchBrand.controls['search'].setValue("");
  this.selectedBrand = false;
  //this.onBrandSelected.emit(null);
  this.data.setCurrentBrand(null);
 }
}
