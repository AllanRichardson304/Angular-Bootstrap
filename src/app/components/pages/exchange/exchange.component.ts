import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExchangeService } from 'src/app/services/exchange.service';
import { exchanges } from 'src/app/helpers/exchanges';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  isLoading:any = {
    create:false,
    list:false,
    delete:false
  }

  //Add Exchange
  exchangeForm!:FormGroup;
  exchangeList:any = exchanges.filter(e => e.status == true);
  selectedExchange:any = null;
  agree:boolean = false;

  constructor(
    public modalService: NgbModal,
    private fb:FormBuilder,
    private exchangeService:ExchangeService,
    private message:ToastService
    ) {}

  ngOnInit(): void {
    this.exchangeForm = this.fb.group({
      exchangeName:[null, [Validators.required]],
      accountName:[null, [Validators.required]],
      apiKey:[null, [Validators.required]],
      secretKey:[null, [Validators.required]],
      passKey:[null],
      accountType:[null, [Validators.required]]
    });
    this.getUserExchangeList();
  }

  open(content: any) {
    this.selectedExchange = null;
    this.agree = false;
    this.exchangeForm.reset();
    this.modalService.open(content,{ centered: true });
  }

  //Validation update
  exchangeChange(){
    if(this.selectedExchange === 'Kucoin'){
      this.exchangeForm.controls['passKey'].setValidators(Validators.required);
      this.exchangeForm.controls['passKey'].updateValueAndValidity();
    }else{
      this.exchangeForm.controls['passKey'].clearValidators();
      this.exchangeForm.controls['passKey'].updateValueAndValidity();
    }
    this.formReset(this.exchangeForm,['exchangeName'])
    this.agree = false;
  }

  //Create Exchange
  createNewExchange(){
    this.isLoading.create = true;
    let val:any =  {
      exchangeName:this.exchangeForm.value.exchangeName,
      accountName:this.exchangeForm.value.accountName,
      apiKey:this.exchangeForm.value.apiKey,
      apiSecret:this.exchangeForm.value.secretKey,
      passKey:this.exchangeForm.value.passKey,
      accountType:this.exchangeForm.value.accountType
    }
    Object.keys(val).forEach((key) => (val[key] == null) && delete val[key]);
    this.exchangeService.createExchange(val).subscribe({
      next: (res:any) =>{
        if(res['success']){
          this.message.success(res['message']);
          this.userExchangeList.push(res['data'])
          this.exchangeService.sendExchangeList(this.userExchangeList)
          this.modalService.dismissAll();
          this.isLoading.create = false;
        }else{
          this.message.error(res['message'])
          this.isLoading.create = false;
        }
      },
      error: (error)=>{
        this.message.error(error.error.message);
        this.isLoading.create = false;
      }
    })
  }

  //Get user exchange list
  userExchangeList:any = [];
  getUserExchangeList(){
    this.isLoading.list = true;
    this.exchangeService.getExchange().subscribe({
      next: (res:any) => {
        if(res['success']){
          this.userExchangeList = res['data'];
          this.isLoading.list = false;
        }
      }
    })
  }

  //Delete exchange
  selectedDeleteID:any;
  selectDeleteExchange(id:any){
    this.selectedDeleteID = id;
  }

  deleteExchange(){
    this.isLoading.delete = true;
    this.exchangeService.deleteExchange({_id:this.selectedDeleteID}).subscribe({
      next: (res:any) =>{
        if(res['success']){
          this.message.success(res['message']);
          this.userExchangeList = this.userExchangeList.filter((e:any) => e._id != this.selectedDeleteID);
          this.exchangeService.sendExchangeList(this.userExchangeList)
          this.isLoading.delete = false;
          this.modalService.dismissAll()
        }else{
          this.message.error(res['message']);
          this.isLoading.delete = false;
          this.modalService.dismissAll();
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.isLoading.delete = false;
        this.modalService.dismissAll();
      }
    })
  }

  //Make Default
  makeDefaultExchange(val:any){
    this.exchangeService.makeExchangeDefault({
      _id:val._id,
      makeDefault:!val.makeDefault
    }).subscribe({
      next:(res:any) => {
        if(res['success']){
          this.userExchangeList.map((e:any) => {
            if(e._id == val._id){
              e.makeDefault = !val.makeDefault;
              return;
            }else{
              e.makeDefault = false;
            }
          });
           this.exchangeService.sendExchangeList(this.userExchangeList);
          this.message.success(res['message']);
        }else{
          this.message.error(res['message']);
        }
      },
      error:(err)=>{
        this.message.error(err.error.message)
      }
    })
  }

  //Form reset
  formReset(form: any, field: any){
    Object.keys(form.controls).forEach(key => {
      if (field.findIndex((q:any) => q === key) === -1) {
        form.get(key).reset();
      }
   })
  }
}
