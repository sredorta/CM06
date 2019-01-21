import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import { environment } from '../../../environments/environment';
import {Config} from '../../_models/config';
import {DataService} from '../../_services/data.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  config : Config = new Config(this.data.getConfig());
  constructor(private fb:FacebookService, private data : DataService) { }

  ngOnInit() {
        //FB part to be moved to footer
        let initParams: InitParams = {
          appId: environment.fbKey,
          xfbml: true,
          version: 'v2.8'
        };
        this.fb.init(initParams);
  }

}
