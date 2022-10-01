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

  @ViewChild('modal2') bookingModal: IonModal;
  
  distance;
  currentUserDetails;
  technicians = [];
  techniciansFiltered = [];
  showPicker = false;
  currentDate = (new Date()).toISOString();

  bookingDetails = new Booking();
  image;
  displayImage = "";

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
      console.log("No nearby technicians available")
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

    if(this.image){
      this.displayImage = "data:image/jpeg;base64,"+this.image.base64String;
    }
  }

  async confirmBooking(index) {
    await this.showLoading("Sending booking request...");
    const docRef = await addDoc(collection(this.firestore, "appointments"), {
      appointmentStatus: "pending",
      appointmentTitle: this.bookingDetails.bookingService,
      appointmentDescription: this.bookingDetails.bookingDescription,
      appointmentDate: this.bookingDetails.bookingDate,
      customerId: this.currentUserDetails.userId,
      technicianId: this.techniciansFiltered[index].technicianId
    });

    if (this.image) {
      const path = `uploads/${docRef.id}/bikeImage.png`;
      const storageRef = ref(this.storage, path);

      try {
        await uploadString(storageRef, this.image.base64String, 'base64').catch((e) => {
          console.log(e);
        })

        const imageUrl = await getDownloadURL(storageRef).catch((e) => {
          console.log(e);
        });

        await updateDoc(docRef, {
          appointmentImage: imageUrl
        }).catch((e) => {
          console.log(e);
        });

        const customerDocRef = doc(this.firestore, `customer/${this.currentUserDetails.userId}`);
        await updateDoc(customerDocRef, {
          appointmentsReference: arrayUnion(docRef.id)
        }).catch((e) => {
          console.log(e);
        });

        const technicianDocRef = doc(this.firestore, `technician/${this.techniciansFiltered[index].technicianId}`);
        await updateDoc(technicianDocRef, {
          appointmentsReference: arrayUnion(docRef.id)
        });

        this.loading.dismiss();
        this.presentToast("Request sent successfully", "success");
        this.bookingDetails = new Booking();
        this.image = "";
        this.displayImage = "";
        await this.bookingModal.dismiss('book');
      } catch (e) {
        this.loading.dismiss();
        this.presentToast("Something went wrong, please try again", "danger");
      }
    }
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
