import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { IonModal, AlertController, ToastController, IonInput } from '@ionic/angular';
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

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
    private alertController: AlertController,
    private toastController: ToastController,
    private formBuilder: FormBuilder
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
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    await updateDoc(tech, {
      technicianPhone: this.newPhoneNumber
    })
    this.ngOnInit();
    this.presentToast("Successfully edited phone number", "success");
  }

  cancelService() {
    this.modal.dismiss(null, 'cancel');
    this.title = "";
    this.description = "";
    this.price = "";
  }

  cancelAddress() {
    this.modal2.dismiss(null, 'cancel');
    this.registrationForm.get('address.street').setValue("");
    this.registrationForm.get('address.city').setValue("");
    this.registrationForm.get('address.province').setValue("");
    this.registrationForm.get('address.postal').setValue("");
  }

  async confirmService() {

    this.modal2.dismiss('confirm');
    await this.addService();
    this.registrationForm.get('address.street').setValue("");
    this.registrationForm.get('address.city').setValue("");
    this.registrationForm.get('address.province').setValue("");
    this.registrationForm.get('address.postal').setValue("");
    this.ngOnInit();
  }

  async confirmAddress() {

    this.modal2.dismiss('confirm');
    await this.editAddress();
    this.ngOnInit();
  }

  async addService() {
    this.service = {
      title: this.title,
      description: this.description,
      price: this.price
    }
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    await updateDoc(tech, {
      service: arrayUnion(this.service)
    });
  }

  async editAddress(){
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    await updateDoc(tech, {
      technicianAddress: this.registrationForm.get('address').value
    })
  }

  async delete(i) {
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    await updateDoc(tech, {
      service: arrayRemove(this.technicianInfo.service[i])
    })
    this.ngOnInit();
  }

  

  setAddress(place) {
    const addressForm = this.registrationForm.get('address');

    addressForm.get('street').setValue(findAddressNumber(place.address_components) + " " + findStreet(place.address_components));
    addressForm.get('city').setValue(findCity(place.address_components));
    addressForm.get('province').setValue(findState(place.address_components));
    addressForm.get('postal').setValue(findZipCode(place.address_components));
  }

  editAddressClicked(){
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
}
