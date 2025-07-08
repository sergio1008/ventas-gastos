import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, connectAuthEmulator } from '@angular/fire/auth';
import { connectFirestoreEmulator, Firestore } from '@angular/fire/firestore';
import { connectStorageEmulator, Storage } from '@angular/fire/storage';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environment';

import { MessageService } from 'primeng/api';
import { LoadingService } from './services/util/loading.service';
import { connectFunctionsEmulator, Functions } from '@angular/fire/functions';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, CommonModule, ProgressBarModule, ToastModule, AngularFireFunctionsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
  providers:[MessageService, LoadingService]
})
export class AppComponent {

  title = 'GessasPos';

  constructor(private auth: Auth, private router: Router, private firestore: Firestore, private storage: Storage, private f: Functions) {
    if (environment.firebase.useEmulators) {
      connectAuthEmulator(this.auth, 'http://localhost:9099', {disableWarnings: true}); // Conecta el emulador
      connectFirestoreEmulator(this.firestore, 'localhost', 8080); // Conecta el emulador
      connectStorageEmulator(this.storage, 'localhost', 9199);
      connectFunctionsEmulator(this.f,'localhost', 5001 );
    }

    this.auth.onAuthStateChanged((user) => {
      if(user){
        this.router.navigate(['/pos']);
        
      } else {
        this.router.navigate(['/auth/login']);
      }
    })
  }


}
