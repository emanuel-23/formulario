// ============================================
// FIREBASE.JS: conecta la página con la base de datos
// ============================================

// Datos de conexión de nuestro proyecto (los da Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyA4EgdoXtjnvVpUW-dfuH1aGq7VbnKPyqY",
  authDomain: "precio-principios.firebaseapp.com",
  projectId: "precio-principios",
  storageBucket: "precio-principios.firebasestorage.app",
  messagingSenderId: "936446485694",
  appId: "1:936446485694:web:a29cd02a9771095542eaef"
};

// Iniciamos Firebase con esos datos
firebase.initializeApp(firebaseConfig);

// "db" es nuestra base de datos Firestore. La usaremos para guardar.
const db = firebase.firestore();
