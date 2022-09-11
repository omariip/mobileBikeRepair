import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageTechnicianPageRoutingModule } from './profile-page-technician-routing.module';

import { ProfilePageTechnicianPage } from './profile-page-technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageTechnicianPageRoutingModule
  ],
  declarations: [ProfilePageTechnicianPage]
})
export class ProfilePageTechnicianPageModule {}
