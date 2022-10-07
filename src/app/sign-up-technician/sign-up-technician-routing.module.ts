import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpTechnicianPage } from './sign-up-technician.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpTechnicianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpTechnicianPageRoutingModule { }
