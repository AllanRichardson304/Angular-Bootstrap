import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ExchangeService } from 'src/app/services/exchange.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  dashboardDetail: any;
  previousData: any = null;
  selectedExchangeDetail:any;

  constructor(
    private authenticationService: AuthenticationService,
    private exchangeService: ExchangeService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    // this.authenticationService.getUser().subscribe()
    this.subscription.push(
      this.exchangeService.getSelectedExchange().subscribe({
        next: (res: any) => {
          if (res) {
            this.selectedExchangeDetail = res;
            if (this.previousData !== res.accountName) {
              this.dashboardService.getDashboardDetail({
                exchangeName: res.exchangeName,
                accountName: res.accountName,
                accountType:res.accountType
              }).subscribe({
                next: (res: any) => {
                  if (res['success']) {
                    this.dashboardDetail = res['data'];
                    this.dashboardDetail.lastLogin = new Date(res['data'].lastLogin)
                  }
                }
              })
              this.previousData = res.accountName
            }
          }
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

}
