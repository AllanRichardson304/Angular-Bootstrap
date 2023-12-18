import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import { FutureService } from 'src/app/services/future.service';
import { SpotService } from 'src/app/services/spot.service';
import { ToastService } from 'src/app/services/toast.service';
import { walletData } from 'src/app/helpers/wallet';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, OnDestroy {
  selectedExchange: any = null;
  isLoading: boolean = true;
  // isFxLoading:boolean = true;
  noExchangeFound:boolean = false;
  subscription:Subscription[] = [];
  tempWalletBalance:any = [];
  pageIndex:any = 1;

  constructor(
    private accountService: AccountService,
    private exchangeService: ExchangeService,
    private spotService:SpotService,
    private futureService:FutureService,
    private message: ToastService
  ) { }

  ngOnInit(): void {
    this.subscription.push(
    this.exchangeService.getSelectedExchange().subscribe({
      next: (res: any) => {
        if (res) {
          this.selectedExchange = res;
          if(res?.accountType == 'spot'){
            this.getSpotAllBalance().then(()=>{
              this.isLoading = false;
            });
          }else{
            this.getFxAccountBalance();
          }
        }
      }
    })
    )
  }

  //Overall spot balance
  accountBalanceList: any = [];
  getSpotAllBalance() {
    this.isLoading = true;
    return new Promise<void>((reslove) => {
      this.spotService.getAccountBalance({
        exchangeName: this.selectedExchange.exchangeName,
        accountName: this.selectedExchange.accountName,
        accountType:this.selectedExchange.accountType
      }).subscribe({
        next: (res: any) => {
          if (res['success']) {
            this.tempWalletBalance = res['data'].length > 0 ? res['data'].filter((e:any) => (+e.free) > 0) : [];
            this.tempWalletBalance = this.tempWalletBalance.sort((a:any,b:any) => b.free - a.free)
            this.eventchange(1, 10, this.tempWalletBalance);
            reslove()
          }
        }
      })
    })
  }

  //Overall fx balance list
  fxAccountBalanceList:any =[]
  getFxAccountBalance(){
    this.isLoading = true;
    this.accountBalanceList = []
    this.futureService.fxAccountBalance({
      exchangeName: this.selectedExchange.exchangeName,
      accountName: this.selectedExchange.accountName,
      accountType:this.selectedExchange.accountType
    }).subscribe({
      next:(res:any) => {
        if(res['success']){
           this.tempWalletBalance = walletData(this.selectedExchange.exchangeName,res['data']);
           this.tempWalletBalance = this.tempWalletBalance.sort((a:any,b:any) => b.free - a.free)
           this.eventchange(1, 10, this.tempWalletBalance);
        }
      }
    })
  }

  eventchange(pagenumber: any, si: any, tempArr: any) {
    this.accountBalanceList = tempArr.slice((pagenumber - 1) * si, pagenumber * si);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscription.forEach((item) => item.unsubscribe())
  }

}
