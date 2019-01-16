import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';

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
          appId: '397476587654542',
          xfbml: true,
          version: 'v2.8'
        };
        this.fb.init(initParams);
  }

}
