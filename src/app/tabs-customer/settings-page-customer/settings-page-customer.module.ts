import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageCustomerPageRoutingModule } from './settings-page-customer-routing.module';

import { SettingsPageCustomerPage } from './settings-page-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageCustomerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SettingsPageCustomerPage]
})
export class SettingsPageCustomerPageModule { }
