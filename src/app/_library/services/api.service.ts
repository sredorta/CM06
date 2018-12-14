import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {User} from '../models/user';

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
  image: IApiImage;
}

export interface IApiImage {
  url:string;
  size: EApiImageSizes;
  with:number;
  height:number;
  file_size:number;
  alt_text:string;
  title:string;
  description:string;
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
  created_at: string;  
  brand:IApiBrand;
  model:IApiModel; 
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
    console.log("setCurrent::");
    console.log(user);
    this._user.next(new User(user));
  }



  public login(email:string, password:string, keepconnected:boolean, access:string) : Observable<IApiLogin> {
    return this.http.post<IApiLogin>(environment.apiURL + '/auth/login', {email, password, keepconnected,access}).map(res => <IApiLogin>res);;
  }

  //Creates user and returns token
  /*public signup(firstName:string,lastName:string,email:string,mobile:string,password:string, avatar:string) : Observable<UserToken> {   
    return this.http.post<UserToken>(environment.apiURL +'/auth/signup', {firstName,lastName,email,mobile,password,avatar}).map(res => <UserToken>res);
  }*/
  public signup(firstName:string,lastName:string,email:string,mobile:string,password:string, avatar: File) : Observable<any> { 
    const fd = new FormData();
    fd.append('firstName' , firstName);
    fd.append('lastName', lastName);
    fd.append('email', email);
    fd.append('mobile', mobile);
    fd.append('password', password);
    if (avatar !== null)
      fd.append('avatar', avatar, avatar.name);
    console.log("Sending avatar: " );
    console.log(avatar);  
    return this.http.post<any>(environment.apiURL +'/auth/signup', fd);
  }

  //Gets the authenticated user (current user, or null if token is not valid or no token)
  public getAuthUser() : Observable<IApiUserAuth> {
    return this.http.get<IApiUserAuth>(environment.apiURL+'/auth/user').map(res => <IApiUserAuth>res);
  }

  //Invalidates token for logout
  public logout() : Observable<any> {   
    return this.http.post<any>(environment.apiURL +'/auth/logout', {});
  }

  //Resets password and send email to user
  public resetPassword(email:string,access:string) : Observable<any> {
    return this.http.post<any>(environment.apiURL +'/auth/resetpassword', {email,access});
  }  

  //Brands
  public createBrand(name:string, image:File, size:EApiImageSizes) : Observable<IApiBrand>  {
    const fd = new FormData();
    fd.append('name' , name);
    fd.append('size', size);  //Return image size
    console.log("Required size is: " + size);
    if (image !== null)
      fd.append('image', image, image.name);  
    return this.http.post<IApiBrand>(environment.apiURL +'/brands/create', fd).map(res => <IApiBrand>res);
  }
  public getBrands(size: EApiImageSizes) : Observable<IApiBrand[]> {
    return this.http.post<IApiBrand[]>(environment.apiURL +'/brands', {'size': size}).map(res => <IApiBrand[]>res);
  }

  public updateBrand(id:string,name:string,image:File,size:EApiImageSizes) : Observable<IApiBrand>  {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('name' , name);
    fd.append('size', size);  //Return image size
    if (image !== null)
      fd.append('image', image, image.name);  
    return this.http.post<IApiBrand>(environment.apiURL +'/brands/update', fd).map(res => <IApiBrand>res);
  }

  public deleteBrand(id:string) : Observable<any>  { 
    return this.http.post<any>(environment.apiURL +'/brands/delete', {"id":id});
  }

  //Models
  public createModel(idBrand:number, name:string) : Observable<IApiModel>  {  
    return this.http.post<IApiModel>(environment.apiURL +'/models/create', {"id": idBrand, "name":name}).map(res => <IApiModel>res);
  }
  public getModels(idBrand:number) : Observable<IApiModel[]> {
    return this.http.post<IApiModel[]>(environment.apiURL +'/models', {'id': idBrand}).map(res => <IApiModel[]>res);
  }
  public deleteModel(id:string) : Observable<any>  { 
    return this.http.post<any>(environment.apiURL +'/models/delete', {"id":id});
  }

  public updateModel(id:string,name:string) : Observable<IApiModel>  {
    return this.http.post<IApiModel>(environment.apiURL +'/models/update', {"id":id, "name":name}).map(res => <IApiModel>res);
  }  
}
