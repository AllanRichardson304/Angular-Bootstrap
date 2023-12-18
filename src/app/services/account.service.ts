import { Injectable } from '@angular/core';
import { url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http:HttpClient
  ) { }

  // getAccountBalance(val:any){
  //   return this.http.post(url.baseUrl + Constants.accountbalance, val)
  // }
}
