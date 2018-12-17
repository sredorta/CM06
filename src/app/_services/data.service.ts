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
import { ApiService, EApiImageSizes, IApiBrand } from '../_library/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _brands = new BehaviorSubject<IApiBrand[]>(null); //Stores the current user

  constructor(private api : ApiService) { }

  public getBrands() : Observable<IApiBrand[]> {
    //If brands is null we call the api and get all brands
    if (this._brands.value == null) {
      this.api.getBrands(EApiImageSizes.thumbnail).subscribe((res : IApiBrand[]) => {
        this._brands.next(res);
      });
    }
    return this._brands;
  }

  //Sets all available brands
  public setBrands(brands: IApiBrand[]) {
    this._brands.next(brands);
  }




}
