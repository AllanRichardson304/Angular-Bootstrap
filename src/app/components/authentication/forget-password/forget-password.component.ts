import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgotForm!:FormGroup;
  isLoading:boolean = false;

  constructor(
    private fb:FormBuilder,
    private authenticationService:AuthenticationService,
    private message:ToastService
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email:['',[Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$")]]
    })
  }

  submitForgotPassword(){
    this.isLoading = true;
    this.authenticationService.forgorPassword({
      email:this.forgotForm.value.email
    }).subscribe({
      next:(res:any) => {
        if(res['success']){
          this.message.success(res['message']);
          this.isLoading = false;
          this.forgotForm.reset();
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
