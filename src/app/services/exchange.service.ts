import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../shared/constant/constants';
import { url } from '../shared/constant/url';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(
    private http:HttpClient
  ) { }

  createExchange(val:any){
    return this.http.post(url.baseUrl + Constants.exchange, val)
  }

  getExchange(){
    return this.http.get(url.baseUrl + Constants.exchange)
  }

  exchangeList$ = new BehaviorSubject(null);
  sendExchangeList(val:any){
    this.exchangeList$.next(val)
  }

  getExchangeList(){
    return this.exchangeList$.asObservable()
  }

  deleteExchange(val:any){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        _id: val._id,
      },
    };
    return this.http.delete(url.baseUrl + Constants.exchange, options)
  }

  selectedExchange$ = new BehaviorSubject(null);
  sendSelectedExchange(val:any){
    this.selectedExchange$.next(val)
  }

  getSelectedExchange(){
    return this.selectedExchange$.asObservable()
  }

  makeExchangeDefault(val:any){
    return this.http.post(url.baseUrl + Constants.makedefault, val)
  }
}
