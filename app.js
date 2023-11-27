console.log('app.js loaded');
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

// Authentication functions
function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log('Signed in successfully!');
                // Call function to load appointments after signing in
                window.location.href = 'home.html';
            })
            .catch((error) => {
                console.error('Error signing in:', error.message);
            });
    } else {
        // If email and password are not provided, sign in anonymously
        signInAnonymously(auth)
            .then(() => {
                console.log('Signed in anonymously!');
                // Call function to load appointments after signing in
                window.location.href = 'home.html';
            })
            .catch((error) => {
                console.error('Error signing in anonymously:', error.message);
            });
    }
}

   
   function handleSignOut() {
    signOut(auth)
    .then(() => {
    console.log('Signed out successfully!');
    })
    .catch((error) => {
    console.error('Error signing out:', error.message);
    });
   }
   
   // Firestore functions
   function addAppointment(appointment) {
    addDoc(collection(db, 'appointments'), appointment)
    .then(() => {
    console.log('Appointment added successfully!');
    // Call function to load appointments after adding a new appointment
    loadAppointments();
    })
    .catch((error) => {
    console.error('Error adding appointment:', error.message);
    });
}

async function loadAppointments() {
 const appointmentsCollection = collection(db, 'appointments');
 const appointmentsSnapshot = await getDocs(appointmentsCollection);

const appointmentsList = [];
 appointmentsSnapshot.forEach((doc) => {
 appointmentsList.push(doc.data());
 });

// Render appointments on the page
 renderAppointments(appointmentsList);
}

function renderAppointments(appointments) {
 const appointmentContainer = document.getElementById('appointment-container');
 appointmentContainer.innerHTML = '';

appointments.forEach((appointment) => {
 const appointmentDiv = document.createElement('div');
 appointmentDiv.innerHTML = `<p><strong>${appointment.title}</strong> - ${appointment.date}</p>`;
 appointmentContainer.appendChild(appointmentDiv);
 });
}

// Check if the user is signed in
onAuthStateChanged(auth, (user) => {
 if (user) {
 // User is signed in
 console.log('User is signed in:', user.email);
 // Call function to load appointments when the page loads
 loadAppointments();
 } else {
 // No user is signed in
 console.log('No user is signed in.');
 }
});

// Event listeners for buttons
document.getElementById('signInBtn').addEventListener('click', signIn);
document.getElementById('signOutBtn').addEventListener('click', handleSignOut);