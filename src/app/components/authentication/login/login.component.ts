import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  visiblePassword: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private message: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authenticationService.isLoggedIn();
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      password: [null, [Validators.required]]
    })
  }

  loginForm!: FormGroup;
  isLoginLoad = false;
  userLogin() {
    if (this.loginForm.valid) {
      let val = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.authenticationService.login(val).subscribe({
        next: (res: any) => {
          if (res['success']) {
            this.message.success(res['message']);
            localStorage.setItem('userid', res['data']['_id']);
            localStorage.setItem('role', res['data']['role'])
            if (res['data'].status2fa) {
              this.router.navigate(['/auth/twofactorauthentication']);
            } else {
              localStorage.setItem('isLoggedIn', 'true');
              if(res['data']['role'] == 'user'){
                this.router.navigate([''])
              }else{
                this.router.navigate(['/coinpair'])
              }
            }
            this.isLoginLoad = false;
          }
          else {
            this.message.error(res['message']);
            this.isLoginLoad = false;
          }
        },
        error: (err) => {
          this.message.error(err.error.error);
          this.isLoginLoad = false;
        }
      })
    }
  }

}
