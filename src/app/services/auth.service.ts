import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private toastController: ToastController, private firestore: Firestore) { }

  async toast(message, status) {

    const toast = await this.toastController.create({
      message: message,
      color: status,
      duration: 3000
    });

    toast.present();
  }

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
        userPassword: value.password,
        createdAt: Date.now()
      }).then(() => {
        this.toast('Successfully Signed Up', 'success');
      });
    } catch (error) {
      this.toast('User Already Exists', 'danger');
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
        technicianPassword: value.password,
        createdAt: Date.now()
      }).then(() => {
        this.toast('Successfully Signed Up', 'success');
      });
    } catch (error) {
      this.toast('User Already Exists', 'danger');
    }
  }
}
