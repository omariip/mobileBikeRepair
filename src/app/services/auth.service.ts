import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, public fireStore: AngularFirestore, public firestore: Firestore) { }

//   userRegistration(value){

//         firebase.auth().createUserWithEmailAndPassword(value.email, value.password).then((data) => {
//           this.fireStore.collection('user').doc(data.user.uid).set({
//             'userId': data.user.uid,
//             'userName': value.name,
//             'userEmail': value.email,
//             'userPhone': value.phone,
//             'userAddress': value.address,
//             'userPassword': value.password,
//             'createdAt': Date.now()
//           })
//         }).catch(error => {
//           console.log(error);
//         })
//       } 

    userRegistration(value){
      const userRef = collection(this.firestore, 'user');
      return addDoc(userRef, value);
    }
}
