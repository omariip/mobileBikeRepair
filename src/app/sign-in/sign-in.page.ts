import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
import { collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { getDoc } from 'firebase/firestore';
import { CurrentUserService } from '../services/current-user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  currentUser: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth,
    private currentUserService: CurrentUserService
  ) { }

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async submit() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.signIn(this.signInForm.value);

    await loading.dismiss();

    if (typeof user === 'string') {
      if (user == 'auth/invalid-email') {
        this.toast('Email ' + this.signInForm.value.email
          + ' is invalid', 'danger');
      } else if (user == 'auth/user-disabled') {
        this.toast('The user of email: ' + this.signInForm.value.email
          + ' is disabled', 'danger');
      } else if (user == 'auth/user-not-found') {
        this.toast('The email: ' + this.signInForm.value.email
          + ' has no account', 'danger');
      } else if (user == 'auth/wrong-password') {
        this.toast('Wrong password', 'danger');
      } else {
        this.toast('Unknown error', 'danger');
      }
    } else {
      const docRef = doc(this.firestore, "customer", this.auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

       
      if(docSnap.exists()) {
        this.router.navigateByUrl('/customer', { replaceUrl: true });
      } else {
        const docRef = doc(this.firestore, "technician", this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
          this.router.navigateByUrl('/technician', { replaceUrl: true });
        }
      }
      //await this.currentUserService.getCurrentUserType();
      this.toast('Successfully Signed in', 'success');
      
      // this.currentUserService.getCurrentUserType().then((x) => {
      //     x.subscribe((x2) => {
      //       this.currentUser = x2;
      //       if(this.currentUser === "customer") { 
      //         this.router.navigateByUrl('/customer', { replaceUrl: true });
      //       } else if(this.currentUser === "technician"){
      //         this.router.navigateByUrl('/technician', { replaceUrl: true });
      //       } else {
      //         this.router.navigateByUrl('/sign-in', { replaceUrl: true });
      //       }
      //   })})
      // this.toast('Successfully Signed in', 'success');
    }
  }

  async forgotPassword() {
    const loading = await this.loadingController.create();
    await loading.present();

    const auth = getAuth();

    sendPasswordResetEmail(auth, this.signInForm.value.email)
      .then(() => {
        this.toast('Reset email sent to ' + this.signInForm.value.email, 'success');
      })
      .catch((error) => {
        this.toast(error.message, 'danger');
      });

    await loading.dismiss();
  }

  /**
   * A method to manage toasts
   * @param message the message to be displayed
   * @param status  the ionic color to be set on the toast
   */
  async toast(message, status) {

    const toast = await this.toastController.create({
      message: message,
      color: status,
      duration: 3000
    });

    toast.present();
  }

  ngOnInit() {
  }

}
