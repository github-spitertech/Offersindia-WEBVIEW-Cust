importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-messaging.js');

 // Initialize Firebase
 var config = {
    apiKey: 'AIzaSyACvd_rI2KjSu1EIZPmKuJA90w6uixAnnc',
    authDomain: 'offersindia-60178.firebaseapp.com',
    databaseURL: 'https://offersindia-60178.firebaseio.com',
    projectId: 'offersindia-60178',
    storageBucket: 'offersindia-60178.appspot.com',
    messagingSenderId: '82603900808',
    appId: '1:82603900808:web:392d081d63efe205c3843d',
};

firebase.initializeApp(config);

var messaging = firebase.messaging();