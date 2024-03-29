import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, collection, doc, Firestore, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CurrentUserService } from 'src/app/services/current-user.service';
import 'src/assets/smtp.js';

@Component({
  selector: 'app-appointments-page-customer',
  templateUrl: './appointments-page-customer.page.html',
  styleUrls: ['./appointments-page-customer.page.scss'],
})
export class AppointmentsPageCustomerPage implements OnInit {

  customerInfo = null;
  //appointments = null;
  displayImage = false;
  //loading = null;

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {

    this.getData();
  }

  async getData() {
    await this.showLoading("Loading appointments...");
    await this.currentUser.getCurrentUserDetails().then(data => {
      this.customerInfo = data;
    });

    if (this.customerInfo.appointments !== null && this.customerInfo.appointments !== undefined && this.customerInfo.appointments !== 0) {

      await this.sortAppointments();
    }
    await this.loadingCtrl.dismiss().catch((e) => { console.log(e) })
  }

  async sortAppointments() {

    await this.customerInfo.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? -1 : 1);
  }

  async presentCancel(i) {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to cancel this appointment?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.cancelAppointment(i);
          },
        },
      ],
    });

    await alert.present();
  }
  async cancelAppointment(i) {
    const appTime = new Date(this.customerInfo.appointments[i].appointmentDate);
    const nowTime = new Date();

    const milliseconds = Math.abs(appTime.getTime() - nowTime.getTime());
    const hoursBetweenTimes = milliseconds / (60 * 60 * 1000);

    if (hoursBetweenTimes < 24) {
      this.presentToast("Can't cancel appointments before 24 hrs, please contact the technician to cancel", "danger", 5000)
      console.log(this.customerInfo.appointments[i])
    } else {

      try {
        const technicianRef = doc(this.firestore, "technician", this.customerInfo.appointments[i].technician.technicianId);
        const customerRef = doc(this.firestore, "customer", this.customerInfo.userId);

        let technicianAppointment = JSON.parse(JSON.stringify(this.customerInfo.appointments[i]));

        delete technicianAppointment.technician;
        technicianAppointment.customer = {
          userAddress: this.customerInfo.userAddress,
          userEmail: this.customerInfo.userEmail,
          userId: this.customerInfo.userId,
          userName: this.customerInfo.userName,
          userPhone: this.customerInfo.userPhone
        }

        await updateDoc(technicianRef, {
          appointments: arrayRemove(technicianAppointment)
        });

        await updateDoc(customerRef, {
          appointments: arrayRemove(this.customerInfo.appointments[i])
        });

        this.customerInfo.appointments[i].appointmentStatus = "cancelled";
        technicianAppointment.appointmentStatus = "cancelled";

        await updateDoc(technicianRef, {
          appointments: arrayUnion(technicianAppointment)
        });

        await updateDoc(customerRef, {
          appointments: arrayUnion(this.customerInfo.appointments[i])
        });

        this.presentToast("Appointment cancelled successfully!", "success", 3000);
        
        await Email.send({
          Host: "smtp.elasticemail.com",
          Username: "mobichanicapp@gmail.com",
          Password: "BA394CAFAD08FDB94BC7C701B8C0ABB8C8C7",
          To: 'aboushaar.omar@gmail.com',
          From: 'mobichanicapp@gmail.com',
          Subject: 'Customer Cancelled Appointment in Mobichanic!',
          Body: `<h1>Hello ${this.customerInfo.appointments[i].technician.technicianName}!</h1><p>${this.customerInfo.userName} has cancelled the appointment booked on ${new Date(this.customerInfo.appointments[i].appointmentDate).toLocaleDateString()}. Open Mobichanic app to check it.<br><br>Respectfully,<br>Mobichanic Team</p>`
        }).catch(e => {
          console.log(e);
        })

      } catch (e) {
        this.presentToast("Something went wrong, please try again", "danger", 3000);
      }
    }
  }

  checkAppointmentDone(i) {
    const appTime = new Date(this.customerInfo.appointments[i].appointmentDate).getTime();
    const nowTime = new Date().getTime();

    return appTime < nowTime
  }

  async doRefresh(event) {
    //this.appointments = [];
    await this.getData();
    event.target.complete();
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
