import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CodeInputComponent } from 'angular-code-input';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-twofactor-authentication',
  templateUrl: './twofactor-authentication.component.html',
  styleUrls: ['./twofactor-authentication.component.scss']
})
export class TwofactorAuthenticationComponent implements OnInit {
  @ViewChild('codeInput') codeInput!: CodeInputComponent;
  codelength = 6;
  isLoad:boolean = false;

  constructor(
    private authenticationService:AuthenticationService,
    private router:Router,
    private message:ToastService
  ) { }

  ngOnInit(): void {
  }

  verifycode:any = null;
  onCodeChanged(e:string){
    this.verifycode = e.trim();
  }

  verify2Fa(){
    this.isLoad = true;
    this.authenticationService.verify2fa({
        secretOTP:this.verifycode,
        user_id:localStorage.getItem('userid')
      }).subscribe({
        next:(res:any) => {
          if(res['success']){
            localStorage.setItem('isLoggedIn', 'true');
            this.message.success(res['message']);
            this.router.navigate(['']);
            this.isLoad = false;
          }else{
            this.message.error(res['message']);
            this.isLoad = false;
          }
        },
        error:(err) => {
          this.message.error(err.error.message);
          this.isLoad = false;
        }
      })
  }

}
