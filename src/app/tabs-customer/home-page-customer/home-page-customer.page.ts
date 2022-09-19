import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { GoogleDistanceService } from 'src/app/services/google-distance.service';

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.page.html',
  styleUrls: ['./home-page-customer.page.scss'],
})
export class HomePagePage implements OnInit {

  distance;
  currentUserDetails;
  technicians = [];
  techniciansSorted = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private service: CurrentUserService,
    private firestore: Firestore,
    private distanceService: GoogleDistanceService
  ) { }

  async ngOnInit() {

    await this.service.getCurrentUserDetails().then(m => {
      this.currentUserDetails = m;
      console.log(this.currentUserDetails.userAddress);
    })
    await this.getTechnicians();
  }

  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  id() {
    console.log(this.auth.currentUser.uid);
    console.log(this.currentUserDetails);
  }

  async getTechnicians() {
    // const techRef = collection(this.firestore, "technician");
    // const q = query(techRef, where("technicianAddress.city", "==", "Toronto"));

    // const querySnapshot = await getDocs(techRef);
    // if(querySnapshot.empty){
    //   console.log("No nearby technicians available")
    // } else {
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.data());
    //   })
    // } 

    // const q = query(collection(this.firestore, "technician"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.data());
    // })

    const techRef = collection(this.firestore, "technician");
    const q = query(techRef, where("technicianAddress.province", "==", this.currentUserDetails.userAddress.province));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No nearby technicians available")
    } else {
      await querySnapshot.forEach((doc) => {
        this.technicians.push(doc.data());
      })
    }

    if (this.technicians.length !== 0) {
      for await (var tech of this.technicians) {
        await this.distanceService.getDistanceinKM(this.getAddressInOneLine(this.currentUserDetails.userAddress), this.getAddressInOneLine(tech.technicianAddress)).then(m => {
          tech.distance = m;
        })
      }
      await this.filterTechniciansBy50KM();

      if (this.technicians.length !== 0) {
        await this.technicians.sort((a, b) => a.distance > b.distance ? 1 : -1);
      }
    }
  }

  async filterTechniciansBy50KM() {
    let i = 0;
    for await (var t of this.technicians) {
      if (t.distance > 50000) {
        console.log("worked")
        this.technicians.splice(i, 1);
      }
      i += 1;
    }
    console.log(this.technicians)
  }

  getAddressInOneLine(t) {
    return `${t.street}, ${t.city}, ${t.province}, ${t.postal}`;
  }
}
