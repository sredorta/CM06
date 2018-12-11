import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import {LoginComponent} from './_library/auth/login/login.component';
import { TranslateService } from '@ngx-translate/core'; //NGX-TRANSLATE
import {User} from './_library/models/user';
import {ApiService, IApiUserAuth} from './_library/services/api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  user : User = new User(null);
  loading : boolean = true;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private api: ApiService, private router : Router, private translate: TranslateService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.translate.use("fr");

    //This needs to be moved into config page
    this._subscriptions.push(this.api.getAuthUser().subscribe((res: IApiUserAuth)=> {
      this.api.setCurrent(res); 
    }));

    this._subscriptions.push(this.api.getCurrent().subscribe((res:User) => {
      this.user = res; 
      this.loading = false;
    }));

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);   
  }  

  logout() {
    this._subscriptions.push(this.api.logout().subscribe(res=> {
        this.api.setCurrent(null);
        User.removeToken();
        this.router.navigate([""]); //Go back home
    }));
  }       

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
