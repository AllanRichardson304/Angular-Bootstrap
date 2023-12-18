import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeInputComponent } from 'angular-code-input';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SecurityService } from 'src/app/services/security.service';
import { ToastService } from 'src/app/services/toast.service';
import { MustMatch } from 'src/app/helpers/mustmatch';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  @ViewChild('codeInput') codeInput!: CodeInputComponent;

  codelength = 4;
  userDetail: any = null;
  isLoading: any = {
    g2fa: false,
    pinlock: false,
    activity: false,
    changepassword: false
  }
  changePasswordForm!: FormGroup;

  ngOnInit(): void {
    this.authenticationService.getUserDetail().subscribe({
      next: (res) => {
        if (res) {
          this.userDetail = res;
        }
      }
    });
    this.getActivityLog();
    this.changePasswordForm = this.fb.group({
      newPassword: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      oldPassword: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]],
      confirmPassword: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[-$#@$_!+=)%~`*?(&^])[A-Za-z\d$@#)$=!+~_`%(*?&^].{7,}')]]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    })
  }

  constructor(
    config: NgbModalConfig,
    public modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private securityService: SecurityService,
    private message: ToastService,
    private fb: FormBuilder
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.code2Fa = null;
    this.getQrCode()
    this.modalService.open(content, { centered: true });
  }

  openPin(password: any) {
    this.modalService.open(password, { centered: true, size: 'sm' });
  }

  openPassword(authentication: any) {
    this.modalService.open(authentication, { centered: true, size: '300px' });
  }

  //Generate qr code
  qrCode: any = null;
  secretCode: any = null;
  getQrCode() {
    this.securityService.generateQr().subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.qrCode = res['data']['img'];
          this.secretCode = res['data']['code'];
        }
      }
    })
  }

  //Enable or disable 2fa
  code2Fa: any = null;
  validateCode() {
    this.code2Fa = this.code2Fa.trim();
  }
  status2Fa() {
    this.isLoading.g2fa = true;
    this.securityService.change2FaStatus({ secretOTP: this.code2Fa })
    .pipe(finalize(()=>{
      this.modalService.dismissAll();
      this.isLoading.g2fa = false;
    }))
    .subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          this.authenticationService.getUser().subscribe({
            next: (res: any) => {
              if (res['success']) {
                this.userDetail = res['data'];
                this.authenticationService.sendUserDetail(res['data'])
              }
            }
          })
        } else {
          this.message.success(res['message']);
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
      }
    })
  }

  //Enable disable pin lock
  pinLockCode: any = null;
  getCode(e: String) {
    this.pinLockCode = e.trim();
  }

  changePinLockStatus() {
    this.isLoading.pinlock = true;
    this.securityService.statusPinLock({
      secretPassCode: this.pinLockCode
    }).pipe(finalize(()=>{
      this.isLoading.pinlock = false;
      this.modalService.dismissAll();
    })).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
          this.authenticationService.getUser().subscribe({
            next: (res: any) => {
              if (res['success']) {
                this.userDetail = res['data'];
                this.authenticationService.sendUserDetail(res['data'])
              }
            }
          })
        } else {
          this.message.error(res['message']);
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
      }
    })
  }

  //Activity log
  activityLogList: any = [];
  getActivityLog() {
    this.isLoading.activity = true;
    this.securityService.getActivityLog().subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.activityLogList = res['data'];
          this.isLoading.activity = false;
        }
      }
    })
  }

  //Change Password
  visible: any = {
    newpassword: false,
    confirmpassword: false,
    oldpassword: false
  }

  changeVisible(type: any) {
    switch (true) {
      case type == 'new':
        this.visible.newpassword = !this.visible.newpassword;
        return
      case type == 'old':
        this.visible.oldpassword = !this.visible.oldpassword;
        return
      case type == 'confirm':
        this.visible.confirmpassword = !this.visible.confirmpassword
    }
  }

  changePassword() {
    this.isLoading.changepassword = true;
    let val = {
      currentPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword
    }
    this.securityService.changePassword(val).pipe(finalize(() => {
      this.isLoading.changepassword = false
      this.modalService.dismissAll()
    })).subscribe({
      next: (res: any) => {
        if (res['success']) {
          this.message.success(res['message']);
        } else {
          this.message.error(res['message']);
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
      }
    })
  }
}
