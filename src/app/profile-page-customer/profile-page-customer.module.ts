import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageCustomerPageRoutingModule } from './profile-page-customer-routing.module';

import { ProfilePageCustomerPage } from './profile-page-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageCustomerPageRoutingModule
  ],
  declarations: [ProfilePageCustomerPage]
})
export class ProfilePageCustomerPageModule {}
