import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource,  MatInput} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_library/helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand, IApiModel } from '../../_library/services/api.service';
import { DataService} from '../../_services/data.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import {MessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SearchBrandComponent } from '../../_library/search-brand/search-brand.component';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],  
})
export class ModelsComponent implements OnInit {
  @ViewChild('expansion') expansion : MatExpansionPanel;
  @ViewChild('myTable') table : MatTable<any>;   
  
  @Output() onModelSelected = new EventEmitter<IApiBrand>();

  currentBrand : IApiBrand = null;
  loadingTableModels  : boolean = true;
  dataSource = null;          //Store brands array in table format
  displayedColumns: string[] = ['name','modify','delete'];
  modelsDisplayed : number = 0;
  modelsCount : number = 0;
  lastFilter : string = null;
  expand : boolean = false;

  validation_messages = CustomValidators.getMessages();

  myForm: FormGroup; 
  myFormUpdate : FormGroup;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, 
              private translate: TranslateService, 
              private api : ApiService,
              private messageService: MessageService,
              private dialog : MatDialog) { }

  createForms() {
    this.myForm =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ]))
    });
    this.myFormUpdate =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ]))
    });    
  }

  ngOnInit() {
    this.createForms();
    this._subscriptions.push(this.data.getCurrentBrand().subscribe(res => {
      this.currentBrand = res;
      this.getModels();
    }));
  }

  getFormattedUrl(url:string) {
    return "url("+url+")";
  }

  getModels() {
    if (this.currentBrand !== null) {
      this._subscriptions.push(this.api.getModels(this.currentBrand.id).subscribe((res : IApiBrand[]) => {
        console.log("We got from api service : ");
        console.log(res);
        //this.models = res;
        this.loadingTableModels = false;
        if (res !== null) {
          this.dataSource = new MatTableDataSource(res);
          this.modelsCount = this.dataSource.data.length;
          this.modelsDisplayed = this.modelsCount;
          //Override filter
          this.dataSource.filterPredicate = function(data, filter: string): boolean {
            return data.name.toLowerCase().includes(filter);
          };
          this.loadingTableModels = false;
        }
      }));    
    }
  }


  //Add model submit
  onAddModelSubmit(value) {
    //Handle invalid form
    if (this.myForm.invalid) {
      return;
    }
    this._subscriptions.push(this.translate.get(["models.admin.toast.create.summary", "models.admin.toast.create.detail"]).subscribe( trans => {
      this._subscriptions.push(this.api.createModel(this.currentBrand.id,value.name).subscribe((res: IApiModel) => {
        this._addModel(res);
        this.messageService.add({severity:'success', summary:trans['models.admin.toast.create.summary'], detail:trans['models.admin.toast.create.detail']});
      }));
    }));
    this.myForm.reset();
    this.onAddModelReset();
  }

  //Reset also image when we reset form
  onAddModelReset() {
    this.expansion.close();
  }

  //Update the datamodel by push new element to array
  private _addModel(model: IApiModel) {
    this.dataSource.data.push(model);
    this.modelsCount = this.dataSource.data.length;
    this.applyFilter(this.lastFilter);
    this.table.renderRows();
    //this.data.setBrands(this.dataSource.data);
  }

  //Filter
  applyFilter(filterValue: string) {
    if(filterValue!== null) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     this.modelsDisplayed = this.dataSource.filteredData.length;
     this.lastFilter = filterValue;
    }
 }

  //Delete the brand when clicking to delete
  onDeleteModel(id) {
    this._subscriptions.push(this.translate.get(["models.admin.dialog.delete.header","models.admin.dialog.delete.content","models.admin.toast.delete.summary", "models.admin.toast.delete.detail"]).subscribe( trans => {
      let dialogRef = this.dialog.open(MakeSureDialogComponent, {
        disableClose :true,
        panelClass : "admin-theme",
        data:  {title: trans['models.admin.dialog.delete.header'],
                text:trans['models.admin.dialog.delete.content']
              } 
      });
      this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
        if (result) {   
          this._subscriptions.push(this.api.deleteModel(id).subscribe(res=> {
            this._deleteModel(id);
            this.messageService.add({severity:'success', summary: trans['models.admin.toast.delete.summary'], detail:trans['models.admin.toast.delete.detail']});
          }));           
        } 
      }));    
    }));
  }

  //Update the data model
  private _deleteModel(id:number) {
    //Find the corresponding datasource element
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === id);
    this.dataSource.data.splice(itemIndex, 1); 
    //this.data.setBrands(this.dataSource.data);
    //if (this.dataSource.data.findIndex(obj => obj.id === this.currentBrand.id)<0)
    //  this.data.setCurrentBrand(null);

    const itemIndexFilter = this.dataSource.filteredData.findIndex(obj => obj.id === id);
    if (itemIndexFilter>=0) {
      this.dataSource.filteredData.splice(itemIndexFilter, 1); 
    }
    this.table.renderRows();
    this.modelsCount = this.dataSource.data.length;
    this.modelsDisplayed = this.dataSource.filteredData.length;
  }


  //When we update
  onUpdateModelSubmit(value,id) {
    if (this.myFormUpdate.invalid) {
      return;
    }
    //Hide the expansion
    this.expand = false;
    this.table.renderRows();
    this._subscriptions.push(this.translate.get(["models.admin.toast.modify.summary", "models.admin.toast.modify.detail"]).subscribe( trans => {
      this._subscriptions.push(this.api.updateModel(id,value.name).subscribe((res: IApiModel) => {
        this._updateModel(res);
        this.messageService.add({severity:'success', summary:trans['models.admin.toast.modify.summary'], detail:trans['models.admin.toast.modify.detail']});
      }));
    }));
  }

  //Update the datamodel
  private _updateModel(brand:IApiModel) {
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === brand.id);
    this.dataSource.data[itemIndex] = brand;
    this.applyFilter(this.lastFilter);
    this.table.renderRows();
    //this.data.setBrands(this.dataSource.data);
    //this.data.setCurrentBrand(this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === this.currentBrand.id)]);
  }

  //When we click on update we update the expanded pannel values
  onUpdateModel(id) {
    let model : IApiModel = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
    this.myFormUpdate.controls['name'].setValue(model.name);
  }

  //When row is clicked we need to redirect to brand models page
  rowClick(brand) {
    //this.data.setCurrentBrand(brand);
    this.onModelSelected.emit(brand);
  }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  

}
