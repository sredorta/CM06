import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {ErrorSheetComponent} from "./error-sheet/error-sheet.component";
import { Observable, throwError } from 'rxjs';
import {User} from '../_models/user';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import 'rxjs/add/operator/do';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../_services/api.service';

//We intercept all http requests and parse error and return correct error message

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private _subscription : Subscription = new Subscription();

    constructor(private bottomSheet: MatBottomSheet, private router : Router,private translate: TranslateService, private api: ApiService) {}
    
    //Opens bottomsheet with error or success message
    openBottomSheet(type:string, code:number,  message:string): void {
        this.bottomSheet.open(ErrorSheetComponent, {
            data: { type: type,
                    code: code,
                    message: message
                  }
            });
    }

    getText(msg:string) {
        if (msg)
            if (msg.length > 500) 
                msg = msg.substr(0, 500) + '...';
        return msg;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).do((event: HttpEvent<any>) => {
            //Intercept correct response and we check that we have 'success' in the response 
            //  if this is the case then we show the bottomsheet
            if (event instanceof HttpResponse) {
              if(event.body != null && event.body != undefined)
                if (event.body.response == 'success') {
                    this.openBottomSheet(event.body.response,event.status,this.getText(event.body.message));
                }
                // any way to alter response that gets sent to the request subscriber?
            }
        }, (error: any) => {    
            this._subscription = this.translate.get(["interceptor.session.invalid","interceptor.unknown"]).subscribe( trans => {
                if (error instanceof HttpErrorResponse) {
                    console.log("Error interceptor");
                    console.log(error);
                    if (error.error.exception === 'Tymon\\JWTAuth\\Exceptions\\TokenExpiredException' || 
                    error.error.exception === 'Tymon\\JWTAuth\\Exceptions\\TokenBlacklistedException') {
                        this.api.setCurrent(null);
                        User.removeToken();
                        this.openBottomSheet("error",error.status,trans["interceptor.session.invalid"]);                     
                        this.router.navigate(['/login']);  
                    } 
                    if (error.status === 401 || error.status === 403) {
                        if (error.error.message != null) 
                            this.openBottomSheet("error",error.status,this.getText(error.error.message));
                        else
                            this.openBottomSheet("error",error.status,trans["interceptor.session.access"]);                     
                        } else {
                            this.openBottomSheet(error.error.response, error.status, this.getText(error.error.message) || error.statusText);
                    } 
                    if(error.status === 0) {
                        //Network disconnected
                        this.openBottomSheet("error",404,trans["interceptor.unknown"]);
                    }
                }
                this._subscription.unsubscribe();
            });
        });
    }
}