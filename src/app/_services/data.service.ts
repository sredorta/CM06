//Contains all data sharing service
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { ApiService, EApiImageSizes, IApiBrand, IApiModel, IApiProduct, IApiUser, IApiConfig } from '../_services/api.service';
import {Cart, CartItem} from '../_models/cart';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _config : IApiConfig[] = [];       //Stores global info of project, address...
  private _brands : IApiBrand[] = [];        //Stores downloaded brands
  private _models : IApiModel[] = [];        //Stores downloaded models
  private _products : IApiProduct[] = [];    //Stores downloaded products
  private _users : IApiUser[] = [];          //Stores downloaded users
  private _HOLDDATASECONDS : number = 60*60; //Hold data for 1hr and if not reload 
  private _timeStamps : string[] = [];      //Stores timestamps
  private _cart = new BehaviorSubject<number>(Cart.getCount()); //Stores the current user



  constructor(private api : ApiService) { }


  public setConfig(data: IApiConfig[]) {
    this._config = data;
  }

  public getConfig() : IApiConfig[] {
    return this._config;
  }


  public getBrands() : IApiBrand[] {
    if (this._timeStamps["brands"] !== undefined) {
      let diff = (new Date().getTime() - this._timeStamps["brands"])/1000;
      if (diff> this._HOLDDATASECONDS) {
        this._brands = [];
      }
    } 
    return this._brands;
  }

  //Sets all available brands
  public setBrands(brands: IApiBrand[], api = false) {
    if (api) {
      this._timeStamps["brands"] = new Date().getTime()
    }
    this._brands = brands;
  }


  public getModels() : IApiModel[] {
    if (this._timeStamps["models"] !== undefined) {
      let diff = (new Date().getTime() - this._timeStamps["models"])/1000;
      if (diff> this._HOLDDATASECONDS) {
        this._models = [];
      }
    } 
    return this._models;
  }

  //Sets all available models
  public setModels(models: IApiModel[], api=false) {
    if (api) {
      this._timeStamps["models"] = new Date().getTime()
    }
    this._models = models;
  }

  public getProducts() : IApiProduct[] {
    if (this._timeStamps["products"] !== undefined) {
      let diff = (new Date().getTime() - this._timeStamps["products"])/1000;
      if (diff> this._HOLDDATASECONDS) {
        this._products = [];
      }
    } 
    return this._products;
  }

  //Sets all available brands
  public setProducts(products: IApiProduct[], api = false) {
    if (api) {
      this._timeStamps["products"] = new Date().getTime()
    }
    this._products = products;
  }

  public getUsers() : IApiUser[]  {
    if (this._timeStamps["users"] !== undefined) {
      let diff = (new Date().getTime() - this._timeStamps["users"])/1000;
      if (diff> this._HOLDDATASECONDS) {
        this._users = [];
      }
    } 
    return this._users;
  }

  //Sets all available brands
  public setUsers(users: IApiUser[], api = false) {
    if (api) {
      this._timeStamps["users"] = new Date().getTime()
    }
    this._users = users;
  }



  //Returns current user
  getCartCount() : Observable<number> {
    return this._cart;
  }

  //Sets current user
  setCartCount(count: number) {
    console.log("setCurrent::");
    console.log(count);
    this._cart.next(count);
  }

}
