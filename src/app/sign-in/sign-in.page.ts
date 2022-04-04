import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
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
      this.router.navigateByUrl('/home-page', { replaceUrl: true });
      this.toast('Successfully Signed in', 'success');
    }
    
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
