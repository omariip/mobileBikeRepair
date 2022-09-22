import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { IonModal } from '@ionic/angular';
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

  constructor(
    private currentUser: CurrentUserService,
    private firestore: Firestore

  ) {

  }

  ngOnInit() {
    this.currentUser.getCurrentUserDetails().then(data => {

      this.technicianInfo = data;
      console.log(data)
    })
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
