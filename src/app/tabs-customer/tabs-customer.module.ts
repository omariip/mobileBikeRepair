import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsCustomerPageRoutingModule } from './tabs-customer-routing.module';

import { TabsCustomerPage } from './tabs-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsCustomerPageRoutingModule
  ],
  declarations: [TabsCustomerPage]
})
export class TabsCustomerPageModule {}
