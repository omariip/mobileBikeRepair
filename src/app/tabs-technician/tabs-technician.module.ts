import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsTechnicianPageRoutingModule } from './tabs-technician-routing.module';

import { TabsTechnicianPage } from './tabs-technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsTechnicianPageRoutingModule
  ],
  declarations: [TabsTechnicianPage]
})
export class TabsTechnicianPageModule {}
