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

    for await (var tech of this.technicians) {
      await this.distanceService.getDistanceinKM(this.currentUserDetails.userAddress.street, tech.technicianAddress.street).then(m => {
        tech.distance = m
      })
    }

    await this.technicians.sort((a, b ) => a.distance > b.distance ? 1 : -1);
    console.log(this.technicians);
    console.log((this.technicians[0].distance / 1000).toFixed(1));
    // console.log(this.currentUserDetails);
    // this.distanceService.getDistanceinKM(this.currentUserDetails.userAddress.street, "4180 duke of york blvd").then(m => {
    //   this.distance = m;
    //   console.log(this.distance);

    // })
  }
}
