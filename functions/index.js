const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();

// TODO: retrieve authorizeEmails from firestore instead
const authorizeEmails = [
  'the.great.dilemma@gmail.com',
  'dummy@dummy.com'
];

exports.authorizeUserByEmail = functions.auth.user().onCreate(async (user) => {

  if (user.email && authorizeEmails.includes(user.email) && user.emailVerified) {
    await admin.auth().setCustomUserClaims(user.uid, {authorized: true, role: 'admin'});
    console.log(`setCustomUserClaims: ${email}`);
    return true;
  }
  else {
    await admin.auth().deleteUser(user.uid);
    console.log(`Delete user: ${user.email}`);
    return false;
  }
});


// // Sends an email confirmation when a user changes his data
// exports.sendEmailConfirmation = functions.firestore.document('customers/{id}').onWrite((change, context) => {

//   // Get an object with the current document value.
//   // If the document does not exist, it has been deleted.
//   const snapshot = change.after.exists ? change.after.data() : null;

//   // Get an object with the previous document value (for update or delete)
//   const oldDocument = change.before.data();

//   const val = snapshot;

//   const mailOptions = {
//     from: '"Spammy Corp." <noreply@firebase.com>',
//     to: val.email,
//   };

//   // Building Email message.
//   mailOptions.subject = 'Your data has changed';
//   mailOptions.text = 'Thank you for updating your profile data.';
  
//   try {
//     mailTransport.sendMail(mailOptions);
//     console.log(`New confirmation email sent to:`, val.email);
//   } catch(error) {
//     console.error('There was an error while sending the email:', error);
//   }
//   return null;
// });