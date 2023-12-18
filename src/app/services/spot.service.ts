import { Injectable } from '@angular/core';
import { url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotService {

  constructor(
    private http: HttpClient
  ) { }

  getExchangeInfo(val: any) {
    return this.http.post(url.baseUrl + Constants.spotexchanginfo, val)
  }

  currentPrice(val: any) {
    return this.http.post(url.baseUrl + Constants.spotcurrentprice, val)
  }

  kucoinOrderbookUrl() {
    return this.http.get(url.baseUrl + Constants.kucoinorderbookurl)
  }

  kucoinToken(url: any) {
    return this.http.post(url + '/api/v1/bullet-public', {})
  }

  public kucoinOrderBook$: any;
  public kucoinOrderBookData$: any;
  public interval: any;
  public orderbookData = new BehaviorSubject({
    ask: [],
    bid: []
  });
  public getOrderBookData = this.orderbookData.asObservable();

  sendOrderBookMessage(msg: any, interval: any) {
    if (interval > 0) {
      this.interval = setInterval(() => {
        this.kucoinOrderBook$.next({
          "id": 1545910660739,
          "type": "ping"
        });
      }, interval - 10000);
    }
    this.kucoinOrderBook$.next(msg);
  }

  getAccountBalance(val: any) {
    return this.http.post(url.baseUrl + Constants.spotaccountbalance, val)
  }

  createOrder(val: any) {
    return this.http.post(url.baseUrl + Constants.spotcreateorder, val)
  }

  cancelOrder(val: any) {
    return this.http.post(url.baseUrl + Constants.spotcancelorder, val)
  }

  activeGrid(val: any) {
    return this.http.post(url.baseUrl + Constants.spotactivegrid, val)
  }

  gridHistory(val: any) {
    return this.http.post(url.baseUrl + Constants.spotgridhistory, val)
  }

  gridDetail(id: any) {
    return this.http.get(url.baseUrl + Constants.spotgriddetail + id)
  }

  gridSpot(id: any) {
    return this.http.get(url.baseUrl + Constants.spotgridstop + id)
  }

  gridEdit(val:any){
    return this.http.put(url.baseUrl + Constants.editsopotactivegrid, val)
  }
}
