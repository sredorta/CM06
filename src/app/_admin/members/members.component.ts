import { Component, OnInit, ViewChild, SimpleChanges,Output,EventEmitter,Input } from '@angular/core';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {NiceDateFormatPipe} from '../../_pipes/nice-date-format.pipe';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel, MatSlideToggleChange, MatCheckboxChange} from '@angular/material';
import {MatTable, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { ApiService, EApiImageSizes, IApiUser} from '../../_services/api.service';
import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MakeSureDialogComponent} from '../../_library/make-sure-dialog/make-sure-dialog.component';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
//import { MediaMatcher } from '@angular/cdk/layout';
import {BreakpointObserver,Breakpoints,BreakpointState} from '@angular/cdk/layout';
import {DataService} from '../../_services/data.service';
import {SpinnerOverlayService} from '../../_library/spinner-overlay.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { User } from '../../_models/user';

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
  isMobile = this.device.isMobile();
  currentUser : User = new User(null);
  selected = [];
  expandedUserId : number = 0;
  enableToggle : boolean = false;
  disabledValidated : boolean = false;
  disabledAdmins : boolean = false;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  @ViewChild('myTable') table : MatTable<any>;   

  constructor( private translate: TranslateService, 
               private api : ApiService,
               private data: DataService,
               private spinner: SpinnerOverlayService,
               private device: DeviceDetectorService,
               private dialog: MatDialog) { }

  ngOnInit() {
    this.getMembers();
    this.api.getCurrent().subscribe(res => {
      this.currentUser = res;
    })
  }

  getMembers() {
    if (this.data.getUsers().length>1) {
       this.initTable(this.data.getUsers());
    } else {
      this.spinner.show();
      this._subscriptions.push(this.api.getUsers().subscribe((res: IApiUser[]) => {
        this.data.setUsers(res,true);
        this.initTable(res);
        this.spinner.hide();
      }, () => this.spinner.hide()));
    }
  }

  //Geneate mailto all emails
  getEmails() {
    let emails = "";
    for (let member of this.data.getUsers()) {
      if (emails != "")
        emails = emails + ";" + member.email;
      else  
        emails = member.email;  
    }
    return "mailto:" + emails;
  }

  getImageUrl(user: IApiUser) {
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

  //Delete an user
  onDeleteUser(id:number) {
      this._subscriptions.push(this.api.deleteUser(id).subscribe((res) => {
        let data = this.data.getUsers();
        data.splice(data.findIndex(obj => obj.id === id),1);
        this.data.setUsers(data);
        this.initTable(data);
        this.spinner.hide();
      },error => {
        this.spinner.hide();
      }));      

  }

  //When we click on update we update the expanded pannel values
  onDetailsUser(id) {
    let user : IApiUser = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
    this.expandedUserId = id;
    this.enableToggle = false;
  }

  //When we toggle tha admin of a member
  toggleAdmin(member: IApiUser, data : MatSlideToggleChange) {
    this.spinner.show();
    if(data.checked) {
      this._subscriptions.push(this.api.createAccountAdmin(member.id).subscribe((res) => {
        let index = this.dataSource.data.findIndex(obj => obj.id === member.id);
        this.dataSource.data[index].isAdmin = 1;
        this.table.renderRows();
        this.spinner.hide();
      },error => {
        let index = this.dataSource.data.findIndex(obj => obj.id === member.id);
        this.dataSource.data[index].isAdmin = 0;
        this.table.renderRows();
        this.expandedUserId = 0;
        this.spinner.hide();
      }));
    } else {
      this._subscriptions.push(this.api.deleteAccountAdmin(member.id).subscribe((res) => {
        let index = this.dataSource.data.findIndex(obj => obj.id === member.id);
        this.dataSource.data[index].isAdmin = 0;
        this.table.renderRows();
        this.spinner.hide();
      },error => {
        let index = this.dataSource.data.findIndex(obj => obj.id === member.id);
        this.dataSource.data[index].isAdmin = 1;
        this.table.renderRows();
        this.expandedUserId = 0;
        this.spinner.hide();
      }));
    }

  }

  //Filter accounts with validated accounts only
  showOnlyValidated(checkbox:MatCheckboxChange) {
    if (checkbox.checked) {
      this.disabledAdmins = true;
      this.initTable(this.dataSource.data.filter(obj => obj.isEmailValidated === 1));
    } else {
      this.disabledAdmins = false;
      this.getMembers();
    }
  }

  //Filter admin accounts
  showOnlyAdmins(checkbox:MatCheckboxChange) {
    if (checkbox.checked) {
      this.disabledValidated = true;
      this.initTable(this.dataSource.data.filter(obj => obj.isAdmin === 1));
    } else {
      this.disabledValidated = false;
      this.getMembers();
    }
  }


  rowClick(user : IApiUser) {
    console.log("rowClick");
    console.log(user);
  }



  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}
