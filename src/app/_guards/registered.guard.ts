import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../_services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisteredGuard implements CanActivate {
  
  constructor(private api : ApiService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.api.getAuthUser().map(res=> res && res.id !== null?true:false);
  }
}
