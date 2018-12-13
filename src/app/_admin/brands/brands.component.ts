import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import {InputImageComponent} from '../../_library/input-image/input-image.component';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand } from '../../_library/services/api.service';
import { Subscription } from 'rxjs';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

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
//  matcher: MediaQueryList; //Detects screen width
//  screenWidth: any;         //Initial window width

  loadingTableBrands  : boolean = true;
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
  //defaultImage :string = "./assets/images/no-photo-available.jpg";
  defaultImageUpdate : string = "./assets/images/no-photo-available.jpg";
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private mediaMatcher: MediaMatcher,private route: Router,private translate: TranslateService, private api : ApiService,private confirmationService: ConfirmationService,private messageService: MessageService) { }

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
/*    this.matcher = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.matcher.addListener(this.mediaListener);
    this.screenWidth = window.innerWidth;
    console.log("Inner width : " + this.screenWidth);
    console.log(this.screenWidth);
    if (this.screenWidth > 600)
        this.route.navigate(["./admin-marques/modeles/0"]); //Point to brand 0 as no brand is selected for now*/
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
      return;
    }
    console.log(value);
    this._subscriptions.push(this.translate.get(["brands.admin.toast.create.summary", "brands.admin.toast.create.detail"]).subscribe( trans => {
      this._subscriptions.push(this.api.createBrand(value.name,value.image, EApiImageSizes.thumbnail).subscribe((res: IApiBrand) => {
        this._addBrand(res);
        this.messageService.add({severity:'success', summary:trans['brands.admin.toast.create.summary'], detail:trans['brands.admin.toast.create.detail']});
      }));
    }));
    this.myForm.reset();
    this.onAddBrandReset();
  }

  //Reset also image when we reset form
  onAddBrandReset() {
    this.inputImage.resetImage();
    this.expansion.close();
  }

  //Update the datamodel by push new element to array
  private _addBrand(brand: IApiBrand) {
    this.dataSource.data.push(brand);
    this.brandsCount = this.dataSource.data.length;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();

  }

  //When we update
  onUpdateBrandSubmit(value,id) {
    if (this.myFormUpdate.invalid) {
      return;
    }
    //Hide the expansion
    this.expand = false;
    this.table.renderRows();
    this._subscriptions.push(this.translate.get(["brands.admin.toast.modify.summary", "brands.admin.toast.modify.detail"]).subscribe( trans => {
      this._subscriptions.push(this.api.updateBrand(id,value.name,value.image, EApiImageSizes.thumbnail).subscribe((res: IApiBrand) => {
        this._updateBrand(res);
        this.messageService.add({severity:'success', summary:trans['brands.admin.toast.modify.summary'], detail:trans['brands.admin.toast.modify.detail']});
      }));
    }));
  }

  //Update the datamodel
  private _updateBrand(brand:IApiBrand) {
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === brand.id);
    this.dataSource.data[itemIndex] = brand;
    this.applyFilter(this.lastBrandFilter);
    this.table.renderRows();
  }

  //When we click on update we update the expanded pannel values
  onUpdateBrand(id) {
    let brand : IApiBrand = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
    this.myFormUpdate.controls['name'].setValue(brand.name);
    this.defaultImageUpdate = brand.image.url;
  }

  //Delete the brand when clicking to delete
  onDeleteBrand(id) {
    this._subscriptions.push(this.translate.get(["brands.admin.dialog.delete.content","brands.admin.toast.delete.summary", "brands.admin.toast.delete.detail"]).subscribe( trans => {
      //Actual logic to perform a confirmation
      this.confirmationService.confirm({
        message: trans['brands.admin.dialog.delete.content'],
        accept: () => {
            this._subscriptions.push(this.api.deleteBrand(id).subscribe(res=> {
              this._deleteBrand(id);
              this.messageService.add({severity:'success', summary: trans['brands.admin.toast.delete.summary'], detail:trans['brands.admin.toast.delete.detail']});
            }));
        }}); 

    }));
  }

  //Update the data model
  private _deleteBrand(id:number) {
    //Find the corresponding datasource element
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === id);
    this.dataSource.data.splice(itemIndex, 1); 
    const itemIndexFilter = this.dataSource.filteredData.findIndex(obj => obj.id === id);
    if (itemIndexFilter>=0) {
      this.dataSource.filteredData.splice(itemIndexFilter, 1); 
    }
    this.table.renderRows();
    this.brandsCount = this.dataSource.data.length;
    this.brandsDisplayed = this.dataSource.filteredData.length;
  }

  //When row is clicked we need to redirect to brand models page
  rowClick(row) {
    console.log("ONROW: " + row);
//    this.route.navigate(["./admin-marques/modeles/" + row]);
  }

/*  //Listens to screen width
  mediaListener(event) {
    if (event.matches)
       this.screenWidth = 300;
    else 
       this.screenWidth = 700;
    console.log(this.screenWidth);
  }*/

  ngOnDestroy() {    
//    this.matcher.removeListener(this.mediaListener);
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
