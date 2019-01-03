import { Component, OnInit, ViewChild, SimpleChanges,Output,EventEmitter,Input } from '@angular/core';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {NiceDateFormatPipe} from '../../_pipes/nice-date-format.pipe';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiBrand, IApiProduct} from '../../_services/api.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import {MessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
//import { MediaMatcher } from '@angular/cdk/layout';
import {BreakpointObserver,Breakpoints,BreakpointState} from '@angular/cdk/layout';
import {DataService} from '../../_services/data.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ], 
})
export class MembersComponent implements OnInit {
  dataSource = null;          //Store members array in table format
  displayedColumns: string[] = ['image','last','first','email','phone','created','modify','delete'];
  displayedCount : number = 0;
  totalCount : number = 0;
  lastFilter : string = null;
  defaultImage :string = "./assets/images/userdefault.jpg";

  private _subscriptions : Subscription[] = new Array<Subscription>();
  selected = [];


  //@ViewChild('inputImage') inputImage : InputImagesComponent;
  //@ViewChild('inputImageUpdate') inputImageUpdate : InputImagesComponent;
  @ViewChild('myTable') table : MatTable<any>;   

  constructor( private translate: TranslateService, 
               private api : ApiService,
               private data: DataService,
               private spinner: SpinnerOverlayService) { }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    if (this.data.getUsers().length>1) {
       this.initTable(this.data.getUsers());
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getUsers().subscribe(res => {
        console.log("Got members !");
        console.log(res);
        this.data.setUsers(res);
        this.initTable(res);

        this.spinner.hide();
      }, () => this.spinner.hide()));
    }
  }

  getImageUrl(user: any) {
    if (user.avatar)
        return "url(" + user.avatar.sizes['thumbnail'].url + ")";
    return "url(" + this.defaultImage + ")";  
  }

  initTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.totalCount = this.dataSource.data.length;
    this.displayedCount = this.totalCount;
    //Override filter
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.lastName.toLowerCase().includes(filter) || data.firstName.toLowerCase().includes(filter) || data.mobile.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
    };
  }

  //Filter
  applyFilter(filterValue: string) {
    if(filterValue!== null) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     this.displayedCount = this.dataSource.filteredData.length;
     this.lastFilter = filterValue;
    }
 }


  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}
