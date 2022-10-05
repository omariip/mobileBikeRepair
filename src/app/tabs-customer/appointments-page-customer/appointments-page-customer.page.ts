import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, Firestore, getDoc, getDocs, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
  ) { }

  async ngOnInit() {
    console.log(this.appointments)
    this.getData();
  }

  async getData() {
    await this.currentUser.getCurrentUserDetails().then(data => {
      console.log(data);
      this.customerInfo = data;
    });

    this.appointments = this.customerInfo.appointments;
    if (this.appointments !== null && this.appointments !== undefined && this.appointments.length !== 0) {

      this.sortAppointments();
    }
  }

  async sortAppointments() {

    await this.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
    console.log(this.appointments);
  }

  async doRefresh(event) {
    this.appointments = [];
    await this.getData();
    event.target.complete();
  }
}
