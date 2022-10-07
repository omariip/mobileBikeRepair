import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  onlineOffline: boolean = navigator.onLine;

  constructor(
    private alertController: AlertController
  ) {
    // if (!navigator.onLine){
    //   this.presentAlert();
    // }
  }
  // async presentAlert() {
  //   const alert = await this.alertController.create({
  //     header: 'No Connection',
  //     message: 'Please connect to the internet to use this app!',
  //     buttons: [
  //       {
  //         text: 'Exit',
  //         role: 'exit',
  //         handler: () => {
  //           App.exitApp();
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }
}
