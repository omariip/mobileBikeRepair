import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { IonModal, AlertController, ToastController } from '@ionic/angular';
import { arrayRemove, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { arrayUnion, FieldValue } from 'firebase/firestore';
@Component({
  selector: 'app-profile-page-technician',
  templateUrl: './profile-page-technician.page.html',
  styleUrls: ['./profile-page-technician.page.scss'],
})
export class ProfilePageTechnicianPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
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
    private toastController: ToastController
  ) {

  }

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

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.title = "";
    this.description = "";
    this.price = "";
  }

  async confirm() {

    this.modal.dismiss('confirm');
    await this.addService();
    this.title = "";
    this.description = "";
    this.price = "";
    this.ngOnInit();
  }

  async delete(i){
    const tech = doc(this.firestore, "technician", this.technicianInfo.technicianId);
    await updateDoc(tech, {
      service: arrayRemove(this.technicianInfo.service[i])
    })
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
}
