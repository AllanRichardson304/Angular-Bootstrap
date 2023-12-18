import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';
import { FutureService } from 'src/app/services/future.service';
import { SpotService } from 'src/app/services/spot.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-coinpair',
  templateUrl: './coinpair.component.html',
  styleUrls: ['./coinpair.component.scss']
})
export class CoinpairComponent implements OnInit {
  isLoading: any = {
    spot: false,
    fx: false,
    table: false,
    isEdit: false
  };
  tempData: any = {
    spot: [],
    fx: []
  }
  exchangeName: any = 'kucoin';
  pageIndex: any = 1;
  selectedTab: any = 'spot';
  editForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private message: ToastService,
    private spotService: SpotService,
    private futureService: FutureService,
    public modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      decimal: ['', [Validators.required]],
      basePrecision:['',[Validators.required]],
      quotePrecision:['',[Validators.required]],
      status: []
    })
    // this.getSpotCoinpair()
  }

  //Spot import coinpair
  importCoinPairSpot() {
    this.pageIndex = 1;
    this.isLoading.spot = true;
    this.adminService.importSpotCoinPair({
      exchangeName: this.exchangeName
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          this.getSpotCoinpair();
          this.isLoading.spot = false;
        }
      }
    })
  }

  spotCoinPairList: any = [];
  tempSpotCoinPairList: any = []
  getSpotCoinpair() {
    this.isLoading.table = true;
    this.spotService.getExchangeInfo({
      exchangeName: this.exchangeName
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.tempSpotCoinPairList = res['data'];
          this.tempData.spot = this.tempSpotCoinPairList;
          this.spotCoinPairList = this.eventchange(this.pageIndex, 10, this.tempSpotCoinPairList);
        }
      }
    })
  }

  onSpotPageChange() {
    this.search();
    // this.spotCoinPairList = this.eventchange(this.pageIndex, 10, this.tempSpotCoinPairList);
  }

  //FX import coinpair
  importCoinPairFx() {
    this.isLoading.fx = true;
    this.pageIndex = 1;
    this.adminService.importFxCoinPair({
      exchangeName: this.exchangeName
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          this.getFxCoinpair();
          this.isLoading.fx = false;
        }
      }
    })
  }

  fxCoinPairList: any = [];
  tempFxCoinPairList: any = [];
  getFxCoinpair() {
    this.isLoading.table = true;
    this.futureService.exchangeInfo({
      exchangeName: this.exchangeName
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.tempFxCoinPairList = res['data'];
          this.tempData.fx = this.tempFxCoinPairList;
          this.fxCoinPairList = this.eventchange(this.pageIndex, 10, this.tempFxCoinPairList);
        }
      }
    })
  }

  onFxPageChange() {
    // this.fxCoinPairList = this.eventchange(this.pageIndex, 10, this.tempFxCoinPairList);
    this.search()
  }

  onChangeExchange() {
    if (this.exchangeName) {
      this.selectedTab == 'spot' ? this.getSpotCoinpair() : this.getFxCoinpair();
    }
  }

  selectedCoinPairDetail: any = null;
  open(content: any, data: any) {
    this.selectedCoinPairDetail = data;
    this.editForm.reset();
    this.editForm.controls['decimal'].setValue(this.selectedTab == 'spot' ? (data?.decimal) : (data?.tickSize))
    this.editForm.controls['status'].setValue(data.status)
    this.editForm.controls['basePrecision'].setValue(data?.baseAssetPrecision)
    this.editForm.controls['quotePrecision'].setValue(data.quoteAssetPrecision)
    this.modalService.open(content, { centered: true });
  }

  spotEditCoinPair() {
    this.isLoading.isEdit = true;
    this.adminService.editSpotCoinPair({
      exchangeName: this.selectedCoinPairDetail.exchange,
      id: this.selectedCoinPairDetail._id,
      status: this.editForm.value.status,
      decimal: this.editForm.value.decimal,
      quoteAssetPrecision:this.editForm.value.quotePrecision,
      baseAssetPrecision:this.editForm.value.basePrecision
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.editForm.reset();
          this.spotCoinPairList.forEach((element: any) => {
            if (element._id === this.selectedCoinPairDetail._id) {
              element.decimal = res['data'].decimal
              element.status = res['data'].status
              element.quoteAssetPrecision = res['data'].quoteAssetPrecision
              element.baseAssetPrecision = res['data'].baseAssetPrecision
            }
          });
          this.modalService.dismissAll();
          this.message.success(res['message']);
          this.isLoading.isEdit = false;
        } else {
          this.message.error(res['message'])
          this.isLoading.isEdit = false;
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.isLoading.isEdit = false
      }
    })
  }

  fxEditCoinPair() {
    this.isLoading.isEdit = true;
    this.adminService.editFxCoinPair({
      exchangeName: this.selectedCoinPairDetail.exchange,
      id: this.selectedCoinPairDetail._id,
      status: this.editForm.value.status,
      tickSize: this.editForm.value.decimal,
      quoteAssetPrecision:this.editForm.value.quotePrecision,
      baseAssetPrecision:this.editForm.value.basePrecision
    }).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.editForm.reset();
          this.fxCoinPairList.forEach((element: any) => {
            if (element._id === this.selectedCoinPairDetail._id) {
              element.tickSize = res['data'].tickSize
              element.status = res['data'].status
              element.quoteAssetPrecision = res['data'].quoteAssetPrecision
              element.baseAssetPrecision = res['data'].baseAssetPrecision
            }
          });
          this.modalService.dismissAll();
          this.message.success(res['message']);
          this.isLoading.isEdit = false;
        } else {
          this.message.error(res['message'])
          this.isLoading.isEdit = false;
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.isLoading.isEdit = false
      }
    })
  }

  searchTxt: any = '';
  search() {
    if (this.searchTxt.trim().length > 0) {
      if (this.selectedTab == 'spot') {
        this.spotCoinPairList = this.eventchange(this.pageIndex, 10, this.tempData.spot.filter((t: any) => t.symbol.toLowerCase().includes(this.searchTxt.toLowerCase())));
        this.tempSpotCoinPairList = this.tempData.spot.filter((t: any) => t.symbol.toLowerCase().includes(this.searchTxt.toLowerCase()))
      } else {
        this.fxCoinPairList = this.eventchange(this.pageIndex, 10, this.tempData.fx.filter((t: any) => t.symbol.toLowerCase().includes(this.searchTxt.toLowerCase())));
        this.tempFxCoinPairList = this.tempData.fx.filter((t: any) => t.symbol.toLowerCase().includes(this.searchTxt.toLowerCase()))
      }
    } else {
      this.tempSpotCoinPairList = this.tempData.spot;
      this.tempFxCoinPairList = this.tempData.fx;
      this.spotCoinPairList = this.eventchange(this.pageIndex, 10, this.tempSpotCoinPairList);
      this.fxCoinPairList = this.eventchange(this.pageIndex, 10, this.tempFxCoinPairList)
    }
  }

  eventchange(pagenumber: any, si: any, tempArr: any) {
    let finalArr = tempArr.slice((pagenumber - 1) * si, pagenumber * si);
    this.isLoading.table = false;
    return finalArr;
  }

}
