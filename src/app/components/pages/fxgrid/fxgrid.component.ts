import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExchangeService } from 'src/app/services/exchange.service';
import { FutureService } from 'src/app/services/future.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-fxgrid',
  templateUrl: './fxgrid.component.html',
  styleUrls: ['./fxgrid.component.scss']
})
export class FxgridComponent implements OnInit, OnDestroy {
 
  subscription:Subscription[] = []
  selectedExchange: any;
  isLoading:any = {
    activeGrid:true,
    gridHistory:false,
    activeView:false,
    tradeView:false
  }
  selectedTab = 'Running';
  activeId:any = 1;
  routeSelectedId:any = null;
    activatedType:any = 'running';

  constructor(
    private futureService: FutureService,
    private message: ToastService,
    private route:Router,
    private exchangeService:ExchangeService,
    private router:Router
  ) { 
    let data: any = this.route.getCurrentNavigation()?.extras.state;
    if (data != undefined) {
      this.routeSelectedId = data?.id;
      this.activeId = data?.type == 'running' ? 1 : 2;
      this.activatedType = data?.type;
      this.activeId == 1 ? this.getActiveGrid() : this.getGridHistory();
    } else {
      this.activatedType = 'running';
      this.routeSelectedId = null;
      this.getActiveGrid()
    }
  }

  ngOnInit(): void {
    this.subscription.push(
      this.exchangeService.getSelectedExchange().subscribe({
        next: (res: any) => {
          this.selectedExchange = res;
          if (res) {
            if (res?.accountType != 'fx') {
              this.router.navigate(['/'])
            } 
          }
        }
      })
    )
  }

  //Overall usdt balance
  accountBalance: any = {
    balance: 0,
    balanceList: []
  };
  getOverAllBalance(data: any) {
    this.futureService.fxAccountBalance({
      exchangeName: data.exchangeName,
      accountName: data.accountName,
      accountType: 'spot'
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.accountBalance.balanceList = res['data'];
          this.selectedGridBalance.baseAsset = this.accountBalance.balanceList.find((e: any) => e.asset.toLowerCase() === this.gridDetail?.baseAsset.toLowerCase())?.free
          this.selectedGridBalance.quoteAsset = this.accountBalance.balanceList.find((e: any) => e.asset.toLowerCase() === this.gridDetail?.quoteAsset.toLowerCase())?.free
        }
      }
    })
  }

  //Active grid
  pageIndex: any = 1;
  activeGrid: any = {
    list: [],
    count: 0
  }
  getActiveGrid() {
    this.selectedTab = 'Running';
    this.isLoading.activeGrid = true;
    this.futureService.activeGrid({
      limit: 10,
      page: this.pageIndex
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.activeGrid.list = res['data']['list'];
          this.activeGrid.count = res['data']['count'];
          this.activeGrid.list = this.activeGrid.list.map((e: any) => ({ ...e, selected: false }));
          if(this.routeSelectedId != null && this.activatedType == 'running'){
            let data = this.activeGrid.list.find((e:any) => e._id === this.routeSelectedId)
            this.viewDetail(data)
          }
          this.isLoading.activeGrid = false
        }
      }
    })
  }

  //Grid detail;
  selectedGridDetail: any;
  selectedGridBalance: any = {
    baseAsset: 0,
    quoteAsset: 0
  }
  viewDetail(data: any) {
    this.isLoading.activeView = true;
    this.activeGrid.list = this.activeGrid.list.map((e: any) => ({ ...e, selected: false }));
    if (data.selected == false) {
      this.activeGrid.list.forEach((element: any) => {
        if (data._id === element._id) {
          element.selected = true;
          this.getGridDetail(data._id)
          this.getOverAllBalance(data)
        }
      });
    }
    this.selectedGridDetail = data
  }

  gridDetail: any;
  gridLines: any;
  gridWorkingDetail: any = {
    buy: [],
    sell: []
  }
  gridCompleteDetail:any = {
    list:[],
    matchedTrade:0,
    matched24h:0,
  }
  getGridDetail(id: any) {
    this.futureService.gridDetail(id).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.gridDetail = res['data']['grid'];
          //Working
          this.gridWorkingDetail.buy = res['data'].lines.length > 0 ?
            res['data'].lines.filter((e: any) => e.side == 'BUY').sort((a :any,b:any) =>  b.price - a.price) : [];
          this.gridWorkingDetail.sell = res['data'].lines.length > 0 ?
            res['data'].lines.filter((e: any) => e.side == 'SELL').sort((a :any,b:any) =>  b.price - a.price) : [];
          //completed
          this.gridCompleteDetail.list = res['data']['trades'];
          this.isLoading.activeView = false;
          this.isLoading.tradeView = false;
        }
      }
    })
  }

  //Grid history
  tradeHistory: any = {
    list: [],
    count: 0
  }
  getGridHistory() {
    this.selectedTab = 'History';
    this.isLoading.gridHistory = true;
    this.futureService.gridHistory({
      limit: 10,
      page: this.pageIndex
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.tradeHistory.list = res['data']['list'];
          this.tradeHistory.count = res['data']['count'];
          this.tradeHistory.list = this.tradeHistory.list.map((e: any) => ({ ...e, selected: false }));
          if(this.routeSelectedId != null && this.activatedType != 'running'){
            let data = this.tradeHistory.list.find((e:any) => e._id === this.routeSelectedId)
            this.tradeViewDetail(data)
          }
          this.isLoading.gridHistory = false
        }
      }
    })
  }

  tradeViewDetail(data: any) {
    this.isLoading.tradeView = true;
    this.tradeHistory.list = this.tradeHistory.list.map((e: any) => ({ ...e, selected: false }));
    if (data.selected == false) {
      this.tradeHistory.list.forEach((element: any) => {
        if (data._id === element._id) {
          element.selected = true;
          this.getGridDetail(data._id)
          this.getOverAllBalance(data)
        }
      });
    }
    this.selectedGridDetail = data
  }

    //Stop grid
    gridStop(id:any){
      this.futureService.gridSpot(id).subscribe({
        next:(res:any) => {
          if(res['success']){
            this.message.success(res['message']);
            this.getActiveGrid();
          }else{
            this.message.error(res['message']);
          }
        },
        error:(err) => {
          this.message.error(err.error.message);
        }
      })
    }

    clearData() {
      this.pageIndex = 1;
      this.selectedGridDetail = null;
      this.activatedType = 'running';
      // this.activeId = 1;
      this.routeSelectedId = null;
    }

    ngOnDestroy(): void {
      this.subscription.forEach(element => {
        element.unsubscribe()
      });
    }
}
