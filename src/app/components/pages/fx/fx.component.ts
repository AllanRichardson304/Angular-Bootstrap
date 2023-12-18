import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExchangeService } from 'src/app/services/exchange.service';
import { FutureService } from 'src/app/services/future.service';
import { fxOrderbookData, fxUnsubscribeorderbook } from 'src/app/helpers/orderbook';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { walletData } from 'src/app/helpers/wallet';
declare const TradingView: any;
@Component({
  selector: 'app-fx',
  templateUrl: './fx.component.html',
  styleUrls: ['./fx.component.scss']
})
export class FxComponent implements OnInit, OnDestroy {
  selectedExchange: any = null;
  selectedTradePairDetail: any = null;
  previousExchange: any = null;
  previousSelectedTradePair: any = null;
  selectedTradePair: any = null;
  tradeForm!: FormGroup;
  subscription: Subscription[] = [];
  isLoading: any = {
    create: false,
    cancel: false,
    tradeHistory: false,
    activeGrid: false
  };

  constructor(
    private offcanvasService: NgbOffcanvas,
    private fb: FormBuilder,
    private exchangeService: ExchangeService,
    private futureService: FutureService,
    private router: Router,
    private message: ToastService
  ) { }

  ngOnInit(): void {
    // this.tradingViewChart('BTCUSDT');
    this.tradeForm = this.fb.group({
      coinpair: [Validators.required],
      amount: [null, [Validators.required]],
      gridsize: [null, [Validators.required]],
      gridline: [null, [Validators.required, Validators.min(5), Validators.max(100)]],
      // gridline: [null, [Validators.required]],
      stoploss: [null, [Validators.required, Validators.min(1), Validators.max(20)]],
      leverage: [this.leverageValue, [Validators.required]],
      fastlength: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      slowlength: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      signalsmooth: [null, [Validators.required, Validators.min(2), Validators.max(100)]],
      source: ['', [Validators.required]],
      timeframe: ['', [Validators.required]],
      oscillatorMA: ['', [Validators.required]],
      signalMA: ['', [Validators.required]]
    })
    this.subscription.push(
      this.exchangeService.getSelectedExchange().subscribe({
        next: (res: any) => {
          this.selectedExchange = res;
          if (res) {
            if (res?.accountType == 'fx') {
              this.selectedTradePairDetail = null;
              this.getExchangeInfo().then(() => {
                this.getOverAllBalance();
              });
            } else {
              this.router.navigate(['/'])
            }
          }
        }
      })
    )
    this.getActiveGrid();
    // this.getKucoinToken();
    // this.getKucoinOrderBook()
  }

  tradingViewChart(interval: any) {
    new TradingView.widget({
      container_id: "fx_chart",
      autosize: true,
      symbol: this.selectedExchange?.exchangeName.toUpperCase() +':'+this.selectedTradePair,
      interval: interval,
      timezone: "Australia/Sydney",
      theme: "light",
      style: "1",
      locale: "in",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
    });
  }

  openEnd(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  //Overall usdt balance
  accountBalance: any = {
    balance: 0,
    balanceList: [],
    tempBalanceList: []
  };
  getOverAllBalance() {
    this.futureService.fxAccountBalance({
      exchangeName: this.selectedExchange.exchangeName,
      accountName: this.selectedExchange.accountName,
      accountType: this.selectedExchange.accountType
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.accountBalance.tempBalanceList = walletData(this.selectedExchange.exchangeName,res['data']);
          this.accountBalance.balanceList = this.accountBalance.tempBalanceList.filter((t: any) => t.free > 0)
          let data =  this.accountBalance.tempBalanceList.length > 0 &&  this.accountBalance.tempBalanceList.find((e: any) => e.asset.toLowerCase() === this.selectedTradePairDetail?.quoteAsset.toLowerCase()).free;
          this.accountBalance.balance = this.getFlooredFixed(data, 2)
          switch(true){
            case this.selectedExchange.exchangeName == 'kucoin':
              this.maxLeverageValue = this.selectedTradePairDetail?.maxLeverage;
              this.minLeverageValue = 1;
              // this.leverageStepSize = 1
              break;
            case this.selectedExchange.exchangeName == 'bybit':
              this.minLeverageValue = this.selectedTradePairDetail.leverage_filter[0].min_leverage;
              this.maxLeverageValue = this.selectedTradePairDetail.leverage_filter[0].max_leverage;
              // this.leverageStepSize = (+this.selectedTradePairDetail.leverage_filter[0].leverage_step);
              break;
            default:
              break;
          }
          // if(this.selectedTradePairDetail && this.selectedTradePairDetail?.leverage_filter &&  this.selectedTradePairDetail?.leverage_filter.length > 0){
          //   this.minLeverageValue = this.selectedTradePairDetail.leverage_filter[0].min_leverage;
          //   this.maxLeverageValue = this.selectedTradePairDetail.leverage_filter[0].max_leverage;
          //   this.leverageStepSize = (+this.selectedTradePairDetail.leverage_filter[0].leverage_step);
          // }
          this.tradeForm.controls['amount'].setValidators([Validators.required, Validators.max(this.accountBalance.balance)])
        }
      }
    })
  }

  //Exchange Info
  exchangeInfoList: any = []
  getExchangeInfo() {
    return new Promise<void>((resolve) => {
    this.futureService.exchangeInfo({
      exchangeName: this.selectedExchange?.exchangeName.toLowerCase()
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.exchangeInfoList = res['data'];
          this.selectedTradePairDetail = this.selectedTradePairDetail == null ?
            ((this.exchangeInfoList.find((t: any) => t.baseAsset == 'BTC' && t.quoteAsset == 'USDT') != undefined) ?
              this.exchangeInfoList.find((t: any) => t.baseAsset == 'BTC' && t.quoteAsset == 'USDT')
              :
              this.exchangeInfoList[0])
            :
            this.exchangeInfoList.find((t: any) => t.symbol == this.selectedTradePair);
          this.selectedTradePair = this.selectedTradePairDetail?.symbol;
          resolve();
        }
      }
    })
  })
  }

  //Exchange Coin Pair change
  coinPairChange() {
    this.selectedTradePairDetail = this.selectedTradePairDetail == null ?
      ((this.exchangeInfoList.find((t: any) => t.baseAsset == 'BTC' && t.quoteAsset == 'USDT') != undefined) ?
        this.exchangeInfoList.find((t: any) => t.baseAsset == 'BTC' && t.quoteAsset == 'USDT')
        :
        this.exchangeInfoList[0])
      :
      this.exchangeInfoList.find((t: any) => t.symbol == this.selectedTradePair);
    this.tradingViewChart('1');
    if (this.selectedTradePairDetail) {
      this.getKucoinOrderBook();
      this.previousSelectedTradePair = this.selectedTradePairDetail;
      switch(true){
        case this.selectedExchange.exchangeName == 'kucoin':
          this.maxLeverageValue = this.selectedTradePairDetail?.maxLeverage;
          this.minLeverageValue = 1;
          // this.leverageStepSize = 1
          break;
        case this.selectedExchange.exchangeName == 'bybit':
          this.minLeverageValue = this.selectedTradePairDetail.leverage_filter[0].min_leverage;
          this.maxLeverageValue = this.selectedTradePairDetail.leverage_filter[0].max_leverage;
          // this.leverageStepSize = (+this.selectedTradePairDetail.leverage_filter[0].leverage_step);
          break;
        default:
          break;
      }
      this.previousExchange = this.selectedExchange;
    }
  }


  //Order book
  orderBookData: any = {
    bid: [],
    ask: []
  }

  maxAskAmount: any = 0;
  maxBidAmount: any = 0;
  async getKucoinOrderBook() {
    if (this.previousSelectedTradePair != null) {
      fxUnsubscribeorderbook(this.previousExchange?.exchangeName, this.previousSelectedTradePair?.symbol)
    }
    await fxOrderbookData(this.selectedExchange.exchangeName, this.selectedTradePairDetail?.symbol).then(async () => {
      this.futureService.getOrderBookData.subscribe({
        next: async (msg: any) => {
          if (msg) {
            this.orderBookData.bid = await msg?.bid;
            this.orderBookData.ask = await msg?.ask;
            let sum = 0;
            this.orderBookData.bid = await this.orderBookData.bid.map((v: any) => ({ ...v, total: sum += (+v.quantity) })).sort((a: any, b: any) => b.price - a.price);
            this.maxBidAmount = Math.max.apply(Math, this.orderBookData.bid.map(function (o: any) { return o.total; }));
            let asksum = 0;
            this.orderBookData.ask = await this.orderBookData.ask.map((v: any) => ({ ...v, total: asksum += (+v.quantity) })).sort((a: any, b: any) => a.price - b.price);
            this.maxAskAmount = Math.max.apply(Math, this.orderBookData.ask.map(function (o: any) { return o.total; }));

            this.orderBookData.bid = await this.orderBookData.bid.map((t: any) => ({
              ...t, width: ((t.total / this.maxBidAmount) * 100) > 100 ? 100
                : ((t.total / this.maxBidAmount) * 100) < 0 ? 0
                  : ((t.total / this.maxBidAmount) * 100)
            }));

            this.orderBookData.ask = await this.orderBookData.ask.map((t: any) => ({
              ...t, width: ((t.total / this.maxAskAmount) * 100) > 100 ? 100
                : ((t.total / this.maxAskAmount) * 100) < 0 ? 0
                  : ((t.total / this.maxAskAmount) * 100)
            }))

          }
        },
        error: err => {
          // console.log(err)
        }
      });
    })
  }

  //Current price of a symbol
  currentPrice: any = 0;
  getCurrentPrice() {
    this.futureService.currentPrice({

    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.currentPrice = res['data']
        }
      }
    })
  }

  //Grid line fund validation
  minGridAmount = 15;
  fundValidation() {
    this.tradeForm.controls['amount'].addValidators(Validators.min((this.tradeForm.value.gridline * this.leverageValue)));
    this.tradeForm.controls['amount'].updateValueAndValidity();
    this.minGridAmount = (this.tradeForm.value.gridline * this.leverageValue)
  }

  //Create Order
  createNewOrder() {
    this.isLoading.create = true;
    let val = {
      exchangeName: this.selectedExchange.exchangeName.toLowerCase(),
      accountName: this.selectedExchange.accountName,
      symbol: this.tradeForm.value.coinpair,
      fundInvested: (+this.tradeForm.value.amount),
      gridSize: (+this.tradeForm.value.gridsize),
      gridLines: (+this.tradeForm.value.gridline),
      stopLoss: (+this.tradeForm.value.stoploss),
      fastLength: (+this.tradeForm.value.fastlength),
      slowLength: (+this.tradeForm.value.slowlength),
      signalSmooting: (+this.tradeForm.value.signalsmooth),
      source: this.tradeForm.value.source,
      timeFrame: this.tradeForm.value.timeframe,
      oscillatorType: this.tradeForm.value.oscillatorMA,
      signalLineType: this.tradeForm.value.signalMA,
      leverage:(+this.tradeForm.value.leverage)
    }
    this.futureService.createOrder(val).subscribe({
      next: (res: any) => {
        if (res['sucess']) {
          this.message.success(res['message']);
          this.isLoading.create = false;
          // this.formReset(this.tradeForm, ['coinpair'])
          this.getActiveGrid();
          this.getOverAllBalance();
        } else {
          this.message.error(res['message']);
          this.isLoading.create = false;
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.isLoading.create = false;
      }
    })
  }

  //Active grid
  activeGrid: any = {
    list: [],
    count: 0
  }
  getActiveGrid() {
    this.isLoading.activeGrid = true;
    this.futureService.activeGrid({
      limit: 10,
      page: 1
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.activeGrid.list = res['data']['list'];
          this.activeGrid.count = res['data']['count'];
          this.isLoading.activeGrid = false;
        }
      }
    })
  }

    //Edit Active Grid
    selectedGridData:any = null;
    isEdit:boolean = false;
    selectActiveData(data:any){
      this.selectedGridData = data;
      this.selectedTradePair = data?.symbol;
      this.timeFrameValue = data?.timeFrame;
      this.isEdit = true;
    }
  
    editActiveGrid(){
      this.futureService.gridEdit({
        id:this.selectedGridData._id,
        exchangeName: this.selectedGridData.exchangeName.toLowerCase(),
        accountName: this.selectedGridData.accountName,
        fundInvested: (+this.tradeForm.value.amount),
        gridSize: (+this.tradeForm.value.gridsize),
        gridLines: (+this.tradeForm.value.gridline),
        stopLoss: (+this.tradeForm.value.stoploss),
        fastLength: (+this.tradeForm.value.fastlength),
        slowLength: (+this.tradeForm.value.slowlength),
        signalSmooting: (+this.tradeForm.value.signalsmooth),
        source: this.tradeForm.value.source,
        oscillatorType: this.tradeForm.value.oscillatorMA,
        signalLineType: this.tradeForm.value.signalMA
      }).subscribe({
        next: (res: any) => {
          if (res['success']) {
            this.message.success(res['message']);
            this.isLoading.create = false;
            this.getActiveGrid();
            this.getOverAllBalance();
            this.selectedGridData = null;
            this.isEdit = false;
          } else {
            this.message.error(res['message']);
            this.isLoading.create = false;
          }
        },
        error: (err) => {
          this.message.error(err.error.message);
          this.isLoading.create = false;
        }
      })
    }

  //Grid history
  tradeHistory: any = {
    list: [],
    count: 0
  }
  getGridHistory() {
    this.isLoading.tradeHistory = true;
    this.futureService.gridHistory({
      limit: 10,
      page: 1
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.tradeHistory.list = res['data']['list'];
          this.tradeHistory.count = res['data']['count'];
          this.isLoading.tradeHistory = false;
        }
      }
    })
  }

  //Stop grid
  gridStop(id: any) {
    this.futureService.gridSpot(id).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          this.getActiveGrid();
          this.getOverAllBalance();
        } else {
          this.message.error(res['message']);
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
      }
    })
  }

  //Range slider
  leverageValue: any = 1;
  maxLeverageValue:any = 0;
  minLeverageValue:any = 1;
  // leverageStepSize:any = 1;
  range(e: any) {
    this.leverageValue = e.target.value;
    const progress = document.querySelector('.slider');
    e.target.style.background = `linear-gradient(to right,#F1C232 0%, #F1C232 ${e.target.value}%, #E0E0E0 ${e.target.value}%, #E0E0E0 100%)`;
    if (progress) {
      progress.addEventListener('input', function () {
        const value = e.target.value;
        e.target.style.background = `linear-gradient(to right,#F1C232 0%, #F1C232 ${value}%, #E0E0E0 ${value}%, #E0E0E0 100%)`;
      })
    }
    this.fundValidation()
  }

  timeFrameValue: any = null;
  timeFrameChange() {
    switch(true) {
      case this.timeFrameValue === '1week':
        this.tradingViewChart('W');
        break;
      case this.timeFrameValue === '3min':
        this.tradingViewChart('3');
        break;
      case this.timeFrameValue === '5min':
        this.tradingViewChart('5');
        break;
      case this.timeFrameValue === '15min':
        this.tradingViewChart('15');
        break;
      case this.timeFrameValue === '30min':
        this.tradingViewChart('30');
        break;
      case this.timeFrameValue === '1hour':
        this.tradingViewChart('60');
        break;
      case this.timeFrameValue === '2hour':
        this.tradingViewChart('120');
        break;
      case this.timeFrameValue === '4hour':
        this.tradingViewChart('240');
        break;
      case this.timeFrameValue === '6hour':
        this.tradingViewChart('360');
        break;
      case this.timeFrameValue === '12hour':
        this.tradingViewChart('720');
        break;
      case this.timeFrameValue === '1day':
        this.tradingViewChart('D');
        break;
      default:
        this.tradingViewChart('1');
        break;
    }
  }

  //Form reset
  formReset(form: any, field: any) {
    Object.keys(form.controls).forEach(key => {
      if (field.findIndex((q: any) => q === key) === -1) {
        form.get(key).reset();
      }
    })
    this.timeFrameValue = null;
  }

  navigatePage(id:any, type:any){
    this.router.navigateByUrl('/fxgrid', { state: { id: id, type:type } });
  }

  getFlooredFixed(v:any, d:any) {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  }

  ngOnDestroy(): void {
    if (this.selectedExchange && this.selectedExchange.accountType == 'fx') {
      this.subscription.forEach((item) => item.unsubscribe())
      fxUnsubscribeorderbook(this.previousExchange?.exchangeName, this.previousSelectedTradePair?.symbol)
      clearInterval(this.futureService.interval)
    }
  }

}
