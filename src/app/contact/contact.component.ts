import { Component, OnInit } from '@angular/core';
import {DataService} from '../_services/data.service';
import {IApiConfig} from '../_services/api.service';
import {Config, EApiConfigKeys} from '../_models/config';
import { Subscription } from 'rxjs';
import {NiceDateFormatPipe} from '../_pipes/nice-date-format.pipe';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  config : Config = new Config(this.data.getConfig());
 /* message_title = this.config.get(EApiConfigKeys.message_title);
  message_text = this.config.get(EApiConfigKeys.message_text);
  lat : number = parseFloat(this.config.get(EApiConfigKeys.latitude));
  lng: number = parseFloat(this.config.get(EApiConfigKeys.longitude));
  zoom:number = parseInt(this.config.get(EApiConfigKeys.zoom));;*/
  
  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data: DataService) { }

  ngOnInit() {
    //console.log("OnInit contact");
    //console.log(this.data.getConfig());
    //this.config =  new Config(this.data.getConfig());
  }

  ngOnDestroy() {    
    //Unsubscribe to all
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  } 
}
