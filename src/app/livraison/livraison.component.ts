import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.scss']
})
export class LivraisonComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }

  //Go back 
  goBack() {
      this._location.back(); 
  }

}
