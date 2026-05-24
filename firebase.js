// NEU Library – Firebase Config (Compat SDK)

const firebaseConfig = {
    apiKey:            "AIzaSyDmlUa8g4TnUF6lfn79D0R_g9CFwQ18gxw",
    authDomain:        "eulibarysys.firebaseapp.com",
    projectId:         "neulibarysys",
    storageBucket:     "neulibarysys.firebasestorage.app",
    messagingSenderId: "210328166811",
    appId:             "1:210328166811:web:0839f154711ed4193a013e"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

window.auth = firebase.auth();
window.db = firebase.firestore();
window.googleProvider = new firebase.auth.GoogleAuthProvider();

window.googleProvider.setCustomParameters({
    prompt: 'select_account',
    hd: 'neu.edu.ph'
});