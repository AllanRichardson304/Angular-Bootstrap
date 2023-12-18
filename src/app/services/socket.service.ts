import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  // readonly url: string = "http://localhost:3003";
  readonly url: string = "wss://macdgridapi.blockchainfirm.io"

  connect() {
    this.socket = io.io(this.url, {
      query: { 
        userId:localStorage.getItem('userid') || ''
      },
      transports: ["websocket"],
      path: '/socket.io'
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  listen(eventName: string) {
    return new Observable((subscriber:any) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  constructor() { }
}
