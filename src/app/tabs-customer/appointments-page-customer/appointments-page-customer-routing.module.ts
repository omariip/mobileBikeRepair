import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentsPageCustomerPage } from './appointments-page-customer.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPageCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsPageCustomerPageRoutingModule { }
