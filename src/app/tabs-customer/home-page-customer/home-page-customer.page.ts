import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { addDoc, arrayUnion, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { GoogleDistanceService } from 'src/app/services/google-distance.service';
import { IonModal, LoadingController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { v4 as uuidv4 } from 'uuid';
import 'src/assets/smtp.js';

export class Booking {
  bookingService: string = "";
  bookingDescription: string = "";
  bookingImage: string = "";
  bookingDate: string = "";
}

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.page.html',
  styleUrls: ['./home-page-customer.page.scss'],
})
export class HomePagePage implements OnInit {

  //@ViewChild('modal2') bookingModal: IonModal;

  distance;
  currentUserDetails;
  technicians = [];
  techniciansFiltered = [];
  showPicker = false;
  currentDate = (new Date()).toISOString();

  bookingDetails = new Booking();
  image = null;
  displayImage = "";

  imageUrl: any;

  loading = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private service: CurrentUserService,
    private firestore: Firestore,
    private distanceService: GoogleDistanceService,
    private loadingController: LoadingController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
  ) {
  }

  /**
   * Gets current customer details and gets the technicians
   */
  async ngOnInit() {

    await this.service.getCurrentUserDetails().then(m => {
      this.currentUserDetails = m;
    })
    await this.getTechnicians();
  }

  /**
   * Retrieves technicians from firebase from the same province as
   * the current customer's provice
   */
  async getTechnicians() {

    const loading = await this.loadingController.create({
      message: 'Fetching available technicians...',
    });
    await loading.present();

    const techRef = collection(this.firestore, "technician");
    const q = query(techRef, where("technicianAddress.province", "==", this.currentUserDetails.userAddress.province));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await loading.dismiss();
    } else {
      await querySnapshot.forEach((doc) => {
        this.technicians.push(doc.data());
      })
    }

    if (this.technicians.length !== 0) {
      for await (var tech of this.technicians) {
        await this.distanceService.getDistanceinKM(this.getAddressInOneLine(this.currentUserDetails.userAddress), this.getAddressInOneLine(tech.technicianAddress)).then(m => {
          tech.distance = m
        })
      }
      await this.filterandSortTechniciansByKM(50);

      await loading.dismiss();
    }
  }

  /**
   * Filters technicians by distance and sorts them by distance
   * @param km filter distance
   */
  async filterandSortTechniciansByKM(km) {
    this.techniciansFiltered = this.technicians.slice();

    for (var i = 0; i < this.techniciansFiltered.length; i++) {
      if ((this.techniciansFiltered[i].distance) / 1000 > km) {
        this.techniciansFiltered.splice(i, 1);
        i--;
      }
    }
    if (this.techniciansFiltered.length !== 0) {
      await this.techniciansFiltered.sort((a, b) => a.distance > b.distance ? 1 : -1);
    }
  }

  /**
   * Filters technicians by a new filter
   * @param e event
   */
  async filterChanged(e) {
    await this.filterandSortTechniciansByKM(e.detail.value);
  }

  /**
   * Arranges the address as a single line
   * @param t address
   * @returns address in one line
   */
  getAddressInOneLine(t) {
    return `${t.street}, ${t.city}, ${t.province}, ${t.postal}`;
  }

  async uploadImage() {
    this.image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    }).catch((e) => {
      console.log(e);
    })

    if (this.image !== null && this.image !== undefined) {
      this.displayImage = "data:image/jpeg;base64," + this.image.base64String;
    } else {
      this.image = null;
    }
  }

  async confirmBooking(index) {

    await this.showLoading("Sending booking request...");

    const path = `bikeImages/${uuidv4()}`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, this.image.base64String, 'base64').catch((e) => {
      })

      this.imageUrl = await getDownloadURL(storageRef).catch((e) => {
      });

    } catch (e) {
      await this.loading.dismiss();
      this.presentToast("Something went wrong, please try again", "danger");
    }

    const customerRef = doc(this.firestore, "customer", this.currentUserDetails.userId);
    const technicianRef = doc(this.firestore, "technician", this.techniciansFiltered[index].technicianId);

    try {
      await updateDoc(customerRef, {
        appointments: arrayUnion({
          appointmentStatus: "pending",
          appointmentTitle: this.bookingDetails.bookingService,
          appointmentDescription: this.bookingDetails.bookingDescription,
          appointmentDate: this.bookingDetails.bookingDate,
          appointmentImage: this.imageUrl,
          technician: {
            technicianId: this.techniciansFiltered[index].technicianId,
            technicianEmail: this.techniciansFiltered[index].technicianEmail,
            technicianName: this.techniciansFiltered[index].technicianName,
            technicianPhone: this.techniciansFiltered[index].technicianPhone,
            technicianAddress: this.techniciansFiltered[index].technicianAddress
          }
        })
      });
  
      await updateDoc(technicianRef, {
        appointments: arrayUnion({
          appointmentStatus: "pending",
          appointmentTitle: this.bookingDetails.bookingService,
          appointmentDescription: this.bookingDetails.bookingDescription,
          appointmentDate: this.bookingDetails.bookingDate,
          appointmentImage: this.imageUrl,
          customer: {
            userId: this.currentUserDetails.userId,
            userName: this.currentUserDetails.userName,
            userEmail: this.currentUserDetails.userEmail,
            userPhone: this.currentUserDetails.userPhone,
            userAddress: this.currentUserDetails.userAddress
          }
        })
      });

      await Email.send({
        Host: "smtp.elasticemail.com",
        Username: "mobichanicapp@gmail.com",
        Password: "BA394CAFAD08FDB94BC7C701B8C0ABB8C8C7",
        To: 'aboushaar.omar@gmail.com',
        From: 'mobichanicapp@gmail.com',
        Subject: 'New Appointment in Mobichanic!',
        Body: `<h1>Hello ${this.techniciansFiltered[index].technicianName}!</h1><p>You have a new appointment pending, open Mobichanic app to check it.<br><br>Respectfully,<br>Mobichanic Team</p>`
      }).catch(e => {
        console.log(e);
      })

    } catch(e) {
      this.presentToast("Something went wrong, please try again", "danger");
    }
    

    //this.bookingModal.dismiss();
    this.loading.dismiss();
    this.presentToast("Request sent successfully", "success");
    this.bookingDetails = new Booking();
    this.image = "";
    this.displayImage = "";
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

  /**
    * A method to present toasts
    * @param message the message to be displayed
    * @param status  the ionic color to be set on the toast
    */
  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: color
    })
    await toast.present();
  }
}
