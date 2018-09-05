import React from 'react';
import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyAedVsyWstWx6uw80a6DC5c6GAnfvn4Jl8",
    authDomain: "beer-bible-553e1.firebaseapp.com",
    databaseURL: "https://beer-bible-553e1.firebaseio.com",
    projectId: "beer-bible-553e1",
    storageBucket: "beer-bible-553e1.appspot.com",
    messagingSenderId: "64304502973"
};
firebase.initializeApp(config);

export default firebase;