import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsPageCustomerPage } from '../settings-page-customer/settings-page-customer.page';

import { HomePagePage } from './home-page-customer.page';

const routes: Routes = [
  {
    path: '',
    component: HomePagePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePagePageRoutingModule { }
