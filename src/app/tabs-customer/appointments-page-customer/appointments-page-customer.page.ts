import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, Firestore, getDoc, getDocs, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-appointments-page-customer',
  templateUrl: './appointments-page-customer.page.html',
  styleUrls: ['./appointments-page-customer.page.scss'],
})
export class AppointmentsPageCustomerPage implements OnInit {

  customerInfo = null;
  appointments = null;
  displayImage = false;
  loading = null;

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    this.getData();
  }

  async getData() {
    this.showLoading("Loading appointments...");
    await this.currentUser.getCurrentUserDetails().then(data => {
      this.customerInfo = data;
    });

    this.appointments = this.customerInfo.appointments;
    if (this.appointments !== null && this.appointments !== undefined && this.appointments.length !== 0) {

      this.sortAppointments();
    }
    this.loading.dismiss();
  }

  async sortAppointments() {
    this.loading.dismiss();
    await this.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
    this.loading.dismiss();
  }

  async doRefresh(event) {
    this.appointments = [];
    await this.getData();
    event.target.complete();
  }

  /**
   * A function that shows a loading screen
   * @param message message to display
   */
  async showLoading(message) {
    this.loading = await this.loadingCtrl.create({
      message: message,
    })
    this.loading.present();
  }
}
