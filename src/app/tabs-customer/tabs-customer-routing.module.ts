import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsCustomerPage } from './tabs-customer.page';

const routes: Routes = [
  {
    path: '',
    component: TabsCustomerPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home-page-customer/home-page-customer.module').then(m => m.HomePagePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings-page-customer/settings-page-customer.module').then(m => m.SettingsPageCustomerPageModule)
      },
      {
        path: 'appointments',
        loadChildren: () => import('./appointments-page-customer/appointments-page-customer.module').then(m => m.AppointmentsPageCustomerPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsCustomerPageRoutingModule { }
