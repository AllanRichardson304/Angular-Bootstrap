import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SecurityService } from 'src/app/services/security.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userDetail: any = null;
  notificationList:any =[];
  notificationCount:any = 0;
  role:any = localStorage.getItem('role')

  constructor(
    private authenticationService: AuthenticationService,
    private securityService: SecurityService,
    private message: ToastService,
    private router: Router,
    private exchangeService: ExchangeService,
    private socketService:SocketService,
    private notificationService:NotificationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.getUserDetail().subscribe({
      next: (res) => {
        if (res) {
          this.userDetail = res;
          localStorage.setItem('userpinlock', this.userDetail?.statusPinLock.toString())
        }
      }
    });
    this.securityService.inactivityTime();
    this.getUserExchangeList().then(() => {
      this.exchangeService.getExchangeList().subscribe((res) => {
        if (res) {
          this.userExchangeList = res;
          this.chooseExchange()
        }
      })
    });
    this.socketService.connect();
    this.socketService.listen('new_notification').subscribe((res:any)=>{
      this.notificationList = res;
      this.notificationCount = res.length > 99 ? '99+' : res.length;
      this.notificationList = this.notificationList.length > 5 ? this.notificationList.slice(0,5) : this.notificationList;
    })
  }

  lockScreen() {
    this.securityService.lockScreen().subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          localStorage.setItem('isPinLock', 'true')
          this.router.navigate(['/pinlock'])
        } else {
          this.message.error(res['message'])
        }
      },
      error: (err) => {
        this.message.error(err.error.message)
      }
    })
  }

  //Get user exchange list
  userExchangeList: any = [];
  selectedExchange: any = localStorage.getItem('exchange');
  selectedExchangeDetail: any = null;
  getUserExchangeList() {
    return new Promise((resolve: any) => {
      this.exchangeService.getExchange().subscribe({
        next: (res: any) => {
          this.userExchangeList = res['data'];
          // this.chooseExchange()
          resolve();
        }
      })
    })
  }

  chooseExchange() {
    localStorage.setItem('exchange', this.selectedExchange)
    if (this.userExchangeList.find((t: any) => t.accountName == localStorage.getItem('exchange'))) {
      this.selectedExchangeDetail = this.userExchangeList.find((e: any) => {
        if (e.accountName == this.selectedExchange) {
          return e;
        }
      })
      this.exchangeService.sendSelectedExchange(this.selectedExchangeDetail)
    } else {
      if (this.userExchangeList.find((t: any) => t.makeDefault == true)) {
        this.selectedExchange = this.userExchangeList.find((e: any) => e.makeDefault == true).accountName;
      } else {
        this.selectedExchange = this.userExchangeList.length > 0 ? this.userExchangeList[0].accountName : null
      }
      localStorage.setItem('exchange', this.selectedExchange)
      this.exchangeService.sendSelectedExchange(this.selectedExchangeDetail)
      this.selectedExchangeDetail = this.userExchangeList.find((e: any) => {
        if (e.accountName == this.selectedExchange) {
          return e;
        }
      })
    }
  }

  readAllNotification(){
    this.notificationService.readNotification().subscribe({
      next:(res:any)=>{
        if(res['success']){
          this.notificationList = [];
          this.notificationCount = 0
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect()
  }

}
