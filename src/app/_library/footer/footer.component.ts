import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private fb:FacebookService) { }

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
