import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../shared/constant/constants';
import { url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http:HttpClient,
    private router:Router
  ) { }

  login(val:any){
    return this.http.post(url.baseUrl + Constants.login, val)
  }

  isLoggedIn(){
    const result = (localStorage.getItem('isLoggedIn') != '' && localStorage.getItem('isLoggedIn') != null) ? true : false  ;
    if (result){
        this.router.navigate(['']);
     } 
  }

  getUser(){
    return this.http.get(url.baseUrl + Constants.getuser)
  }

  userDetail = new BehaviorSubject(null);
  sendUserDetail(val:any){
    this.userDetail.next(val)
  }

  getUserDetail(){
    return this.userDetail.asObservable()
  }

  logOut(){
    return this.http.get(url.baseUrl + Constants.logoout)
  }

  verify2fa(val:any){
    return this.http.post(url.baseUrl + Constants.verify2fa, val)
  }

  forgorPassword(val:any){
    return this.http.post(url.baseUrl + Constants.forgotpassword, val)
  }

  resetPassword(val:any, id:any){
    return this.http.put(url.baseUrl + Constants.resetpassword+id, val)
  }
}
