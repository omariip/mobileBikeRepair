import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpTechnicianPageRoutingModule } from './sign-up-technician-routing.module';

import { SignUpTechnicianPage } from './sign-up-technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpTechnicianPageRoutingModule, 
    ReactiveFormsModule
  ],
  declarations: [SignUpTechnicianPage]
})
export class SignUpTechnicianPageModule {}
