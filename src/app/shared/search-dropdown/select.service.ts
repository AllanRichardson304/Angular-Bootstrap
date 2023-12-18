import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SelectService {

  public selectedOption = new BehaviorSubject(null);
  public searchResult = new BehaviorSubject(null);

  constructor() { }

  
  changeOption(val:any, id:any) {
    let data:any = {
      value:val,
      id:id
    }
    this.selectedOption.next(data);
  }

  getOption(){
    return this.selectedOption.asObservable();
  }

}
