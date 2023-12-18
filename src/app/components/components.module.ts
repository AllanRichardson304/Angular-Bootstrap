import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SharedModule } from '../shared/shared.module';
import { PinlockComponent } from './pinlock/pinlock.component';
import { CodeInputModule } from 'angular-code-input';
// import { DateAgoPipe } from '../helpers/dateAgo.pipe';

@NgModule({
  declarations: [
    LayoutComponent,
    PagenotfoundComponent,
    PinlockComponent,
    // DateAgoPipe
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    SharedModule,
    CodeInputModule
  ]
})
export class ComponentsModule { }
