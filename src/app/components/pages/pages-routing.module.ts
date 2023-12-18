import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { FxComponent } from './fx/fx.component';
import { FxgridComponent } from './fxgrid/fxgrid.component';
import { GridComponent } from './grid/grid.component';
import { SecurityComponent } from './security/security.component';
import { SpotComponent } from './spot/spot.component';
import { WalletComponent } from './wallet/wallet.component';
import { NotificationComponent } from './notification/notification.component';
import { CoinpairComponent } from './coinpair/coinpair.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'security',
    component:SecurityComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'exchange',
    component:ExchangeComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'wallet',
    component:WalletComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'spot',
    component:SpotComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'fx',
    component:FxComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'grid',
    component:GridComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'grid',
    component:GridComponent,
    data: {
      id:0,
      type:'running'
    },
    canActivate:[AuthGuard]
  },
  {
    path:'fxgrid',
    component:FxgridComponent,
    data: {
      id:0,
      type:'running'
    },
    canActivate:[AuthGuard]
  },
  {
    path:'notification',
    component:NotificationComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'coinpair',
    component:CoinpairComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
