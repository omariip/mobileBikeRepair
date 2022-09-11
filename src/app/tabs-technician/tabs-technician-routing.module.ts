import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsTechnicianPage } from './tabs-technician.page';

const routes: Routes = [
  {
    path: '',
    component: TabsTechnicianPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home-page-technician/home-page-technician.module').then(m=>m.HomePageTechnicianPageModule)
      },
      {
        path: 'profile',
        loadChildren: ()=>import('./profile-page-technician/profile-page-technician.module').then(m=>m.ProfilePageTechnicianPageModule)
      },
      {
        path: 'settings',
        loadChildren: ()=>import('./settings-page-technician/settings-page-technician.module').then(m=>m.SettingsPageTechnicianPageModule)
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
export class TabsTechnicianPageRoutingModule {}
