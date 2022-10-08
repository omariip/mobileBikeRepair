import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { GoogleDistanceService } from 'src/app/services/google-distance.service';
@Component({
  selector: 'app-home-page-technician',
  templateUrl: './home-page-technician.page.html',
  styleUrls: ['./home-page-technician.page.scss'],
})
export class HomePageTechnicianPage implements OnInit {

  technicianInfo = null;
  loading = null;

  constructor(
    private currentUser: CurrentUserService,
    private loadingCtrl: LoadingController,
    private firestore: Firestore,
    private distanceService: GoogleDistanceService,
  ) { }

  async ngOnInit() {
    await this.getData();
  }

  async getData() {
    this.showLoading("Loading appointments...");
    await this.currentUser.getCurrentUserDetails().then(data => {
      this.technicianInfo = data;
    });

    let i = 0;

    for await (let a of this.technicianInfo.appointments) {
      await this.distanceService.getDistanceinKM(this.getAddressInOneLine(a.customer.userAddress),
        this.getAddressInOneLine(this.technicianInfo.technicianAddress))
        .then((d) => {
          a.distance = d;
        })
    }
    console.log(this.technicianInfo);
    if (this.technicianInfo.appointments !== null && this.technicianInfo.appointments !== undefined && this.technicianInfo.appointments !== 0) {

      await this.sortAppointments("date");
    }
  }

  async sortChanged(e) {
    await this.sortAppointments(e.detail.value);
  }

  async sortAppointments(type) {
    if (type === "date") {
      await this.technicianInfo.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
      this.loading.dismiss();
    } else if (type === "distance") {
      await this.technicianInfo.appointments.sort((a, b) => a.distance > b.distance ? 1 : -1);
      this.loading.dismiss();
    } else if (type === "pending") {
      await this.technicianInfo.appointments.sort((a) => a.appointmentStatus === "pending" ? -1 : 1);
      this.loading.dismiss();
    }
  }

  async setStatus(status, i) {
    console.log(i);
    const technicianRef = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    const customerRef = doc(this.firestore, "customer", this.technicianInfo.appointments[i].customer.userId);

    let technicianInfoCopy = JSON.parse(JSON.stringify(this.technicianInfo));

    delete technicianInfoCopy.appointments[i].distance;

    let customerAppointment = JSON.parse(JSON.stringify(technicianInfoCopy.appointments[i]));
    console.log(customerAppointment);

    delete customerAppointment.customer;
    customerAppointment.technician = {
      technicianAddress: technicianInfoCopy.technicianAddress,
      technicianEmail: technicianInfoCopy.technicianEmail,
      technicianId: technicianInfoCopy.technicianId,
      technicianName: technicianInfoCopy.technicianName,
      technicianPhone: technicianInfoCopy.technicianPhone
    }

    await updateDoc(technicianRef, {
      appointments: arrayRemove(technicianInfoCopy.appointments[i])
    });

    await updateDoc(customerRef, {
      appointments: arrayRemove(customerAppointment)
    });

    this.technicianInfo.appointments[i].appointmentStatus = status;
    technicianInfoCopy.appointments[i].appointmentStatus = status;
    customerAppointment.appointmentStatus = status;

    await updateDoc(technicianRef, {
      appointments: arrayUnion(technicianInfoCopy.appointments[i])
    })

    await updateDoc(customerRef, {
      appointments: arrayUnion(customerAppointment)
    })
  }

  openMap(i) {
    let address = this.technicianInfo.appointments[i].customer.userAddress;
    let oneLineAddress = `${address.street}, ${address.city}, ${address.postal}, ${address.province}`;
    let UrlAddress = new URLSearchParams(address).toString();
    console.log(UrlAddress);
    if (Capacitor.getPlatform() === 'ios') {
      window.location.href = 'maps://maps.apple.com/?q=' + oneLineAddress;
    } else if (Capacitor.getPlatform() === 'android') {
      window.location.href = 'geo:' + oneLineAddress;
    } else {
      window.open('https://www.google.com/maps/search/' + oneLineAddress, '_blank');
    }
  }
  async doRefresh(event) {
    await this.getData();
    event.target.complete();
  }

  /**
   * Arranges the address as a single line
   * @param t address
   * @returns address in one line
   */
  getAddressInOneLine(t) {
    return `${t.street}, ${t.city}, ${t.province}, ${t.postal}`;
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
