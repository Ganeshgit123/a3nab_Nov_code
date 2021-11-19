import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { StoresComponent } from './stores/stores.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductStatsComponent } from './product-stats/product-stats.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DriversComponent } from './drivers/drivers.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { MakeassignmentComponent } from './makeassignment/makeassignment.component';
import { SettingsComponent } from './settings/settings.component';
import { CarsComponent } from './cars/cars.component';
import { SupportComponent } from './support/support.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RequestComponent } from './request/request.component';
import { OffersComponent } from './offers/offers.component';
import { ExportComponent  } from './export/export.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RoleGuardService } from './auth/role-guard.service';
import { ThermalPrintModule } from 'ng-thermal-print';
import { from } from 'rxjs';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuard] },
      { path: 'products', component: ProductsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Storestrue'} },
      { path: 'products/:id', component: ProductsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Storestrue'} },
      { path: 'store', component: StoresComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Storestrue'} },
      { path: 'view-store/:id', component: AddStoreComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Storestrue'} },
      { path: 'customer', component: CustomerComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Customertrue'} },
      { path: 'customer/:id', component: CustomerComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Customertrue'} },
      { path: 'product-stats', component: ProductStatsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Storestrue'} },
      { path: 'orders', component: OrdersComponent,  canActivate: [AuthGuard, RoleGuardService], data: { expectedRole: 'Orderstrue'} },
      { path: 'drivers', component: DriversComponent,  canActivate: [AuthGuard, RoleGuardService], data: { expectedRole: 'Driverstrue'}},
      { path: 'drivers/:id', component: DriversComponent,  canActivate: [AuthGuard, RoleGuardService], data: { expectedRole: 'Driverstrue'}},
      { path: 'cars', component: CarsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Driverstrue'} },
      { path: 'assignment', component: AssignmentComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Driverstrue'} },
      { path: 'settings', component: SettingsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Settingstrue'} },
      { path: 'order-details/:id', component: OrderDetailsComponent,  canActivate: [AuthGuard,RoleGuardService], data: { expectedRole: 'Orderstrue'} },
      { path: 'makeassignment', component: MakeassignmentComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Driverstrue'} },
      { path: 'makeassignment/:id', component: MakeassignmentComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Driverstrue'} },
      {path: 'support', component: SupportComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Supporttrue'}},
      {path: 'feedback', component: FeedbackComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Supporttrue'}},
      {path: 'requests', component: RequestComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Supporttrue'}},
      {path: 'offers', component: OffersComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Offerstrue'}},
      {path: 'export', component: ExportComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: 'Exporttrue'}},
      {path: 'change_password', component: ChangePasswordComponent,  canActivate: [AuthGuard]},
    ],
    canActivate: [AuthGuard]
  }

      
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [CommonModule, BrowserModule, ThermalPrintModule, RouterModule.forRoot(routes, { useHash: true })],

  exports: [RouterModule]
})
export class AppRoutingModule { }
