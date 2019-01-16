import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payement-securise',
  templateUrl: './payement-securise.component.html',
  styleUrls: ['./payement-securise.component.scss']
})
export class PayementSecuriseComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }
  //Go back 
  goBack() {
    this._location.back(); 
  }

}
