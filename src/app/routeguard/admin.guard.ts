import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let data_login = JSON.parse(`${localStorage.getItem('IT-asset-takeout-login')}`)
    // console.log(data_login);

    if (data_login == null) {
      return true
    }
    if (data_login.access == "admin") {
      return true
    }

    if (data_login.access == "employee"
    && state.url != "/LogBookRecord"
    && state.url != "/MasterITAsset"
    && state.url != "/EmailForm"
    && state.url != "/Blacklist"

    ) {
      return true
    }

    this.router.navigate(['/'])
    return false
  }

}
