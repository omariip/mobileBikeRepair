import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';

@Component({
  selector: 'app-home-page-customer',
  templateUrl: './home-page-customer.page.html',
  styleUrls: ['./home-page-customer.page.scss'],
})
export class HomePagePage implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router,
    private service: CurrentUserService,
    private firestore: Firestore
    ) { }

  ngOnInit() {
    this.getTechnicians();
  }

  signOut(){
    this.auth.signOut();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  id(){
    console.log(this.auth.currentUser.uid);
    console.log(this.service.getCurrentUserDetails());
  }

  async getTechnicians(){
    
    const q = query(collection(this.firestore, "technician"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    })
  }
}
