import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { environment } from 'src/environments/environment'
import { AuthService } from './services/auth.service';

import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';
import { provideStorage, getStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [], 
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => {
      if(Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });
      } else {
        return getAuth()
      }
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: 
  [
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
