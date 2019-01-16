import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-conditions-generales-vente',
  templateUrl: './conditions-generales-vente.component.html',
  styleUrls: ['./conditions-generales-vente.component.scss']
})
export class ConditionsGeneralesVenteComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }

  //Go back 
  goBack() {
      this._location.back(); 
  }

}
