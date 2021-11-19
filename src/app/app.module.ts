import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { ReactiveFormsModule , FormsModule } from'@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule,GoogleMapsAPIWrapper } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxSortableModule } from 'ngx-sortable'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { FooterComponent } from './layout/footer/footer.component';
import { StoresComponent } from './stores/stores.component';
import { CategoryFormComponent } from './products/category-form/category-form.component';
import { SubCategoryFormComponent } from './products/sub-category-form/sub-category-form.component';
import { SubSubCategoryFormComponent } from './products/sub-sub-category-form/sub-sub-category-form.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { CustomerComponent } from './customer/customer.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { ProductStatsComponent } from './product-stats/product-stats.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DriversComponent } from './drivers/drivers.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { MakeassignmentComponent } from './makeassignment/makeassignment.component';
import { SettingsComponent } from './settings/settings.component';
import { CarsComponent } from './cars/cars.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OffersComponent } from './offers/offers.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RequestComponent } from './request/request.component';
import { SupportComponent } from './support/support.component';
import { DeliveryComponent } from './settings/delivery/delivery.component';
import { UserSettingComponent } from './settings/user-setting/user-setting.component';
import { NotificationsComponent } from './settings/notifications/notifications.component';
import { RulesComponent } from './settings/rules/rules.component';
import { FaqComponent } from './settings/faq/faq.component';
import { PrivactyPolicyComponent } from './settings/privacty-policy/privacty-policy.component';
import { GeneralComponent } from './settings/general/general.component';
import { AdminNumComponent } from './settings/admin-num/admin-num.component';
import { ExportComponent } from './export/export.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { RoleGuardService } from './auth/role-guard.service';
import { AngularDateTimePickerModule} from 'angular2-datetimepicker';
import {NgxPrintModule} from 'ngx-print';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    ProductsComponent,
    FooterComponent,
    StoresComponent,
    CategoryFormComponent,
    SubCategoryFormComponent,
    SubSubCategoryFormComponent,
    ProductFormComponent,
    CustomerComponent,
    AddStoreComponent,
    ProductStatsComponent,
    OrdersComponent,
    OrderDetailsComponent,
    DriversComponent,
    AssignmentComponent,
    MakeassignmentComponent,
    SettingsComponent,
    CarsComponent,
    OffersComponent,
    FeedbackComponent,
    RequestComponent,
    SupportComponent,
    DeliveryComponent,
    UserSettingComponent,
    NotificationsComponent,
    RulesComponent,
    FaqComponent,
    PrivactyPolicyComponent,
    GeneralComponent,
    AdminNumComponent,
    ExportComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    NgxPrintModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyBBMiu7KoAuHS3diUol5gjv1j5pT3qZi54',
      libraries: ['visualization'],
    }),
    
    NgbModule,
    NgxSortableModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    FormsModule,
    AngularMultiSelectModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    TimepickerModule.forRoot(),
    AngularDateTimePickerModule,
    Ng2SearchPipeModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NgApexchartsModule,
  ],
  exports: [AngularDateTimePickerModule],
  providers: [AuthGuard, RoleGuardService,GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
