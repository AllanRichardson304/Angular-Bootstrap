import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TwofactorAuthenticationComponent } from './twofactor-authentication/twofactor-authentication.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    TwofactorAuthenticationComponent,
    ForgetPasswordComponent,
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CodeInputModule
  ]
})
export class AuthenticationModule { }
