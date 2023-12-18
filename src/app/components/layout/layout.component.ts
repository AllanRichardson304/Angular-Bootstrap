import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private authenticationService:AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.getUser().subscribe({
      next:(res:any) => {
        if(res['success']){
          this.authenticationService.sendUserDetail(res['data']);
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('role', res['data']['role'])
        }
      }
    })
  }

}
