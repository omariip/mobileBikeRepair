import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { doc, Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUser = new BehaviorSubject('');
  private currentUserValue = '';

  constructor(
    private firestore: Firestore,
    private auth: Auth
    ) { }

  async getCurrentUser(){
    return new Promise((resolve, reject) => {

       this.auth.onAuthStateChanged(async (user) => {
        if(user){
        const docRef = await doc(this.firestore, "user", this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
  
        if(docSnap.exists()) {
          this.currentUser.next('customer');
          resolve(this.currentUser.value);
        } else {
          const docRef = doc(this.firestore, "technician", this.auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
    
          if(docSnap.exists()) {
             this.currentUser.next('technician');
             console.log(this.currentUser.value);
             resolve(this.currentUser.value);
          }
        }
      }})
    })
  }
}
