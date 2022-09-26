import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { IonModal, AlertController, ToastController, IonInput, LoadingController } from '@ionic/angular';
import { arrayRemove, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { arrayUnion, FieldValue } from 'firebase/firestore';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { findAddressNumber, findStreet, findCity, findState, findZipCode } from 'src/utils/address-utils';
declare var google;

@Component({
  selector: 'app-profile-page-technician',
  templateUrl: './profile-page-technician.page.html',
  styleUrls: ['./profile-page-technician.page.scss'],
})
export class ProfilePageTechnicianPage implements OnInit {

  @ViewChild('modal') modal: IonModal;
  @ViewChild('modal2') modal2: IonModal;
  @ViewChild('autocomplete', { static: false }) autocomplete: IonInput;

  technicianInfo = null;
  title = "";
  description = "";
  price = "";
  service = null;
  newPhoneNumber = "";
  loading = null;

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
    private alertController: AlertController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
  }

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

      this.technicianInfo = data;
      console.log(data)
    })
  }

  /**
   * A function to edit the phone number of the
   * current customer in firestore
   */
  async editPhoneNumber() {
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    this.showLoading("Editing phone number...");
    await updateDoc(tech, {
      technicianPhone: this.newPhoneNumber
    }).then(() => {
      this.presentToast("Successfully edited phone number", "success");
    }).catch(() => {
      this.presentToast("Something went wrong!", "danger")
    })
    this.loading.dismiss();
    this.ngOnInit();
  }

  /**
   * A function that closes the service modal
   */
  cancelService() {
    this.modal.dismiss(null, 'cancel');
    this.title = "";
    this.description = "";
    this.price = "";
  }

  /**
   * A function that closes the address modal
   */
  cancelAddress() {
    this.modal2.dismiss(null, 'cancel');
    this.registrationForm.reset();
  }

  /**
   * A function that calls addService() when
   * add service is pressed
   */
  async confirmService() {

    this.modal2.dismiss('confirm');
    await this.addService();
    this.ngOnInit();
  }

  /**
   * A function that calls editAddress() when confirm
   * edit address is pressed
   */
  async confirmAddress() {

    this.modal2.dismiss('confirm');
    await this.editAddress();
    this.ngOnInit();
  }

  /**
   * A function that adds a service to the current
   * technician's firestore document
   */
  async addService() {
    this.service = {
      title: this.title,
      description: this.description,
      price: this.price
    }
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    this.showLoading("Adding service...");
    await updateDoc(tech, {
      service: arrayUnion(this.service)
    }).then(() => {
      this.presentToast("Successfully added a new service to your profile!", "success");
      this.title = "";
      this.description = "";
      this.price = "";
    }).catch(() => {
      this.presentToast("Something went wrong!", "danger")
    })
    this.loading.dismiss()
  }

  /**
   * A function that edits the address details of 
   * the current technician in firestore
   */
  async editAddress() {
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    this.showLoading("Editing your location...");
    await updateDoc(tech, {
      technicianAddress: this.registrationForm.get('address').value
    }).then(() => {
      this.presentToast("Successfully edited your location!", "success");
      this.registrationForm.reset();
    }).catch(() => {
      this.presentToast("Something went wrong!", "danger")
    })
    this.loading.dismiss()
  }

  /**
   * A function that deletes a service from the 
   * technician's firestore document
   * @param i index of service
   */
  async delete(i) {
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    await updateDoc(tech, {
      service: arrayRemove(this.technicianInfo.service[i])
    }).then(() => {
      this.presentToast("Successfully deleted this service!", "success");
    }).catch(() => {
      this.presentToast("Something went wrong!", "danger")
    })
    this.ngOnInit();
  }

  /**
   * A function that is called when the user selects google autocomplete's
   * address, it will set all the address fields in the form
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
   * A function that fires when edit address is clicked,
   * it listens to changes on streed field in order for
   * google autocomplete address is to work
   */
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

  /**
   * A function that shows a loading screen
   * @param message message to display
   */
  async showLoading(message) {
    this.loading = await this.loadingCtrl.create({
      message: message
    })
    this.loading.present();
  }

  /**
   * A function that fires an alert controller with phone field
   */
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

  /**
    * A method to present toasts
    * @param message the message to be displayed
    * @param status  the ionic color to be set on the toast
    */
  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: color
    })
    await toast.present();
  }
}
