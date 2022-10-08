import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, collection, doc, Firestore, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CurrentUserService } from 'src/app/services/current-user.service';

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
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.getData();
    this.loadingCtrl.dismiss().catch(()=>{})
  }

  async getData() {
    this.showLoading("Loading appointments...");
    await this.currentUser.getCurrentUserDetails().then(data => {
      this.customerInfo = data;
    });

    //this.appointments = this.customerInfo.appointments;
    if (this.customerInfo.appointments !== null && this.customerInfo.appointments !== undefined && this.customerInfo.appointments !== 0) {

      this.sortAppointments();
    }
    this.loadingCtrl.dismiss().catch(()=>{})
  }

  async sortAppointments() {
    this.loadingCtrl.dismiss().catch(()=>{})
    await this.customerInfo.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
    this.loadingCtrl.dismiss().catch(()=>{})
  }

  async cancelAppointment(i) {
    const appTime = new Date(this.customerInfo.appointments[i].appointmentDate);
    const nowTime = new Date();

    const milliseconds = Math.abs(appTime.getTime() - nowTime.getTime());
    const hoursBetweenTimes = milliseconds / (60 * 60 * 1000);

    if(hoursBetweenTimes < 24) {
      this.presentToast("Can't cancel appointments before 24 hrs, please contact the technician to cancel", "danger", 5000)
      console.log(this.customerInfo.appointments[i])
    } else {
      const technicianRef = doc(this.firestore, "technician", this.customerInfo.appointments[i].technician.technicianId);
      const customerRef = doc(this.firestore, "customer", this.customerInfo.userId);

      let technicianAppointment = JSON.parse(JSON.stringify(this.customerInfo.appointments[i])); 
      console.log(technicianAppointment);

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
      })

      await updateDoc(customerRef, {
        appointments: arrayUnion(this.customerInfo.appointments[i])
      })
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
