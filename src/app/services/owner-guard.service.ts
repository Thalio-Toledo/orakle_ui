import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuardService implements CanActivate {

  constructor() { }

  canActivate(): boolean {
    return sessionStorage.getItem('auth_token') != null
  }
}
