import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePageCustomerPage } from './profile-page-customer.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePageCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageCustomerPageRoutingModule {}
