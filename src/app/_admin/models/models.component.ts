import { Component, OnInit, ViewChild, Output,EventEmitter, Input, SimpleChanges } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource,  MatInput} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand, IApiModel } from '../../_services/api.service';
import { DataService} from '../../_services/data.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import { TranslateService } from '@ngx-translate/core';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';

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
  @Input() brand : IApiBrand;
  @Output() onModelSelected = new EventEmitter<IApiBrand>();

  loadingTableModels  : boolean = true;
  dataSource = null;          //Store brands array in table format
  displayedColumns: string[] = ['name','modify','delete'];
  modelsDisplayed : number = 0;
  modelsCount : number = 0;
  lastFilter : string = null;
  expand : boolean = false;
  selected = [];
  defaultImage :string = "./assets/images/no-photo-available.jpg";

  validation_messages = CustomValidators.getMessages();

  myForm: FormGroup; 
  myFormUpdate : FormGroup;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, 
              private translate: TranslateService, 
              private api : ApiService,
              private dialog : MatDialog,
              private spinner : SpinnerOverlayService) { }

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
  }

  ngOnChanges(changes : SimpleChanges) {
    this.brand = changes.brand.currentValue;
    this.getModels();
  }

  getImageUrl(brand: IApiBrand) {
    if (brand.image)
      return "url(" + brand.image.sizes['thumbnail'].url + ")";
    return "url(" + this.defaultImage + ")";  
  }

  getModels() {
    if (this.brand)
      if (this.data.getModels().length>0) {
        this.initTable(this.data.getModels());
      } else {
        this.spinner.show();
        this._subscriptions.push(this.api.getModels().subscribe((res : IApiModel[]) => {
          this.data.setModels(res,true);
          this.initTable(res);
          this.spinner.hide();
        },() => this.spinner.hide()));
      }  
  }

  initTable(data: IApiModel[]) {
    if (data !== null) {
      data = data.filter(obj=> obj.brand_id == this.brand.id);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
      this.modelsCount = this.dataSource.data.length;
      this.modelsDisplayed = this.modelsCount;

      //Override filter
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
      };
      //Init as all not selected
      this.selected = [];
      for (let brand of this.dataSource.data) {
        this.setSelected[brand.id] = false;
      }          
    }
  }

  //Add model submit
  onAddModelSubmit(value) {
    //Handle invalid form
    if (this.myForm.invalid) {
      return;
    }
    this.spinner.show()
      this._subscriptions.push(this.api.createModel(this.brand.id,value.name).subscribe((res: IApiModel) => {
        this._addModel(res);
        this.spinner.hide();
      },()=>this.spinner.hide()));
    this.myForm.reset();
    this.onAddModelReset();
  }

  //Reset also image when we reset form
  onAddModelReset() {
    this.expansion.close();
  }

  //Update the datamodel by push new element to array
  private _addModel(model: IApiModel) {
    //Add model in the data
    let models = this.data.getModels();
    models.push(model)
    this.data.setModels(models);

    this.dataSource.data.push(model);
    this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
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
    this._subscriptions.push(this.translate.get(["models.admin.dialog.delete.header","models.admin.dialog.delete.content"]).subscribe( trans => {
      let dialogRef = this.dialog.open(MakeSureDialogComponent, {
        disableClose :true,
        panelClass : "admin-theme",
        data:  {title: trans['models.admin.dialog.delete.header'],
                text:trans['models.admin.dialog.delete.content']
              } 
      });
      this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
        if (result) {   
          this.spinner.show();
          this._subscriptions.push(this.api.deleteModel(id).subscribe(res=> {
            this._deleteModel(id);
            this.spinner.hide();
          },()=>this.spinner.hide()));           
        } 
      }));    
    }));
  }

  //Update the data model
  private _deleteModel(id:number) {
    
    //Delete the model in the data
    let models = this.data.getModels();
    models.splice(models.findIndex(obj => obj.id === id), 1); 
    this.data.setModels(models);
    //Delete all products of the model
    let products = this.data.getProducts();
    this.data.setProducts(products.filter(obj => obj.model_id != id));


    //Find the corresponding datasource element
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === id);
    this.dataSource.data.splice(itemIndex, 1); 

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
    this.spinner.show();
    this._subscriptions.push(this.api.updateModel(id,value.name).subscribe((res: IApiModel) => {
        this._updateModel(res);
        this.spinner.hide();
    },()=>this.spinner.hide()));
  }

  //Update the datamodel
  private _updateModel(model:IApiModel) {
    //Delete the model in the data
    let models = this.data.getModels();
    models[models.findIndex(obj => obj.id === model.id)] = model; 
    this.data.setModels(models);

    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === model.id);
    this.dataSource.data[itemIndex] = model;
    this.applyFilter(this.lastFilter);
    this.table.renderRows();
  }

  //When we click on update we update the expanded pannel values
  onUpdateModel(id) {
    let model : IApiModel = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
    this.myFormUpdate.controls['name'].setValue(model.name);
  }

  //When row is clicked we need to redirect to brand models page
  rowClick(brand) {
    //this.data.setCurrentBrand(brand);
    this.setSelected(brand.id);
    this.onModelSelected.emit(brand);
  }

  setSelected(id) {
    this.selected = [];
    for (let brand of this.dataSource.data) {
      this.selected[brand.id] = false;
    }
    this.selected[id] = true;
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  

}
