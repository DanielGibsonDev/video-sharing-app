import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Constants from 'expo-constants';

/* For Native use with Phone verification - Currently not in use */
// let app;
// if (backend.apps.length === 0) {
//   console.log('fb log 1 ', backend.apps);
//   app = backend
//     .initializeApp(RNfirebaseConfig)
//     .then(() => console.log('success of init app'))
//     .catch((error) => console.log('init app failed -> ', error));
//   backend.app();
//   console.log(app);
// } else {
//   console.log('fb log 1 ', backend.apps);
//   backend.app();
// }

const FIREBASE_CONFIG_VARIABLES = Constants.expoConfig.extra.firebase;

if (!FIREBASE_CONFIG_VARIABLES) {
  throw new Error('Firebase config variables missing');
}
initializeApp(FIREBASE_CONFIG_VARIABLES);

const functions = getFunctions();
const db = getFirestore();

// auth.languageCode = 'en_gb';
export { db, functions, httpsCallable };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
