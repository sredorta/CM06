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
import { ApiService, EApiImageSizes, IApiBrand, IApiModel, IApiProduct, IApiUser } from '../_services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _brands : IApiBrand[] = [];       //Stores downloaded brands
  private _models : IApiModel[] = [];
  private _products : IApiProduct[] = [];   //Stores downloaded products
  private _users : IApiUser[] = [];              //Stores downloaded users

  constructor(private api : ApiService) { }

  public getBrands() : IApiBrand[] {
    return this._brands;
  }

  //Sets all available brands
  public setBrands(brands: IApiBrand[]) {
    this._brands = brands;
  }

  public getModels() : IApiModel[] {
    return this._models;
  }

  //Sets all available models
  public setModels(models: IApiModel[]) {
    this._models = models;
  }

  public getProducts() : IApiProduct[] {
    return this._products;
  }

  //Sets all available brands
  public setProducts(products: IApiProduct[]) {
    this._products = products;
  }

  public getUsers() : IApiUser[]  {
    return this._users;
  }

  //Sets all available brands
  public setUsers(users: IApiUser[]) {
    this._users = users;
  }
}
