// Firebase Initialization - Firestore Only (Storage Disabled)
const firebaseConfig = {
  apiKey: "AIzaSyCs-Sw1hpSReWuAnVhHsKtb1ajZp_OVdJ8",
  authDomain: "new-blog-2b15e.firebaseapp.com",
  projectId: "new-blog-2b15e",
  storageBucket: "new-blog-2b15e.firebasestorage.app",
  messagingSenderId: "694308724175",
  appId: "1:694308724175:web:bd26e81f0472b018e546ba"
};

// Initialize Firebase if not already initialized
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Only Firestore is used - files stored as base64 data URLs in Firestore docs
