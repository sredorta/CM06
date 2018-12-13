import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel, MatMenu} from '@angular/material';
import {MatTable, MatTableDataSource, MatMenuTrigger, MatInput} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand } from '../../_library/services/api.service';
import { Subscription } from 'rxjs';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  @ViewChild('menuBrandTrigger') triggerMenuBrands: MatMenuTrigger;
  @ViewChild('brandSearchInput') brandSearchInput: ElementRef;
  @ViewChild('menuBrands') menuBrands : MatMenu;
  
  idbrand:number = null;  //Brand id to show models

  loadingTableModels  : boolean = true;
  dataSource = null;          //Store brands array in table format
  lastBrandFilter : string = null;
  formSearchBrand : FormGroup;
  validation_messages = CustomValidators.getMessages();
  //defaultImage :string = "./assets/images/no-photo-available.jpg";
  defaultImageUpdate : string = "./assets/images/no-photo-available.jpg";
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private route: ActivatedRoute, private translate: TranslateService, private api : ApiService,private confirmationService: ConfirmationService,private messageService: MessageService) { }

  createForms() {
    this.formSearchBrand =  new FormGroup({    
      search: new FormControl(null,null)
    });
 
  }

  ngOnInit() {
    this._subscriptions.push(this.route.params.subscribe(params => {
      this.idbrand = +params['idbrand']; // (+) converts string 'id' to a number
      console.log("We have selected idbrand : " + this.idbrand);
   })); 
    this.getBrands();
    this.createForms();
  }

  getFormattedUrl(url:string) {
    return "url("+url+")";
  }

  getBrands() {
    this._subscriptions.push(this.api.getBrands(EApiImageSizes.tinythumbnail).subscribe((res : IApiBrand[]) => {
      for(let brand of res) {
        brand.image.url = brand.image.url;
      }
      let brands = res;
      this.dataSource = new MatTableDataSource(brands);
      //Override filter
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
      };
      this.loadingTableModels = false;
    }));    
  }
  //Filter
  applyFilter(filterValue: string) {
    if(filterValue!== null) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     this.lastBrandFilter = filterValue;
    }
    console.log(this.dataSource.filteredData.length);
    if (this.dataSource.filteredData.length< 5 && this.dataSource.filteredData.length>0) {
      this.menuBrands.yPosition
      this.menuBrands.setPositionClasses();
        this.triggerMenuBrands.openMenu();
    } else {
        this.triggerMenuBrands.closeMenu();
    }
    //Keep focus on input
    this.brandSearchInput.nativeElement.focus();
 }

 //When we selecte a brand from the menu
 brandSelected(brand:IApiBrand) {
   console.log("Setting value to : " + brand.name);
   console.log("Setting brand id : " + brand.id);
   this.formSearchBrand.controls['search'].setValue(brand.name);
 }
  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  

}
