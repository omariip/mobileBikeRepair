import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPageTechnicianPage } from './settings-page-technician.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageTechnicianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageTechnicianPageRoutingModule { }
