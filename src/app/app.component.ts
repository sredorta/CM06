import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import {LoginComponent} from './_auth/login/login.component';
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
  initialLoading : boolean = true;
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
              media: MediaMatcher) {
    this.translate.use("fr");

    //Initial loading
    this.spinner.show()
    this._subscriptions.push(this.api.getConfig().subscribe( (res : IApiConfig[]) => {
      this.data.setConfig(res);
      this._subscriptions.push(this.api.getAuthUser().subscribe((res: IApiUserAuth)=> {
        //If we return empty it means user has been removed in db
        if (res) {
          if (res.id == null) {
            User.removeToken();
          } else {
            this.user = new User(res);
            //If User is adming then start polling for orders
            console.log("BEFORE POLL !");
            this.pollOrders();
          }  
        }
        this.api.setCurrent(res); 
        this.spinner.hide();
        this.initialLoading = false;
      },()=> {
        this.initialLoading = false;
        this.spinner.hide();
      }));
      
    }));


    //Get the user
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
  }  

  //Do polling on new orders and update the counter
  pollOrders() {
    if (this.user.isAdmin()) {
      interval(1000*60 * 5)    //Polling every xMin
      .pipe(
        startWith(1000*20),
        switchMap(() => this.api.getOrdersCount())
      )
      .subscribe(res => {
        console.log("POLL");console.log(res);
        if (res > 0)
          this.orderCount = res;
      })
    ;
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
    console.log("onActivate !");
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
