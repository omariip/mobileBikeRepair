import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageTechnicianPageRoutingModule } from './home-page-technician-routing.module';

import { HomePageTechnicianPage } from './home-page-technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageTechnicianPageRoutingModule,
  ],
  declarations: [HomePageTechnicianPage]
})
export class HomePageTechnicianPageModule { }
