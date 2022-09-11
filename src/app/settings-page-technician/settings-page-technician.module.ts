import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageTechnicianPageRoutingModule } from './settings-page-technician-routing.module';

import { SettingsPageTechnicianPage } from './settings-page-technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageTechnicianPageRoutingModule
  ],
  declarations: [SettingsPageTechnicianPage]
})
export class SettingsPageTechnicianPageModule {}
