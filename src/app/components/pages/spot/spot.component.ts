import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import { SpotService } from 'src/app/services/spot.service';
import { ToastService } from 'src/app/services/toast.service';
import { spotOrderbookData, spotUnsubscribeorderbook } from 'src/app/helpers/orderbook';
import { Router } from '@angular/router';

declare const TradingView: any;
@Component({
  selector: 'app-spot',
  templateUrl: './spot.component.html',
  styleUrls: ['./spot.component.scss']
})
export class SpotComponent implements OnInit, OnDestroy {
  selectedExchange: any = null;
  selectedTradePairDetail: any = null;
  previousExchange: any = null;
  previousSelectedTradePair: any = null;
  selectedTradePair: any = null;
  tradeForm!: FormGroup;
  isLoading: any = {
    create: false,
    cancel: false,
    tradeHistory: false,
    activeGrid: false
  };
  subscription: Subscription[] = [];

  constructor(
    private exchangeService: ExchangeService,
    private message: ToastService,
    private offcanvasService: NgbOffcanvas,
    private spotService: SpotService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      coinpair: [Validators.required],
      amount: [null, [Validators.required]],
      gridsize: [null, [Validators.required]],
      gridline: [null, [Validators.required, Validators.min(5), Validators.max(100)]],
      // gridline: [null, [Validators.required]],
      stoploss: [null, [Validators.required, Validators.min(1), Validators.max(20)]],
      leverage: [null],
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
          if (res) {
            if (res?.accountType == 'spot') {
              this.selectedExchange = res;
              this.selectedTradePairDetail = null;
              this.accountBalance.balanceList = []
              this.getExchangeInfo().then(() => {
                this.getOverAllBalance();
              });
            }
            else {
              this.router.navigate(['/'])
            }
          }
        }
      }))
    this.getActiveGrid();
    // this.getKucoinToken();
    // this.getKucoinOrderBook()
  }

  //Overall usdt balance
  accountBalance: any = {
    balance: 0,
    balanceList: [],
    tempBalanceList: []
  };
  getOverAllBalance() {
    this.spotService.getAccountBalance({
      exchangeName: this.selectedExchange.exchangeName,
      accountName: this.selectedExchange.accountName,
      accountType: this.selectedExchange.accountType
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.accountBalance.tempBalanceList = res['data'];
          this.accountBalance.balanceList = this.accountBalance.tempBalanceList.filter((t: any) => t.free > 0)
          let data = res['data'].length > 0 && res['data'].find((e: any) => e.asset.toLowerCase() === this.selectedTradePairDetail?.quoteAsset.toLowerCase()).free;
          this.accountBalance.balance = this.getFlooredFixed(data, 2)
          this.tradeForm.controls['amount'].setValidators([Validators.required, Validators.max(this.accountBalance.balance)]);
        }
      }
    })
  }

  // range(e: any) {
  //   const progress = document.querySelector('.progress');
  //   if (progress) {
  //     progress.addEventListener('input', function () {
  //       const value = e.target.value;
  //       e.target.style.background = `linear-gradient(to right,#F1C232 0%, #F1C232 ${value}%, #E0E0E0 ${value}%, #E0E0E0 100%)`;
  //     })
  //   }
  // }

  tradingViewChart(interval: any) {
    new TradingView.widget({
      container_id: "spot_chart",
      autosize: true,
      symbol: `${this.selectedExchange?.exchangeName == 'bitrue' ? "BINANCE" : this.selectedExchange?.exchangeName.toUpperCase()}:${this.selectedTradePairDetail?.baseAsset}${this.selectedTradePairDetail?.quoteAsset}`,
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

  //Exchange Info
  exchangeInfoList: any = [];
  getExchangeInfo() {
    return new Promise<void>((resolve) => {
      this.spotService.getExchangeInfo({
        exchangeName: this.selectedExchange?.exchangeName.toLowerCase()
      }).subscribe({
        next: (res: any) => {
          if (res['success']) {
            this.exchangeInfoList = res['data'];
            this.selectedTradePairDetail = this.selectedTradePairDetail == null ? this.exchangeInfoList.find((t: any) => t.baseAsset == 'BTC' && t.quoteAsset == 'USDT') : this.selectedTradePairDetail;
            this.selectedTradePair = this.selectedTradePairDetail?.symbol;
            this.tradeForm.controls['gridsize'].setValidators([Validators.required, Validators.min(this.selectedTradePairDetail?.minQty)])
            resolve();
          }
        }
      })
    })

  }

  //Exchange Coin Pair change
  coinPairChange() {
    this.selectedTradePairDetail = this.selectedTradePairDetail == null ? this.exchangeInfoList.find((t: any) => t.baseAsset == 'BTC' && t.quoteAsset == 'USDT') :
      this.exchangeInfoList.find((t: any) => t.symbol == this.selectedTradePair);
    let data = this.accountBalance.balanceList.length > 0 && this.accountBalance.balanceList.find((e: any) => e.asset.toLowerCase() === this.selectedTradePairDetail?.quoteAsset.toLowerCase()).free;
    this.accountBalance.balance = this.getFlooredFixed(data, 2)
    this.tradeForm.controls['amount'].setValidators([Validators.required, Validators.max(this.accountBalance.balance)]);
    this.tradeForm.controls['gridsize'].setValidators([Validators.required, Validators.min(this.selectedTradePairDetail?.minQty)]);
    this.tradeForm.controls['gridsize'].setValue('')
    this.tradingViewChart('1');
    if (this.selectedTradePairDetail && (this.selectedTradePair != this.previousSelectedTradePair?.symbol)) {
      this.getKucoinOrderBook();
      this.previousSelectedTradePair = this.selectedTradePairDetail;
      this.previousExchange = this.selectedExchange;
    }
  }

  //Get current price by symbol
  currentPrice: any = 0;
  getCurrentPrice() {
    this.spotService.currentPrice({
      exchangeName: this.selectedExchange?.exchangeName.toLowerCase(),
      symbol: this.selectedTradePair
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.currentPrice = res['data']
        }
      }
    })
  }

  //Order Book
  orderBookData: any = {
    bid: [],
    ask: []
  }

  maxAskAmount: any = 0;
  maxBidAmount: any = 0;
  async getKucoinOrderBook() {
    if (this.previousExchange && this.previousSelectedTradePair != null) {
      spotUnsubscribeorderbook(this.previousExchange?.exchangeName, this.previousSelectedTradePair?.symbol)
    }
    await spotOrderbookData(this.selectedExchange.exchangeName, this.selectedTradePairDetail?.symbol).then(async () => {
      await this.spotService.getOrderBookData.subscribe({
        next: async (msg: any) => {
          this.orderBookData.bid = await msg?.ask;
          this.orderBookData.ask = await msg?.bid;
          if (msg?.ask.length > 0) {
            this.maxAskAmount = Math.max.apply(Math, this.orderBookData.ask.map(function (o: any) { return o.quantity; }));
          }
          if (msg?.bid.length > 0) {
            this.maxBidAmount = Math.max.apply(Math, this.orderBookData.bid.map(function (o: any) { return o.quantity; }));
          }
          this.orderBookData.bid = this.orderBookData.bid.map((e: any) => ({
            ...e, widthPercent: (((+e.quantity) / this.maxBidAmount) * 100) > 100 ? 100
              : (((+e.quantity) / this.maxBidAmount) * 100) < 0 ? 0
                : (((+e.quantity) / this.maxBidAmount) * 100)
          }));
          this.orderBookData.ask = this.orderBookData.ask.map((e: any) => ({
            ...e, widthPercent: ((e.quantity / this.maxAskAmount) * 100) > 100 ? 100
              : ((e.quantity / this.maxAskAmount) * 100) < 0 ? 0
                : ((e.quantity / this.maxAskAmount) * 100)
          }))
          // }
        },
        error: (err: any) => {
          // console.log(err)
        }
      });
    });
  }

  //Grid line fund validation
  minGridAmount = 15;
  fundValidation() {
    this.tradeForm.controls['amount'].addValidators(Validators.min((this.tradeForm.value.gridline * 15)));
    this.minGridAmount = (this.tradeForm.value.gridline * 15)
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
      signalLineType: this.tradeForm.value.signalMA
    }
    this.spotService.createOrder(val).subscribe({
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

  //Cancel Order
  cancelOrder() {
    this.isLoading.cancel = true;
    this.spotService.cancelOrder({

    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          this.isLoading.cancel = false;
        } else {
          this.message.error(res['message']);
          this.isLoading.cancel = false;
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.isLoading.cancel = false;
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
    this.spotService.activeGrid({
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
  selectedGridData: any = null;
  isEdit: boolean = false;
  selectActiveData(data: any) {
    this.selectedGridData = data;
    this.selectedTradePair = data?.symbol;
    this.timeFrameValue = data?.timeFrame;
    this.isEdit = true;
  }

  editActiveGrid() {
    this.spotService.gridEdit({
      id: this.selectedGridData._id,
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
          this.selectedGridData = null;
          this.isEdit = false;
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

  //Grid history
  tradeHistory: any = {
    list: [],
    count: 0
  }
  getGridHistory() {
    this.isLoading.tradeHistory = true;
    this.spotService.gridHistory({
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
    this.spotService.gridSpot(id).subscribe({
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

  timeFrameValue: any = null;
  timeFrameChange() {
    switch (true) {
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

  navigatePage(id: any, type: any) {
    this.router.navigateByUrl('/grid', { state: { id: id, type: type } });
  }

  //Form reset
  formReset(form: any, field: any) {
    Object.keys(form.controls).forEach(key => {
      if (field.findIndex((q: any) => q === key) === -1) {
        form.get(key).reset();
      }
    })
    this.timeFrameValue = null;
    this.selectedGridData = null;
    this.isEdit = false;
  }

  getFlooredFixed(v: any, d: any) {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  }


  ngOnDestroy(): void {
    if (this.selectedExchange && this.selectedExchange.accountType == 'spot') {
      this.subscription.forEach(item => item.unsubscribe())
      spotUnsubscribeorderbook(this.previousExchange?.exchangeName, this.previousSelectedTradePair?.symbol)
      clearInterval(this.spotService.interval)
    }
  }

}
