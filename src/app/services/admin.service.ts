import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../shared/constant/constants';
import { url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http:HttpClient
  ) { }

  importSpotCoinPair(val:any){
    return this.http.post(url.baseUrl + Constants.spotmarketimport, val)
  }

  importFxCoinPair(val:any){
    return this.http.post(url.baseUrl + Constants.fxmarketimport, val)
  }

  editSpotCoinPair(val:any){
    return this.http.put(url.baseUrl + Constants.editspotcoinpair, val)
  }

  editFxCoinPair(val:any){
    return this.http.put(url.baseUrl + Constants.editfxcoinpair, val)
  }
}
