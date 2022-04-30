import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }



  async userRegistration(value) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        value.email,
        value.password
      );

      await setDoc(doc(this.firestore, 'user', user.user.uid), {
        userId: user.user.uid,
        userName: value.name,
        userEmail: value.email,
        userPhone: value.phone,
        userAddress: value.address,
        //userPassword: value.password,
        createdAt: Date.now()
      });
      return user;
    } catch (error) {
      return error.code;
    }
  }

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
        //technicianPassword: value.password,
        createdAt: Date.now()
      });
      return user;
    } catch (error) {
      return error.code;
    }
  }

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
