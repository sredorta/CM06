import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-mentions-legales',
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.scss']
})
export class MentionsLegalesComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }
  //Go back 
  goBack() {
    this._location.back(); 
  }
}
