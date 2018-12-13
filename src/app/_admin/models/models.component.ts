import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource,  MatInput} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand } from '../../_library/services/api.service';
import { DataService} from '../../_services/data.service';
import { Subscription } from 'rxjs';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SearchBrandComponent } from '../../_library/search-brand/search-brand.component';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  
  idbrand:number = null;  //Brand id to show models
  brands : IApiBrand[] = null;   //All downloaded brands

  currentBrand : IApiBrand = null;
  loadingTableModels  : boolean = true;
  dataSource = null;          //Store brands array in table format
  validation_messages = CustomValidators.getMessages();

  myForm: FormGroup; 

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, private translate: TranslateService, private api : ApiService,private confirmationService: ConfirmationService,private messageService: MessageService) { }

  createForms() {
    this.myForm =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ]))
    });
  }

  ngOnInit() {
    this.getBrands();
    this.createForms();
    this._subscriptions.push(this.data.getCurrentBrand().subscribe(res => {
      this.currentBrand = res;
    }));
  }

  getFormattedUrl(url:string) {
    return "url("+url+")";
  }

  getBrands() {
    this._subscriptions.push(this.data.getBrands().subscribe((res : IApiBrand[]) => {
      console.log("We got from data service : ");
      console.log(res);
      this.brands = res;
      this.loadingTableModels = false;
    }));    
  }

/*  //Filter
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

*/

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  

}
