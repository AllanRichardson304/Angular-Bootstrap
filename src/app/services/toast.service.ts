import { Injectable } from '@angular/core';
interface ToastInfo {
   body: string;
   type:any;
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: ToastInfo[] = [];

  success(body: string) {
    this.toasts = []
    this.toasts.push({type:{ classname: 'bg-success text-light', delay: 1000, val:'success' }, body});
  }

  error(body:string){
    this.toasts = []
    this.toasts.push({type:{ classname: 'bg-danger text-light', delay: 1000, val:'error' }, body})
  }
}
