import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePageTechnicianPage } from './profile-page-technician.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePageTechnicianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageTechnicianPageRoutingModule { }
