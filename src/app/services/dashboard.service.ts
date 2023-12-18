import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../shared/constant/constants';
import { url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http:HttpClient
  ) { }

  getDashboardDetail(val:any){
    return this.http.post(url.baseUrl + Constants.dashboarddetail, val)
  }
}
