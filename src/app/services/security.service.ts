import { Injectable } from '@angular/core';
import { url } from '../shared/constant/url';
import { Constants } from '../shared/constant/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private http: HttpClient
  ) { }

  generateQr() {
    return this.http.get(url.baseUrl + Constants.qrgenerator)
  }

  change2FaStatus(val: any) {
    return this.http.post(url.baseUrl + Constants.status2fa, val)
  }

  statusPinLock(val: any) {
    return this.http.post(url.baseUrl + Constants.statuspinlock, val)
  }

  lockScreen() {
    return this.http.get(url.baseUrl + Constants.lockscreen)
  }

  unlockScreen(val: any) {
    return this.http.post(url.baseUrl + Constants.unlockscreen, val)
  }

  getActivityLog() {
    return this.http.get(url.baseUrl + Constants.activitylog)
  }

  changePassword(val: any) {
    return this.http.put(url.baseUrl + Constants.changepassword, val)
  }


  //Idle Time out
  inactivityTime() {
    var time: any;
    window.onload = resetTimer;
    // DOM Events
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // touchscreen presses
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;     // touchpad clicks
    document.onkeydown = resetTimer;   // onkeypress is deprectaed
    document.addEventListener('scroll', resetTimer, true); 


    function logout() {
      if (localStorage.getItem('userpinlock') == 'true') {
        localStorage.setItem('isPinLock', 'true')
        location.href = '/pinlock';
      }
    }

    function resetTimer() {
      clearTimeout(time);
      time = setTimeout(logout, 300000)
    }
  }
}
