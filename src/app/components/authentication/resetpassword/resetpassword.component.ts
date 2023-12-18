import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from 'src/app/helpers/mustmatch';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  resetForm!: FormGroup;
  visible:any = {
    new:false,
    confirm:false
  }
  isLoading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private authenticationService:AuthenticationService,
    private message:ToastService,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      confirmpassword: ['', [Validators.required]]
    },
      MustMatch('password', 'confirmpassword')
    )
  }

  resetPassword(){
    this.isLoading = true;
    let id = this.route.snapshot.paramMap.get('id');
    let val = { 
      password:this.resetForm.value.password,
      confirmPassword:this.resetForm.value.confirmpassword
    }
    this.authenticationService.resetPassword(val,id).subscribe({
      next: (res:any) => {
        if(res['success']){
          this.message.success(res['message']);
          this.resetForm.reset();
          this.isLoading = false;
          this.router.navigate(['/auth/login'])
        }else{
          this.message.error( res['message']);
          this.isLoading = false;
          this.resetForm.reset();
        }
      },
      error: (err)=>{
        this.message.error(err.error.message);
        this.isLoading = false;
      }
    })
  }
}
