import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../_services/data.service';
import {Config, EApiConfigKeys} from '../_models/config';
@Component({
  selector: 'app-conditions-generales-vente',
  templateUrl: './conditions-generales-vente.component.html',
  styleUrls: ['./conditions-generales-vente.component.scss']
})
export class ConditionsGeneralesVenteComponent implements OnInit {
 @Input() onlyText : boolean = false;
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
