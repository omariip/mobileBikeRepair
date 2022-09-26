import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  /**
   * Creates a new customer to firebase auhentication and adds 
   * their details to firestore
   * @param value customer info
   * @returns customer if success, error code if failed
   */
  async userRegistration(value) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        value.email,
        value.password
      );

      await setDoc(doc(this.firestore, 'customer', user.user.uid), {
        userId: user.user.uid,
        userName: value.name,
        userEmail: value.email,
        userPhone: value.phone,
        userAddress: value.address,
        userPassword: value.password, //remove in production
        createdAt: Date.now()
      });
      return user;
    } catch (error) {
      return error.code;
    }
  }

  /**
   * Creates a new customer to firebase authentication and
   * adds their details to firestore
   * @param value 
   * @returns 
   */
  async technichianRegistration(value) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        value.email,
        value.password
      );

      await setDoc(doc(this.firestore, 'technician', user.user.uid), {
        technicianId: user.user.uid,
        technicianName: value.name,
        technicianEmail: value.email,
        technicianPhone: value.phone,
        technicianAddress: value.address,
        technicianInsurance: value.insurance,
        technicianPassword: value.password, //remove in production
        createdAt: Date.now()
      });
      return user;
    } catch (error) {
      return error.code;
    }
  }

  /**
   * Signs the user in to firebase authentication
   * @param value user details
   * @returns user if success, error code if failed
   */
  async signIn(value) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        value.email,
        value.password
      );
      return user;
    } catch (error) {
      return error.code;
    }
  }
}
