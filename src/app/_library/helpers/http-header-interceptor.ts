import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders
  } from '@angular/common/http';
  import { Observable, of, throwError } from 'rxjs';
  import {User} from './../models/user';

  //Intercept any http request we do and then add the Authorisation bearer in the header with our token
  //This is then extracted in the API for authenticating us
  
  export class HttpHeaderInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Clone the request to add the new header
      let token = User.getToken();
/*
      if (token !== null && token != undefined) {
        return next.handle( req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)
              .set('Access-Control-Allow-Origin', '*')
              .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
              .set('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization, X-Request-With')
              .set('Access-Control-Allow-Credentials','true')
            }) );
      } else {
        return next.handle( req.clone({headers: req.headers
              .set('Access-Control-Allow-Origin', '*')
              .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
              .set('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization, X-Request-With')
              .set('Access-Control-Allow-Credentials','true')         
            }) );
      } 
*/
      if (token !== null && token != undefined) {
        return next.handle( req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)}) );
      } else {
        return next.handle( req.clone() );
      }

    }
  }
