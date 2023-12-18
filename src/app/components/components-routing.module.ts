import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LayoutComponent } from './layout/layout.component';
import { PinlockComponent } from './pinlock/pinlock.component';
import { PinlockGuard } from '../services/pinlock.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
    canActivate: [PinlockGuard]
  },

  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    canActivate: [PinlockGuard]
  },

  {
    path: 'pinlock',
    component: PinlockComponent
  },
  {
    path: '**',
    component: PagenotfoundComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
