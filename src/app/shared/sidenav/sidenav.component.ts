import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ExchangeService } from 'src/app/services/exchange.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  subscription:Subscription[] = [];
  selectedExchange:any;
  role:any = localStorage.getItem('role');

  constructor(
    private authenticationService:AuthenticationService,
    private message:ToastService,
    private router:Router,
    private offcanvasService: NgbOffcanvas,
    private exchangeService:ExchangeService
  ) { }

  ngOnInit(): void {
    this.subscription.push(
      this.exchangeService.getSelectedExchange().subscribe({
        next: (res: any) => {
          if (res) {
            this.selectedExchange = res;
          }
        }
      })
      )
  }

  logOut(){
    this.authenticationService.logOut().subscribe({
      next:(res:any) => {
        if(res['success']){
          this.message.success(res['message']);
          this.router.navigate(['/auth'])
        }else{
          this.message.error(res['message'])
        }
      },
      error:(err)=>{
        this.message.error(err.error.message)
      }
    })
  }
  open(content: any) {
    this.offcanvasService.open(content, { position: 'start', backdrop: false , });
  }


}
