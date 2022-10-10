import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageTechnicianPageRoutingModule } from './settings-page-technician-routing.module';

import { SettingsPageTechnicianPage } from './settings-page-technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageTechnicianPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SettingsPageTechnicianPage]
})
export class SettingsPageTechnicianPageModule { }
