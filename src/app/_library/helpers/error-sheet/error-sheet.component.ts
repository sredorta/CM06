
import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';

//////////////////////////////////////////////////////////////////////////////////////////
//This is a bottom sheet that is shown when we intercept the response of any http
// The input data is:
//  type: "success" or "error" -> determines the colors
//  code: http response code -> determines the icon
//  message: Text that we need to display
/////////////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-error-sheet',
  templateUrl: './error-sheet.component.html',
  styleUrls: ['./error-sheet.component.scss']
})
export class ErrorSheetComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<ErrorSheetComponent>) { }

  ngOnInit() {
  }
  setClasses() {
    return {
      "http-alert-message": this.data.type == "success"?false:true,
      "http-success-message": this.data.type == "success"?true:false,
    }
  }
}
