import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { arrayRemove, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { IonModal, AlertController, ToastController, IonInput, LoadingController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { findAddressNumber, findStreet, findCity, findState, findZipCode } from 'src/utils/address-utils';
declare var google;

@Component({
  selector: 'app-profile-page-customer',
  templateUrl: './profile-page-customer.page.html',
  styleUrls: ['./profile-page-customer.page.scss'],
})
export class ProfilePageCustomerPage implements OnInit {

  @ViewChild('modal') modal: IonModal;
  @ViewChild('autocomplete', { static: false }) autocomplete: IonInput;

  customerInfo = null;
  newPhoneNumber = "";
  loading = null;

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
    private alertController: AlertController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) { }

  registrationForm = this.formBuilder.group({
    address: this.formBuilder.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required]],
      postal: ['', [Validators.required, Validators.pattern(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i)]]
    })
  })

  ngOnInit() {
    this.currentUser.getCurrentUserDetails().then(data => {
      console.log(data);
      this.customerInfo = data;
    })
  }

  async presentPhoneAlert() {

    const alert = await this.alertController.create({
      header: 'Edit phone number',
      message: '',
      buttons: [{
        text: "Confirm",
        handler: data => {
          if (data.newNum.match(/^[0-9]+$/) != null) {
            this.newPhoneNumber = data.newNum
            this.editPhoneNumber();
          } else {
            this.presentToast("Please enter a valid number", "danger");
          }
        }
      }],
      inputs: [{
        type: 'text',
        name: 'newNum',
        placeholder: 'new number',
        attributes: {
          maxlength: 10
        }
      }]
    })
    await alert.present();
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: color
    })
    await toast.present();
  }

  async editPhoneNumber() {
    const customer = doc(this.firestore, "customer", this.customerInfo.userId);
    this.showLoading("Editing phone number...");
    await updateDoc(customer, {
      userPhone: this.newPhoneNumber
    }).then(() => {
      this.presentToast("Successfully edited phone number", "success");
    }).catch(() => {
      this.presentToast("Something went wrong!", "danger")
    })
    this.loading.dismiss();
    this.ngOnInit();
  }

  cancelAddress() {
    this.modal.dismiss(null, 'cancel');
    this.registrationForm.reset();
  }

  async confirmAddress() {

    this.modal.dismiss('confirm');
    await this.editAddress();
    this.registrationForm.reset();
    this.ngOnInit();
  }

  async editAddress() {
    const tech = doc(this.firestore, "customer", this.customerInfo.userId);
    this.showLoading("Editing your location...");
    await updateDoc(tech, {
      userAddress: this.registrationForm.get('address').value
    }).then(() => {
      this.presentToast("Successfully edited your location!", "success");
    }).catch(() => {
      this.presentToast("Something went wrong!", "danger")
    })
    this.loading.dismiss();
  }

  setAddress(place) {
    const addressForm = this.registrationForm.get('address');

    addressForm.get('street').setValue(findAddressNumber(place.address_components) + " " + findStreet(place.address_components));
    addressForm.get('city').setValue(findCity(place.address_components));
    addressForm.get('province').setValue(findState(place.address_components));
    addressForm.get('postal').setValue(findZipCode(place.address_components));
  }

  editAddressClicked() {
    setTimeout(() => {
      var options = {
        componentRestrictions: { country: "ca" }
      };
      this.autocomplete.getInputElement().then((ref: any) => {
        const autocomplete = new google.maps.places.Autocomplete(ref, options);

        autocomplete.addListener('place_changed', () => {
          this.setAddress(autocomplete.getPlace());
        })
      })
    }, 500)
  }

  async showLoading(message) {
    this.loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'dots'
    })
    this.loading.present();
  }
}
