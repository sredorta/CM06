import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import {LoginComponent} from './_auth/login/login.component';
import { TranslateService } from '@ngx-translate/core'; //NGX-TRANSLATE
import {User} from './_models/user';
import {ApiService, IApiUserAuth, EApiImageSizes, IApiBrand, IApiProduct} from './_services/api.service';
import {DataService} from './_services/data.service';
import {InitComponent} from './init/init.component';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  isMobile : boolean =  this.device.isMobile();
  private _mobileQueryListener: () => void;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, 
              private api: ApiService, 
              private router : Router, 
              private device : DeviceDetectorService,
              private translate: TranslateService, 
              changeDetectorRef: ChangeDetectorRef, 
              media: MediaMatcher) {
    this.translate.use("fr");


/*    this._subscriptions.push(this.api.getBrands(EApiImageSizes.thumbnail).subscribe((res : IApiBrand[])=> {
      //Get brands once and store in the global vars
      console.log("We got all brands !!!");
      console.log(res);
      this.data.setBrands(res);
*/
    //This needs to be moved into config page
    this._subscriptions.push(this.api.getAuthUser().subscribe((res: IApiUserAuth)=> {
      this.api.setCurrent(res); 
/*      this._subscriptions.push(this.api.getBrands().subscribe((res:IApiBrand[]) => {
        this.data.setBrands(res);
        console.log("Setted brands !!!!!!");
        this.loading = false;
        this._subscriptions.push(this.api.getProducts().subscribe((res:IApiProduct[])=> {
            this.data.setProducts(res);
            this.loading = false;
        }));
      }));*/
      //this.loading = false;
      console.log("Finished loading !!!");
    }));

    this._subscriptions.push(this.api.getCurrent().subscribe((res:User) => {
      this.user = res; 
      //this.loading = false;
    }));

//    }));


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

  //Goes to the route with delay to show animation on mobile
  goToRoute(route:string[]) {
    if (this.isMobile)
      setTimeout( () => {
        this.router.navigate(route);
      },500);
    else 
      this.router.navigate(route);  
  }

  //Remove all subscriptions
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
