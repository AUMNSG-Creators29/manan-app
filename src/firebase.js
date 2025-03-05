import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBcGe9-fvjFDlz8BO9wQfk7KsxoTqMOu2Q",
  authDomain: "manan-9fea8.firebaseapp.com",
  projectId: "manan-9fea8",
  storageBucket: "manan-9fea8.firebasestorage.app",
  messagingSenderId: "538027010059",
  appId: "1:538027010059:web:649d93256ca87d57403f0e"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
