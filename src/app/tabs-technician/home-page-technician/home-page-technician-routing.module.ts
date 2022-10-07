import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageTechnicianPage } from './home-page-technician.page';

const routes: Routes = [
  {
    path: '',
    component: HomePageTechnicianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageTechnicianPageRoutingModule { }
