import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { GoogleDistanceService } from 'src/app/services/google-distance.service';
import { LoadingController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.page.html',
  styleUrls: ['./home-page-customer.page.scss'],
})
export class HomePagePage implements OnInit {

  distance;
  currentUserDetails;
  technicians = [];
  techniciansFiltered = []; 
  showPicker = false;
  currentDate = (new Date()).toISOString();
  dateValue= (new Date()).toISOString();

  constructor(
    private auth: Auth,
    private router: Router,
    private service: CurrentUserService,
    private firestore: Firestore,
    private distanceService: GoogleDistanceService,
    private loadingController: LoadingController
  ) { 
    console.log(this.currentDate);
    console.log(this.dateValue);
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
      if ((this.techniciansFiltered[i].distance)/1000 > km) {
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

  confirmBooking(){
    console.log(this.dateValue)
  }
}
