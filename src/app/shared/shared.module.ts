import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToastComponent } from './toast/toast.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SliderComponent } from './slider/slider.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { PopupconfirmDirective } from './popupconfirm/popupconfirm.directive';
// import { DateAgoPipe } from '../helpers/dateAgo.pipe';
import { DetailDateAgo, DateAgoPipe } from 'src/app/helpers/dateAgo.pipe';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { OptionComponent } from './option/option.component';
@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    ToastComponent,
    SliderComponent,
    LoaderComponent,
    PopupconfirmDirective,
    // DateAgoPipe,
    DetailDateAgo,
    DateAgoPipe,
    SearchDropdownComponent,
    OptionComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    HeaderComponent,
    SidenavComponent,
    ToastComponent,
    SliderComponent,
    LoaderComponent,
    PopupconfirmDirective,
    DetailDateAgo,
    DateAgoPipe,
    SearchDropdownComponent,
    OptionComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }
