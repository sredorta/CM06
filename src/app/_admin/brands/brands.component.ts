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
  loading  : boolean = true;
  dataSource = null;          //Store products array in table format
  expandedElement: any = null;   //Expanded panel for description
  displayedColumns: string[] = ['id','image','name','description'];

  myForm: FormGroup; 
  private _subscriptions : Subscription[] = new Array<Subscription>();
  constructor(private api : ApiService) { }
  @ViewChild('expansion') expansion : MatExpansionPanel;
  createForm() {
    this.myForm =  new FormGroup({    
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])),
      description: new FormControl('', Validators.compose([
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
      //Override filter
     /* this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.idGMA.toLowerCase().includes(filter) || 
        data.cathegory.toLowerCase().includes(filter) ||
        data.type.toLowerCase().includes(filter) ||
        data.description.toLowerCase().includes(filter) ||
        data.brand.toLowerCase().includes(filter);
    };*/
    }));    
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
    this._subscriptions.push(this.api.createBrand(value.name,value.description,value.image).subscribe(res => {
      console.log(res);
      let brands : any[] =  new Array<any>();
      for (let brand of res) {
        console.log(brand);
        //product = new Product(product);
        //products.push(product);
      }
      /*this.dataSource = new MatTableDataSource(products);
      //Override filter
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.idGMA.toLowerCase().includes(filter) || 
        data.cathegory.toLowerCase().includes(filter) ||
        data.type.toLowerCase().includes(filter) ||
        data.description.toLowerCase().includes(filter) ||
        data.brand.toLowerCase().includes(filter);
    };*/
    }));
    this.myForm.reset();
    //let result = new Product(value);
    //result.image = this.photo;
    //this.create.emit(result);
  }

  rowClick(row) {
    console.log("Clicked " + row);
  }

}
