import { Component, OnInit, ViewChild, SimpleChanges,Output,EventEmitter,Input } from '@angular/core';
import {InputImagesComponent} from '../../_library/input-images/input-images.component';
import {NiceDateFormatPipe} from '../../_pipes/nice-date-format.pipe';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {MatExpansionPanel, MatSlideToggleChange, MatCheckboxChange} from '@angular/material';
import {MatTable, MatPaginator, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {CustomValidators, ParentErrorStateMatcher  } from '../../_helpers/custom.validators';
import { ApiService, IApiOrder} from '../../_services/api.service';
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
import { Order } from '../../_models/order';
import {Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, flatMap, map, tap,mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ], 
})

export class OrdersComponent implements OnInit {
  dataSource = null;          //Store orders array in table format
  displayedColumns: string[] = ['paypalOrderId','total','status','created','modify','delete'];
  displayedCount : number = 0;
  totalCount : number = 0;
  lastFilter : string = null;
  isMobile = this.device.isMobile();
//  currentUser : User = new User(null);
  selected = [];
  expandedOrderId : number = 0;
  enableToggle : boolean = false;
  keyUp = new Subject<string>();
  searchString : string = "";
  orders : Order[] = [];
  private _subscriptions : Subscription[] = new Array<Subscription>();

  @ViewChild('myTable') table : MatTable<any>;   
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( private translate: TranslateService, 
               private api : ApiService,
               private data: DataService,
               private spinner: SpinnerOverlayService,
               private device: DeviceDetectorService,
               private dialog: MatDialog) { }


  ngOnInit() {
    //Apply the filter with some debounce in order to avoid too slow input
    this._subscriptions.push(this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        delay(100),
      )),
    ).subscribe(res => {
      this.searchString = res;
      console.log("FILTER: " + res);
      this.applyFilter(res);
    }));    
    this.getOrders();
  }

  getOrders() {
      this.spinner.show();
      this._subscriptions.push(this.api.getOrders().subscribe((res: IApiOrder[]) => {
        for(let orderI of res) {
          this.orders.push(new Order(orderI));
        }
        this.initTable(this.orders);
        this.spinner.hide();
      }, () => this.spinner.hide()));
  
  }



  initTable(data) {

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.totalCount = this.dataSource.data.length;
    this.displayedCount = this.totalCount;
    //Override filter
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.paypalOrderId.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter) || data.firstName.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter);
    };
    //Apply filter with value of the string of search !!!!!!!
    this.applyFilter(this.searchString);
  }

  //Filter
  applyFilter(filterValue: string) {
    if(filterValue!== null) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
     this.displayedCount = this.dataSource.filteredData.length;
     this.lastFilter = filterValue;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Delete an user
  onDeleteOrder(id:number) {
    this._subscriptions.push(this.translate.get(["orders.admin.dialog.delete.header","orders.admin.dialog.delete.content"]).subscribe( trans => {
      let dialogRef = this.dialog.open(MakeSureDialogComponent, {
        disableClose :true,
        panelClass : "admin-theme",
        data:  {title: trans['orders.admin.dialog.delete.header'],
                text:trans['orders.admin.dialog.delete.content']
              } 
      });
      this._subscriptions.push(dialogRef.afterClosed().subscribe((result : boolean) => {
        if (result) {   
          this.spinner.show();
          this._subscriptions.push(this.api.deleteOrder(id).subscribe(res=> {
            this._deleteOrder(id);
            this.spinner.hide();
          },()=>this.spinner.hide()));           
        } 
      }));    
    }));
  }

  //Update the data model
  private _deleteOrder(id:number) {
    //Find the corresponding datasource element
    const itemIndex = this.orders.findIndex(obj => obj.id === id);
    this.orders.splice(itemIndex, 1); 
    this.initTable(this.orders);
  }


  //When we click on update we update the expanded pannel values
  onDetailsOrder(id) {
    let order : Order = this.dataSource.data[this.dataSource.data.findIndex(obj => obj.id === id)];
    this.expandedOrderId = id;
    this.enableToggle = false;
  }

  onUpdatedOrder(order: Order) {
    console.log("updateOrder");
    console.log(order);
    const itemIndex = this.orders.findIndex(obj => obj.id === order.id);
    this.orders[itemIndex] = order; 
    this.initTable(this.orders);
  }


  rowClick(order : Order) {
    console.log("rowClick");
    console.log(order);
  }



  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}
