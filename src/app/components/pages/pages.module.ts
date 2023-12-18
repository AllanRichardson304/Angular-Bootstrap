import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecurityComponent } from './security/security.component';
import { CodeInputModule } from 'angular-code-input';
import { ExchangeComponent } from './exchange/exchange.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WalletComponent } from './wallet/wallet.component';
import { SpotComponent } from './spot/spot.component';
import { FxComponent } from './fx/fx.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GridComponent } from './grid/grid.component';
import { CopytxtDirective } from 'src/app/helpers/copytxt.directive';
import { NumbervalidateDirective } from 'src/app/helpers/numbervalidate.directive';
import { FxgridComponent } from './fxgrid/fxgrid.component';
import { NotificationComponent } from './notification/notification.component';
import { CoinpairComponent } from './coinpair/coinpair.component';
import { CoinDecimalPipe } from 'src/app/helpers/decimal.pipe';
// import { DetailDateAgo, DateAgoPipe } from 'src/app/helpers/dateAgo.pipe';
// import { PopupconfirmDirective } from 'src/app/shared/popupconfirm/popupconfirm.directive';
@NgModule({
  declarations: [
    DashboardComponent,
    SecurityComponent,
    ExchangeComponent,
    WalletComponent,
    SpotComponent,
    FxComponent,
    GridComponent,
    CopytxtDirective,
    NumbervalidateDirective,
    FxgridComponent,
    NotificationComponent,
    CoinpairComponent,
    CoinDecimalPipe
    // DetailDateAgo,
    // DateAgoPipe,
    // PopupconfirmDirective
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
    }),
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
