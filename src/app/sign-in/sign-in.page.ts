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
  loading = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
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


  /**
   * A function to submit login credentials to firebase authentication
   */
  async submit() {
    this.showLoading("Signing In...")

    const user = await this.authService.signIn(this.signInForm.value);

    await this.loading.dismiss();

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
      this.toast('Successfully Signed in', 'success');
    }
  }

  /**
   * A function to reset password using firebase authentication
   */
  async forgotPassword() {
    this.showLoading("Reseting password...")

    const auth = getAuth();

    sendPasswordResetEmail(auth, this.signInForm.value.email)
      .then(async () => {
        this.toast('Reset email sent to ' + this.signInForm.value.email, 'success');
        await this.loading.dismiss();
      })
      .catch(async (error) => {
        this.toast(error.message, 'danger');
        await this.loading.dismiss();
      });    
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

  /**
   * A function that shows a loading screen
   * @param message message to display
   */
   async showLoading(message) {
    this.loading = await this.loadingCtrl.create({
      message: message,
    })
    this.loading.present();
  }
  
  ngOnInit() {
  }
}
