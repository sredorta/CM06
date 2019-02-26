
import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';
import { DataService } from '../../_services/data.service';

declare function ga(arg1:string, arg2:string,arg3:string);

//////////////////////////////////////////////////////////////////////////////////////////
//This is a bottom sheet that is shown when we intercept the response of any http
// The input data is:
//  type: "success" or "error" -> determines the colors
//  code: http response code -> determines the icon
//  message: Text that we need to display
/////////////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<CookiesComponent> , private data : DataService) { }

  ngOnInit() {
/*    setTimeout(()=> {
      this.bottomSheetRef.dismiss();
    },20000);*/
  }
  accept() {
    this.data.setCookies(true);
    localStorage.setItem("cookies", "accepted");
    ga('create', 'UA-134152067-1', 'auto');// add your tracking ID here.
    this.bottomSheetRef.dismiss();
  }
  reject() {
    this.data.setCookies(false);
    localStorage.setItem("cookies", "rejected");
    this.bottomSheetRef.dismiss();
  }
 

}