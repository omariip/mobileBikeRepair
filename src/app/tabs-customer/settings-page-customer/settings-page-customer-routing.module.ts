import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPageCustomerPage } from './settings-page-customer.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageCustomerPageRoutingModule {}
