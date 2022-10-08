import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //onlineOffline: boolean = navigator.onLine;

  networkListener: PluginListenerHandle;

  async ngOnInit() {
    if (!(await Network.getStatus()).connected) {
      if (Capacitor.getPlatform() === 'ios'|| !Capacitor.isNativePlatform()) {
        this.presentAlertiOS("No connection", "Please connect to the internet to use this app!");
      } else {
        this.presentAlertAndroid("No connection", "Please connect to the internet to use this app!");
      }
    }

    this.networkListener = Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        if (Capacitor.getPlatform() === 'ios' || !Capacitor.isNativePlatform()) {
          this.presentAlertiOS("Oops", "Seems like you lost connection to the internet");
        } else {
          this.presentAlertAndroid("Oops", "Seems like you lost connection to the internet");
        }
      }
    })
  }
  constructor(
    private alertController: AlertController
  ) { }

  async presentAlertiOS(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  async presentAlertAndroid(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Exit App',
          role: 'exit',
          handler: () => {
            App.exitApp();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
