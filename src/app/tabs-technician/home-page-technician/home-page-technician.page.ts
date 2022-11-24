import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AlertController, IonInput, LoadingController, ToastController } from '@ionic/angular';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { GoogleDistanceService } from 'src/app/services/google-distance.service';
import 'src/assets/smtp.js';

@Component({
  selector: 'app-home-page-technician',
  templateUrl: './home-page-technician.page.html',
  styleUrls: ['./home-page-technician.page.scss'],
})
export class HomePageTechnicianPage implements OnInit {

  technicianInfo = null;
  selectCurrent = "date";
  orderCurrent = "descending"
  orderDisabled = false;

  constructor(
    private currentUser: CurrentUserService,
    private loadingCtrl: LoadingController,
    private firestore: Firestore,
    private distanceService: GoogleDistanceService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.getData();
  }

  async getData() {
    await this.showLoading("Loading appointments...");
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

      await this.sortAppointments();
      await this.loadingCtrl.dismiss().catch(() => { })
    }
  }

  async sortChanged(e) {
    await this.sortAppointments();
  }

  // async sortOrderChanged(type) {
  //     this.technicianInfo.appointments.reverse();
  // }

  async sortAppointments() {
    if (this.selectCurrent === "date") {
      this.orderDisabled = false;
      if (this.orderCurrent === "descending") {
        await this.technicianInfo.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? -1 : 1);
      } else {
        await this.technicianInfo.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
      }
    } else if (this.selectCurrent === "distance") {
      this.orderDisabled = false;
      if (this.orderCurrent === "descending") {
        await this.technicianInfo.appointments.sort((a, b) => a.distance > b.distance ? -1 : 1);
      } else {
        await this.technicianInfo.appointments.sort((a, b) => a.distance > b.distance ? 1 : -1);
      }
    } else if (this.selectCurrent === "pending") {
      this.orderDisabled = true;
      await this.technicianInfo.appointments.sort((a) => a.appointmentStatus === "pending" ? -1 : 1);
    }
  }

  async setStatus(status, i) {
    try {
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

      await Email.send({
        Host: "smtp.elasticemail.com",
        Username: "mobichanicapp@gmail.com",
        Password: "BA394CAFAD08FDB94BC7C701B8C0ABB8C8C7",
        To: 'aboushaar.omar@gmail.com',
        From: 'mobichanicapp@gmail.com',
        Subject: `${this.technicianInfo.technicianName} has ${status} your Appointment!`,
        Body: `<h1>Hello ${this.technicianInfo.appointments[i].customer.userName}!</h1><p>${this.technicianInfo.technicianName} has ${status} the appointment booked on ${new Date(this.technicianInfo.appointments[i].appointmentDate).toLocaleDateString()}. Open Mobichanic app to check it.<br><br>Respectfully,<br>Mobichanic Team</p>`
      }).catch(e => {
        console.log(e);
      })

    } catch (e) {
      this.presentToast("Something went wrong, please try again", "danger", 3000);

    }
  }

  async alertStatus(header, status, i) {
    const alert = await this.alertController.create({
      header: header,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.setStatus(status, i);
          },
        },
      ],
    });

    await alert.present();
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
    await this.loadingCtrl.create({
      message: message,
    }).then((r) => {
      r.present();
    })
  }

  /**
    * A method to present toasts
    * @param message the message to be displayed
    * @param status  the ionic color to be set on the toast
    */
   async presentToast(message, color, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color
    })
    await toast.present();
  }
}
