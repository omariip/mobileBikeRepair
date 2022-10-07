import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IonInput, LoadingController, ToastController } from '@ionic/angular';
import { findAddressComponent, findAddressNumber, findCity, findState, findStateShortName, findStreet, findZipCode } from 'src/utils/address-utils';
import { Router } from '@angular/router';
declare var google;

@Component({
  selector: 'app-sign-up-technician',
  templateUrl: './sign-up-technician.page.html',
  styleUrls: ['./sign-up-technician.page.scss'],
})
export class SignUpTechnicianPage implements OnInit {

  @ViewChild('autocomplete') autocomplete: IonInput;
  fieldHasError = 0;
  loading = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) { }

  /**
   * Building the form and setting the field with validators
   */
  registrationForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    address: this.formBuilder.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required]],
      postal: ['', [Validators.required, Validators.pattern(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i)]]
    }),
    insurance: this.formBuilder.group({
      insuranceCompany: ['', [Validators.required, Validators.maxLength(100)]],
      insuranceNumber: ['', [Validators.required, Validators.maxLength(100)]]
    }),
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, { validators: this.passwordMatchingValidatior() });

  /**
   * A function that is called when the user selects google autocomplete
   * it will set all the address fields in the form
   * @param place 
   */
  setAddress(place) {
    const addressForm = this.registrationForm.get('address');

    addressForm.get('street').setValue(findAddressNumber(place.address_components) + " " + findStreet(place.address_components));
    addressForm.get('city').setValue(findCity(place.address_components));
    addressForm.get('province').setValue(findState(place.address_components));
    addressForm.get('postal').setValue(findZipCode(place.address_components));
  }

  /**
    * A function that will return created form
    * @returns the form created
    */
  getForm(): FormGroup {
    return this.registrationForm;
  }

  /**
   * A function that will implement google's autocomplete on the street field
   * in the form
   */
  ionViewDidEnter() {
    var options = {
      componentRestrictions: { country: "ca" }
    };
    this.autocomplete.getInputElement().then((ref: any) => {
      const autocomplete = new google.maps.places.Autocomplete(ref, options);

      autocomplete.addListener('place_changed', () => {
        this.setAddress(autocomplete.getPlace());
      })
    })
  }

  /**
   * This function checks under which accordion is the field error
   * @param index the index of the accordion
   * @returns boolean if the accordion has and error in it's fields or not
   */
  checkAccordionError(index) {

    if (index === 0) {
      return (this.registrationForm.get('name').invalid && (this.registrationForm.get('name').touched || this.registrationForm.get('name').dirty)) ||
        (this.registrationForm.get('email').invalid && (this.registrationForm.get('email').touched || this.registrationForm.get('email').dirty)) ||
        (this.registrationForm.get('phone').invalid && (this.registrationForm.get('phone').touched || this.registrationForm.get('phone').dirty))
    } else if (index === 1) {
      return (this.registrationForm.get('address.street').invalid && (this.registrationForm.get('address.street').touched || this.registrationForm.get('address.street').dirty))
        || (this.registrationForm.get('address.city').invalid && (this.registrationForm.get('address.city').touched || this.registrationForm.get('address.city').dirty))
        || (this.registrationForm.get('address.province').invalid && (this.registrationForm.get('address.province').touched || this.registrationForm.get('address.province').dirty))
        || (this.registrationForm.get('address.postal').invalid && (this.registrationForm.get('address.postal').touched || this.registrationForm.get('address.postal').dirty))
    } else if (index === 2) {
      return (this.registrationForm.get('insurance.insuranceCompany').invalid && (this.registrationForm.get('insurance.insuranceCompany').touched || this.registrationForm.get('insurance.insuranceCompany').dirty))
        || (this.registrationForm.get('insurance.insuranceNumber').invalid && (this.registrationForm.get('insurance.insuranceNumber').touched || this.registrationForm.get('insurance.insuranceNumber').dirty))
    } else if (index === 3) {
      return (this.registrationForm.get('password').invalid && (this.registrationForm.get('password').touched || this.registrationForm.get('password').dirty))
        || (this.registrationForm.get('confirmPassword').invalid && (this.registrationForm.get('confirmPassword').touched || this.registrationForm.get('confirmPassword').dirty))
    }
  }

  /**
   * Validates if the password field matches confirm password field
   * @returns form group
   */
  passwordMatchingValidatior() {
    return (formGroup: FormGroup) => {
      const password = formGroup.get('password').value;
      const confirmation = formGroup.get('confirmPassword').value;

      if (password !== confirmation) {
        formGroup.get('confirmPassword').setErrors({ confirmPasswordMatch: true });
      } else {
        formGroup.get('confirmPassword').setErrors(null);
      }
    }
  }

  /**
   * Signs up technician using firestore authentication and redirects
   * to the appropriate page
   */
  async submit() {
    this.showLoading("Signing up...")

    const user = await this.authService.technichianRegistration(this.registrationForm.value);

    this.loading.dismiss();

    if (typeof user === 'string') {
      if (user == 'auth/email-already-in-use') {
        this.toast('Email ' + this.registrationForm.value.email
          + ' already in use', 'danger');
      } else if (user == 'auth/invalid-email') {
        this.toast('Email ' + this.registrationForm.value.email
          + ' is invalid', 'danger');
      } else {
        this.toast('Unknown error', 'danger');
      }
    } else {
      this.router.navigateByUrl('/sign-in', { replaceUrl: true });
      //this.toast('Successfully Signed in', 'success');
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
