import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // constructor(public firestore: Firestore){

  // }

  // userRegistration(value){
  //   const userRef = collection(this.firestore, 'user');
  //   return addDoc(userRef, value);
  // }

  constructor(public auth: AngularFireAuth, public fireStore: AngularFirestore, private toastController: ToastController) { }
  userRegistration(value) {
    firebase.auth().createUserWithEmailAndPassword(value.email, value.password).then((data) => {
      this.fireStore.collection('user').doc(data.user.uid).set({
        'userId': data.user.uid,
        'userName': value.name,
        'userEmail': value.email,
        'userPhone': value.phone,
        'userAddress': value.address,
        'userPassword': value.password,
        'createdAt': Date.now()
      }).then(() => {
        this.toast('Successfully Signed Up', 'success');
      })
    }).catch(error => {
      this.toast('User Already Exists', 'danger');
    })
  }

  async toast(message, status) {

    const toast = await this.toastController.create({
      message: message,
      color: status,
      duration: 3000
    });

    toast.present();
  }

}
