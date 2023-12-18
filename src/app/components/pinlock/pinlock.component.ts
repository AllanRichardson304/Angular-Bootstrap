import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CodeInputComponent } from 'angular-code-input';
import { SecurityService } from 'src/app/services/security.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-pinlock',
  templateUrl: './pinlock.component.html',
  styleUrls: ['./pinlock.component.scss']
})
export class PinlockComponent implements OnInit {
  @ViewChild('codeInput') codeInput!: CodeInputComponent;
  isLoading:boolean = false;
  codelength = 4;
  constructor(
    private securityService:SecurityService,
    private message:ToastService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  unlockCode:any = null;
  getCode(e:string){
    this.unlockCode = e.trim();
  }

  unlockScreen(){
    this.isLoading = true;
    this.securityService.unlockScreen({
      secretPassCode:this.unlockCode
    }).subscribe({
      next:(res:any) => {
        if(res['success']){
          localStorage.setItem('isPinLock','')
          this.message.success(res['message']);
          this.router.navigate(['']);
          this.isLoading = false;
        }else{
          this.message.error(res['message']);
          this.isLoading = false;
        }
      },
      error:(err) => {
        this.message.error(err.error.message);
        this.isLoading = false;
      }
    })
  }

}
