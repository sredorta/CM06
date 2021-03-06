import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {User} from '../_models/user';
import {Order} from '../_models/order';
import {Cart} from '../_models/cart';

export interface IApiConfig {
  id: number;
  key: string;
  value: string;
  created_at:string;
  updated_at:string;
}

export interface IApiLogin {
  token?:string;
  access?: Array<string>;
}


export interface IApiUserAuth {
  id:number;
  firstName:string;
  lastName:string;
  email:string;
  mobile:string;
  language:string;
  updated_at:string;
  created_at:string;
  account:string;
  notifications:number;
  messages:number;
  roles:Array<String>;
  groups:Array<String>;
  avatar:any;
}

export interface IApiBrand {
  id:number;
  name:string;
  image: IApiAttachment;
}

export interface IApiModel {
  id:number;
  name:string;
  brand_id:number;
}


export interface IApiUser {
  id:number;
  firstName:string;
  lastName:string;
  email:string;
  mobile:string;
  created_at?:string;
  updated_at?:string;
  language?:string;
  isEmailValidated?:boolean;
  isAdmin:boolean;
  avatar:IApiAttachment;
}


export interface IApiAttachment {
  id?:number;
  title?:string;
  description?:string;
  url?:string;
  alt_text?:string;
  mime_type?:string;
  file_name?:string;
  file_extension?:string;
  file_size?:number;
  created_at?:string;
  updated_at?:string;
  sizes?:IApiImage[];
}

export interface IApiImage {
  url:string;
  with:number;
  height:number;
  file_size:number;
}

export interface IApiModel {
  id:number;
  name:string;
}

//Different image sizes that are stored in the database if thumbs are generated (no default image)
export enum EApiImageSizes  {
  full = "full", 
  large = "large", 
  big = "big", 
  medium = "medium", 
  small = "small", 
  thumbnail = "thumbnail", 
  tinythumbnail = "tinythumbnail"
}


export interface IApiProduct {
  id:number;
  title:string;
  description:string;
  price:number;
  discount:number;
  stock: number;
  isVehicle : boolean;
  isNew : boolean;
  isDeliverable : boolean;
  weight : number;
  created_at: string;  
  updated_at: string;
  brand:string;
  brand_url:string;
  model:string;
  brand_id:number;
  model_id:number; 
  images: IApiAttachment[];
}

export interface IApiOrder {
  id:number;
  firstName:string;
  lastName:string;
  email:string;
  mobile:string;
  delivery:boolean;
  address1:string;
  address2:string;
  cp:string;
  city:string;
  cart: any[] | string;  
  status:string;
  tracking:string;
  total:number;
  created_at:string;
  updated_at:string;
}

@Injectable({
  providedIn: 'root'
})



export class ApiService {
  private _user = new BehaviorSubject<User>(new User(null)); //Stores the current user

  constructor(private http: HttpClient) { }

  //Returns current user
  getCurrent() : Observable<User> {
    return this._user;
  }

  //Sets current user
  setCurrent(user:IApiUserAuth) {
    this._user.next(new User(user));
  }


  public getConfig() : Observable<IApiConfig[]> {
    return this.http.get<IApiConfig[]>(environment.apiURL + '/config').map(res => <IApiConfig[]>res);
  }

  public setConfig(data:any) : Observable<IApiConfig[]> {
    return this.http.post<IApiConfig[]>(environment.apiURL + '/config',data).map(res => <IApiConfig[]>res)
  }


  public checkCart(cart:Cart) : Observable<any> {
    return this.http.post<any>(environment.apiURL + '/cart/check',{cart:cart.data}).map(res => <any>res)
  }

  public checkOrder(order:Order) : Observable<any> {
    let data = {
      firstName:  order.firstName,
      lastName:   order.lastName,
      email:      order.email,
      mobile:     order.mobile,
      delivery:   order.delivery,
      address1:   order.address1,
      address2:   order.address2,
      cp:         order.cp,
      city:       order.city,
      cart:       order.cart.data          
    };
    return this.http.post<any>(environment.apiURL + '/order/check',data).map(res => <any>res)
  }

  public createOrderIntent(order) : Observable<any> {
    let data = {
      user_id:    order.user_id,
      firstName:  order.firstName,
      lastName:   order.lastName,
      email:      order.email,
      mobile:     order.mobile,
      delivery:   order.delivery,
      address1:   order.address1,
      address2:   order.address2,
      cp:         order.cp,
      city:       order.city,
      cart:       order.cart.data,
      total:      order.total     
    };
    return this.http.post<any>(environment.apiURL + '/paymentintent',data).map(res => <any>res)
  } 

  public createOrder(order:Order, ccName:string, ccNumber:string, ccExpiryMonth:string, ccExpiryYear:string, cvvNumber:string) : Observable<any> {
    let data = {
      ccName:         ccName,
      ccNumber:       ccNumber,
      ccExpiryMonth:  ccExpiryMonth,
      ccExpiryYear:   ccExpiryYear,
      cvvNumber:      cvvNumber,
      user_id:    order.user_id,
      firstName:  order.firstName,
      lastName:   order.lastName,
      email:      order.email,
      mobile:     order.mobile,
      delivery:   order.delivery,
      address1:   order.address1,
      address2:   order.address2,
      cp:         order.cp,
      city:       order.city,
      cart:       order.cart.data      
    };
    return this.http.post<any>(environment.apiURL + '/payment',data).map(res => <any>res)

  }
  public getAuthOrders() : Observable<IApiOrder[]> {
    return this.http.get<IApiOrder[]>(environment.apiURL + '/order/getAuth').map(res => <IApiOrder[]>res);
  }

  public getOrders() : Observable<IApiOrder[]> {
    return this.http.get<IApiOrder[]>(environment.apiURL + '/order/get').map(res => <IApiOrder[]>res);
  }

  public getOrdersCount() : Observable<number> {
    return this.http.get<number>(environment.apiURL + '/order/getcount').map(res => <number>res);
  }

  public updateOrderStatus(id,status,tracking) :Observable<Order> {
    return this.http.post<IApiOrder>(environment.apiURL + '/order/updatestatus', {"id": id, "status":status, "tracking":tracking}).map(res => new Order(res));
  }

  public deleteOrder(id) :Observable<any> {
    return this.http.post<any>(environment.apiURL + '/order/delete', {"id": id}).map(res => <any>res);
  }


  public login(email:string, password:string, keepconnected:boolean, access:string) : Observable<IApiLogin> {
    return this.http.post<IApiLogin>(environment.apiURL + '/auth/login', {email, password, keepconnected,access}).map(res => <IApiLogin>res);;
  }

  //Creates user and returns token
  public signup(firstName:string,lastName:string,email:string,mobile:string,password:string, avatar: string) : Observable<any> { 
    let data = {
      'firstName' : firstName,
      'lastName'  : lastName,
      'email'     : email,
      'mobile'    : mobile,
      'password'  : password,
      'avatar'    : avatar
    };
    return this.http.post<any>(environment.apiURL +'/auth/signup', data);
  }

  public getUsers() : Observable<IApiUser[]> {
    return this.http.get<IApiUser[]>(environment.apiURL + '/users').map(res => <IApiUser[]>res);;
  }
  
  //Gets the authenticated user (current user, or null if token is not valid or no token)
  public getAuthUser() : Observable<IApiUserAuth> {
    return this.http.get<IApiUserAuth>(environment.apiURL+'/auth/user').map(res => <IApiUserAuth>res);
  }

  //Invalidates token for logout
  public logout() : Observable<any> {   
    return this.http.post<any>(environment.apiURL +'/auth/logout', {});
  }


  //Deletes current user
  public deleteAuth() : Observable<any> {
    return this.http.delete<any>(environment.apiURL +'/auth/deleteAuth');
  }  

  //Updates current user
  public updateUser(firstName:string,lastName:string,email:string,mobile:string,password_old:string, password:string, avatar: string) {
    let data = {
      'firstName' : firstName,
      'lastName'  : lastName,
      'email'     : email,
      'mobile'    : mobile,
      'password_old'  : password_old,
      'password_new'  : password,
      'avatar'    : avatar
    };
    return this.http.post<any>(environment.apiURL +'/auth/update', data);
  }


  //Resets password and send email to user
  public resetPassword(email:string,access:string) : Observable<any> {
    return this.http.post<any>(environment.apiURL +'/auth/resetpassword', {email,access});
  }  

  //Adds admin account for a user
  public createAccountAdmin(id:number) : Observable<any> {
    return this.http.post<any>(environment.apiURL +'/auth/account/create',{id:id,access:"Admin"});
  }

  //Removes admin account from user
  public deleteAccountAdmin(id:number) : Observable<any> {
    return this.http.post<any>(environment.apiURL +'/auth/account/delete',{id:id,access:"Admin"});
  }

  //Deletes user and its accounts
  public deleteUser(id:number) : Observable<any> {
    return this.http.post<any>(environment.apiURL +'/auth/user/delete',{id:id});
  }


  //Brands
  public createBrand(name:string, image:string) : Observable<IApiBrand>  {
    return this.http.post<IApiBrand>(environment.apiURL +'/brands/create', {'name': name, 'image' : image}).map(res => <IApiBrand>res);
  }

  public getBrands() : Observable<IApiBrand[]> {
    return this.http.get<IApiBrand[]>(environment.apiURL +'/brands').map(res => <IApiBrand[]>res);
  }

  public updateBrand(id:string,name:string,image:string) : Observable<IApiBrand>  {
    if (image == undefined) image = null;
    return this.http.post<IApiBrand>(environment.apiURL +'/brands/update', {'id':id, 'name':name, 'image':image}).map(res => <IApiBrand>res);
  }

  public deleteBrand(id:string) : Observable<any>  { 
    return this.http.post<any>(environment.apiURL +'/brands/delete', {"id":id});
  }

  //Models
  public createModel(idBrand:number, name:string) : Observable<IApiModel>  {  
    return this.http.post<IApiModel>(environment.apiURL +'/models/create', {"id": idBrand, "name":name}).map(res => <IApiModel>res);
  }
  public getModels() : Observable<IApiModel[]> {
    return this.http.get<IApiModel[]>(environment.apiURL +'/models').map(res => <IApiModel[]>res);
  }
  public deleteModel(id:string) : Observable<any>  { 
    return this.http.post<any>(environment.apiURL +'/models/delete', {"id":id});
  }

  public updateModel(id:string,name:string) : Observable<IApiModel>  {
    return this.http.post<IApiModel>(environment.apiURL +'/models/update', {"id":id, "name":name}).map(res => <IApiModel>res);
  }  

  public createProduct(idModel:number,title:string,description:string,price:number,discount:number,stock:number,isVehicle:boolean, isNew:boolean, isDeliverable:boolean, weight:number, images:Array<string>) : Observable<IApiProduct> {
    let data = {
      'model_id'    : idModel,
      'title'       : title,
      'description' : description,
      'price'       : price,
      'discount'    : discount,
      'stock'       : stock,
      'isVehicle'   : isVehicle,
      'isNew'       : isNew,
      'isDeliverable': isDeliverable,
      'weight'      : weight,
      'images'      : images
    };
    return this.http.post<IApiProduct>(environment.apiURL +'/products/create',data ).map(res => <IApiProduct>res);
  }

  public updateProduct(idProduct:number,title:string,description:string,price:number,discount:number,stock:number,isVehicle:boolean, isNew:boolean, isDeliverable:boolean, weight:number, images:Array<string>) : Observable<IApiProduct> {
    let data = {
      'id'          : idProduct,
      'title'       : title,
      'description' : description,
      'price'       : price,
      'discount'    : discount,
      'stock'       : stock,
      'isVehicle'   : isVehicle,
      'isNew'       : isNew,
      'isDeliverable': isDeliverable,
      'weight'      : weight,
      'images'      : images
    };
    return this.http.post<IApiProduct>(environment.apiURL +'/products/update',data ).map(res => <IApiProduct>res);
  }


  public getProducts() : Observable<IApiProduct[]> {
    return this.http.get<IApiProduct[]>(environment.apiURL +'/products').map(res => <IApiProduct[]>res);
  }
  
  public getProduct(id) : Observable<IApiProduct> {
    return this.http.post<IApiProduct>(environment.apiURL +'/product', {id:id}).map(res => <IApiProduct>res);
  }

  public deleteProduct(id:string) : Observable<any>  { 
    return this.http.post<any>(environment.apiURL +'/products/delete', {"id":id});
  }
}
