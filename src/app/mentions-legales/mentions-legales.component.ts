import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../_services/data.service';
import {Config, EApiConfigKeys} from '../_models/config';
@Component({
  selector: 'app-mentions-legales',
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.scss']
})
export class MentionsLegalesComponent implements OnInit {
  config : Config = new Config(this.data.getConfig());
  address : string = this.config.get(EApiConfigKeys.address);
  constructor(private _location: Location, private data: DataService) { }

  ngOnInit() {
  }
  //Go back 
  goBack() {
    this._location.back(); 
  }
}
