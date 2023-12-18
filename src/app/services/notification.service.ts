import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../shared/constant/constants';
import { url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http:HttpClient
  ) { }

  readNotification(){
    return this.http.get(url.baseUrl + Constants.readnotification)
  }

  allNotification(val:any){
    return this.http.post(url.baseUrl + Constants.allnotification, val)
  }

  clearNotification(){
    return this.http.delete(url.baseUrl + Constants.clearnotification)
  }
  
}
