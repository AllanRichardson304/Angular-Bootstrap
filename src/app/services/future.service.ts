import { Injectable } from '@angular/core';
import { url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constants';
import { HttpClient } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FutureService {

  constructor(
    private http:HttpClient
  ) { }

  fxAccountBalance(val:any){
    return this.http.post(url.baseUrl + Constants.fxaccountbalance, val)
  }

  kucoinOrderbookUrl() {
    return this.http.get(url.baseUrl + Constants.kucoinfxorderbookurl)
  }

  kucoinToken(){
    return this.http.post('https://api.kucoin.com/api/v1/bullet-public', {})
  }

  public fxkucoinOrderBook$  =  webSocket('wss://ws-api.kucoin.com/endpoint?token=2neAiuYvAU61ZDXANAGAsiL4-iAExhsBXZxftpOeh_55i3Ysy2q2LEsEWU64mdzUOPusi34M_wGoSf7iNyEWJ7Vea5aXz_MYBT6DMaXh5h1UjPQh5LLBX9iYB9J6i9GjsxUuhPw3BlrzazF6ghq4L4FohFaXKK1p7mdY_VehuiA=.gkVffhiz2T831SS-v4OHWw==');
  public fxkucoinOrderBookData$ = this.fxkucoinOrderBook$.asObservable();
  public interval:any;
  public orderbookData = new BehaviorSubject({
    ask:[],
    bid:[]
  });
  public getOrderBookData = this.orderbookData.asObservable();

  sendFxOrderBookMessage(msg: any, interval:any) {
    if(interval > 0){
      this.interval = setInterval(() => {
        this.fxkucoinOrderBook$.next({
         "id":1545910660739,
         "type":"ping"
     });
     }, interval - 10000);
    }
    this.fxkucoinOrderBook$.next(msg);
  }

  currentPrice(val:any){
    return this.http.post(url.baseUrl + Constants.fxcurrentprice, val)
  }

  exchangeInfo(val:any){
    return this.http.post(url.baseUrl + Constants.fxexchangeinfo, val)
  }

  createOrder(val: any) {
    return this.http.post(url.baseUrl + Constants.fxcreateorder, val)
  }

  activeGrid(val: any) {
    return this.http.post(url.baseUrl + Constants.fxactivegrid, val)
  }

  gridHistory(val: any) {
    return this.http.post(url.baseUrl + Constants.fxgridhistory, val)
  }

  gridDetail(id: any) {
    return this.http.get(url.baseUrl + Constants.fxgriddetail + id)
  }

  gridSpot(id: any) {
    return this.http.get(url.baseUrl + Constants.fxgridstop + id)
  }

  gridEdit(val:any){
    return this.http.put(url.baseUrl + Constants.editfxgrid, val)
  }
}
