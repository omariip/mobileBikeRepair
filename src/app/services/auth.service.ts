import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, public fireStore: AngularFirestore) { }

  userRegistration(value){

        firebase.auth().createUserWithEmailAndPassword(value.email, value.password).then((data) => {
          this.fireStore.collection('user').doc(data.user.uid).set({
            'userId': data.user.uid,
            'userName': value.name,
            'userEmail': value.email,
            'userPhone': value.phone,
            'userAddress': value.address,
            'userPassword': value.password,
            'createdAt': Date.now()
          })
          .catch(error => {
            console.log(error);
          })
        })
      }       
}
