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
  appointmentsIds = [];
  appointments = [];
  displayImage = false;

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
  ) { }

  async ngOnInit() {

    this.getData();
  }

  async getData() {
    await this.currentUser.getCurrentUserDetails().then(data => {
      console.log(data);
      this.customerInfo = data;
    });
    this.appointmentsIds = this.customerInfo.appointmentsReference;
    console.log(this.appointments);
    for (let i = 0; i < this.appointmentsIds.length; i++) {
      const docRef = doc(this.firestore, "appointments", this.appointmentsIds[i]);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.appointments.push(docSnap.data());
      }
    }

    this.sortAppointments();
  }

  async sortAppointments() {

    await this.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
  }
  async doRefresh(event) {
    this.appointments = [];
    await this.getData();
    event.target.complete();
  }
}
