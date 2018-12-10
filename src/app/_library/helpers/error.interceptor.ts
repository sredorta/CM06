import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {ErrorSheetComponent} from "./error-sheet/error-sheet.component";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import 'rxjs/add/operator/do';

//We intercept all http requests and parse error and return correct error message

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private bottomSheet: MatBottomSheet) {}
    
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
        if (msg.length > 500) 
            msg = msg.substr(0, 500) + '...';
        return msg;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       console.log("In interceptor !!!");
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
            if (error instanceof HttpErrorResponse) {
                if (error.error.exception === 'Tymon\\JWTAuth\\Exceptions\\TokenExpiredException' || 
                   error.error.exception === 'Tymon\\JWTAuth\\Exceptions\\TokenBlacklistedException') {
                    //this.userService.logout();
                    //User.removeToken();
                    //this.userService.setCurrent(new User(null));  
                    if (error.error.message != null) 
                        this.openBottomSheet("error",error.status,this.getText(error.error.message));
                    else
                        this.openBottomSheet("error",error.status,"Votre session n'est pas pas valide ou votre acces n'est pas autorize");                     
                    //this.router.navigate(['/login']);  
                }
                if (error.status === 401 || error.status === 403) {
                    //this.userService.logout();
                    //User.removeToken();
                    //this.userService.setCurrent(new User(null));  
                    if (error.error.message != null) 
                        this.openBottomSheet("error",error.status,this.getText(error.error.message));
                    else
                        this.openBottomSheet("error",error.status,"Votre session n'est pas pas valide ou votre acces n'est pas autorize");                     
                    //this.router.navigate(['/login']);  
                    } else {
                        this.openBottomSheet(error.error.response, error.status, this.getText(error.error.message) || error.statusText);
                }
            }
        });
    }
}