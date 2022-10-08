import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { CurrentUserService } from 'src/app/services/current-user.service';
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

  ) { }

  async ngOnInit() {
    await this.getData();
  }

  async getData() {
    this.showLoading("Loading appointments...");
    await this.currentUser.getCurrentUserDetails().then(data => {
      this.technicianInfo = data;
    });

    //this.appointments = this.customerInfo.appointments;
    if (this.technicianInfo.appointments !== null && this.technicianInfo.appointments !== undefined && this.technicianInfo.appointments !== 0) {

      await this.sortAppointments();
    }
    
  }

  async sortAppointments() {
    await this.technicianInfo.appointments.sort((a, b) => a.appointmentDate > b.appointmentDate ? 1 : -1);
    this.loading.dismiss();
  }

  openMap(i) {
    let address = this.technicianInfo.appointments[i].customer.userAddress;
    let oneLineAddress = `${address.street}, ${address.city}, ${address.postal}, ${address.province}`;
    let UrlAddress = new URLSearchParams(address).toString();
    console.log(UrlAddress);
    if(Capacitor.getPlatform() === 'ios') {
      window.location.href = 'maps://maps.apple.com/?q=' + oneLineAddress;
    } else if(Capacitor.getPlatform() === 'android'){
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
