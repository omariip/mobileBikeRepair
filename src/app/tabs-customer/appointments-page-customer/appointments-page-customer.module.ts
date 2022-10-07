import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentsPageCustomerPageRoutingModule } from './appointments-page-customer-routing.module';

import { AppointmentsPageCustomerPage } from './appointments-page-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentsPageCustomerPageRoutingModule
  ],
  declarations: [AppointmentsPageCustomerPage]
})
export class AppointmentsPageCustomerPageModule { }
