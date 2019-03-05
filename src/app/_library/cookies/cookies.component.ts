
import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';
import { DataService } from '../../_services/data.service';

declare var ga: Function;
//(arg1:string, arg2:string,arg3:string);

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

  }
  accept() {
    this.data.setCookies(true);
    localStorage.setItem("cookies", "accepted");
    (<any>window).ga('create', 'UA-134152067-1', 'auto');// add your tracking ID here.
    (<any>window).ga('set', 'page', "");
    (<any>window).ga('send', 'pageview');
    this.bottomSheetRef.dismiss();
  }
  reject() {
    this.data.setCookies(false);
    localStorage.setItem("cookies", "rejected");
    (<any>window).ga('remove');
    this.bottomSheetRef.dismiss();
  }
 

}