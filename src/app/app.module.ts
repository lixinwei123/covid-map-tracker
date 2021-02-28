import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import {RegisterComponent} from './register/register.component';
import { File } from '@ionic-native/file/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
// import {RegisterModule} from "./register/register.module";
import { FormsModule } from '@angular/forms'; 
@NgModule({
  declarations: [AppComponent, RegisterComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  AngularFirestoreModule,
  FormsModule
  // RegisterModule
],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},File],
  bootstrap: [AppComponent],
})
export class AppModule {}
