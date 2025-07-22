import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()), provideFirebaseApp(() => initializeApp({"projectId": "joinown-7ffa3","appId":"1:188500596893:web:68821393cb9373b4aa9c74","storageBucket":"joinown-7ffa3.firebasestorage.app","apiKey":"AIzaSyAeRhSKm4aCoZ2qlT4uYMl6tTffA1lFgjE","authDomain":"joinown-7ffa3.firebaseapp.com","messagingSenderId":"188500596893"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideAnimationsAsync()]
};
