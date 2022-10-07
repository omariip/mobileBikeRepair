import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { doc, Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUser = new BehaviorSubject<string>('');

  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {
    //this.getCurrentUserType();
  }

  /**
   * This function returns the currently logged in
   * user type, customer or technician
   * @returns promise of customer or technician
   */
  async getCurrentUserType() {
    return new Promise((resolve, reject) => {
      if (!this.auth.currentUser) {
        reject(null);
      } else {

        this.auth.onAuthStateChanged(async (user) => {
          if (user) {
            let docRef = await doc(this.firestore, "customer", this.auth.currentUser.uid);
            let docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              this.currentUser.next('customer');
              console.log(this.currentUser.value);
              resolve(this.currentUser.value);
            } else {
              let docRef = doc(this.firestore, "technician", this.auth.currentUser.uid);
              let docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                this.currentUser.next('technician');
                console.log(this.currentUser.value);
                resolve(this.currentUser.value);
              }
            }
          }
        })
      }
    })

  }

  /**
   * This function returns the currently logged in
   * user details from firestore
   * @returns user details
   */
  async getCurrentUserDetails() {

    if (this.currentUser.value === '' || this.currentUser.value === null) {
      await this.getCurrentUserType();
    }
    console.log(this.currentUser.value);
    console.log(this.auth.currentUser.uid);
    const docRef = await doc(this.firestore, this.currentUser.value, this.auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }
}
