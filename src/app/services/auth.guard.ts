import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLogged();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLogged();
  }

  isLogged(){
    let islogin = (localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('role') === 'user') ? true : false;
    if(islogin == true){
      return true;
    }else{
      if(localStorage.getItem('role') == 'admin'){
        this.router.navigate(['/coinpair'])
      }else{
      this.router.navigate(['auth/login']);
      }
      return false;
    }
  }
  
}
