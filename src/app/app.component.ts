import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import {LoginComponent} from './_auth/login/login.component';
import {CookiesComponent} from './_library/cookies/cookies.component';
import { TranslateService } from '@ngx-translate/core'; //NGX-TRANSLATE
import {User} from './_models/user';
import {ApiService, IApiUserAuth, EApiImageSizes, IApiBrand, IApiProduct, IApiConfig} from './_services/api.service';
import {DataService} from './_services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import {CartDialogComponent} from './cart-dialog/cart-dialog.component';
import { calcBindingFlags } from '@angular/core/src/view/util';
import {Cart} from './_models/cart';
import { SpinnerOverlayService } from './_library/spinner-overlay.service';
import {interval} from "rxjs/internal/observable/interval";
import {startWith, switchMap} from "rxjs/operators";
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
  cartCount : number;
  orderCount : number;
//  initialLoading : boolean = true;
  configLoading : boolean = true;
  authLoading : boolean = true;
  isOrderPage : boolean = false;
  private _mobileQueryListener: () => void;

  private _subscriptions : Subscription[] = new Array<Subscription>();

  constructor(private data : DataService, 
              private api: ApiService, 
              private router : Router, 
              private spinner : SpinnerOverlayService,
              private device : DeviceDetectorService,
              private translate: TranslateService, 
              private dialog: MatDialog,
              changeDetectorRef: ChangeDetectorRef, 
              media: MediaMatcher,
              private bottomSheet: MatBottomSheet) {
    this.translate.use("fr");

    //Initial loading
    this._subscriptions.push(this.api.getConfig().subscribe( (res : IApiConfig[]) => {
      this.data.setConfig(res);
    }, error => {
      this.configLoading = false;
    }, () => {this.configLoading = false; this.showCookies()} ));

    //SetUp cookies status
    if (localStorage.getItem("cookies") == "accepted") 
    this.data.setCookies(true);

    this._subscriptions.push(this.api.getAuthUser().subscribe((res: IApiUserAuth)=> {
      //If we return empty it means user has been removed in db
      if (res) {
        if (res.id == null) {
          User.removeToken();
        } else {
          this.user = new User(res);
          //If User is admin then start polling for orders
          this.pollOrders();
        }  
      }
      this.api.setCurrent(res); 
      this.authLoading = false;
    },()=> {
      this.authLoading = false;
    }));

    //Get the user if there are any changes
    this._subscriptions.push(this.api.getCurrent().subscribe((res:User) => {
      this.user = res; 
    }));

    //Get the cart
    let cart = new Cart();
    cart.fromStorage();
    this.data.setCart(cart);
    this.cartCount = cart.getCount();
    this._subscriptions.push(this.data.getCart().subscribe(res => {
      this.cartCount = res.getCount();
    }));

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);   

    //Subscribe to router changes and send the page at each route navigation for Google Analytics
    this._subscriptions.push(this.router.events.subscribe(event => {
      //Do not show cart icon if we are in /commande route
      if (this.router.url == "/commande") {
        this.isOrderPage = true;
      } else {
        this.isOrderPage = false;
      }
      //Send google Analytics if cookies accepted
      if (localStorage.getItem("cookies") == "accepted") {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      }
    }));
  }  

  showCookies() {
     if(localStorage.getItem("cookies") === null)
      this.bottomSheet.open(CookiesComponent, {});
  
  }
  //Do polling on new orders and update the counter
  pollOrders() {
    if (this.user.isAdmin()) {
      setTimeout( () => {
      interval(1000*60 * 5)    //Polling every xMin
      .pipe(
        startWith(1000*20),
        switchMap(() => this.api.getOrdersCount())
      )
      .subscribe(res => {
        if (res > 0)
          this.orderCount = res;
      })},5000);

    }
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

  //Open cart dialog  
  openCartDialog(): void {
    let dialogRef = this.dialog.open(CartDialogComponent, {
      panelClass: 'cart-dialog',
      width: '300px',
      height: '100vh',
      position: {top:'0',right:'0'},
      data:  null 
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.myForm.patchValue({"terms" : result});
    });
  }

  //Each time a route is activated we come here
  onActivate(event) {
    //Scroll to sidenav top !
    const contentContainer = document.querySelector('.mat-sidenav-content') || window;
    contentContainer.scrollTo(0, 0);
  }  



  //Remove all subscriptions
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    for (let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }  
}
