import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { arrayRemove, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { IonModal, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile-page-customer',
  templateUrl: './profile-page-customer.page.html',
  styleUrls: ['./profile-page-customer.page.scss'],
})
export class ProfilePageCustomerPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  customerInfo = null;
  newPhoneNumber = "";

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

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

  async presentAddressAlert() {

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
    await updateDoc(customer, {
      userPhone: this.newPhoneNumber
    })
    this.ngOnInit();
    this.presentToast("Successfully edited phone number", "success");
  }

  async editAddress() {

  }
}
