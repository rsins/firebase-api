var logoutLink = document.getElementById("logout-link");

logoutLink.addEventListener("click", function(event) {
  if ((typeof(firebase.auth().currentUser) == "undefined" || firebase.auth().currentUser == null) 
       && confirm("Do you really want to logout?")) return;
    event.preventDefault();
});

let user;

firebase.auth().onAuthStateChanged(custInit);

function custInit(newUser) {
  if (checkValidUser() == false) return;
  getCustData(newUser)
}

document.getElementById('saveProfile').addEventListener('click', saveCustData);

//This function checks whether the user has the custom claims - authorized attribute
// This claim will be set by the Cloud Function in authn db only for whitelisted users
// For any other user who just logs in the Cloud Function will delete his account and also 
// his token will not have the claim - authorized
// THis function will log him out.

function checkValidUser() {
  if (typeof(firebase.auth().currentUser) == "undefined" || firebase.auth().currentUser == null) {
    logoutLink.click();
    return false;
  }

  firebase.auth().currentUser.getIdTokenResult()
  .then(function(idTokenResult) {
    const authorized = idTokenResult.claims.authorized

    console.log('Authorized = ' + authorized);
    if (authorized) {
      return authorized;
    }
    else {
      logoutLink.click();    
      return false;
    }
  })
  .catch(function(error) {
    console.error("Error in getIdTokenResult");
    logoutLink.click();    
    return false;
  });
}

function getCustData(newUser) {
  user = newUser

  if (user) {
    const db = firebase.firestore();
    db.collection("customers").doc(user.email).onSnapshot(function(doc) {
      const cust = doc.data();
      if (cust) {
        document.getElementById('customerName').setAttribute('value', cust.name);
        document.getElementById('customerPhone').setAttribute('value', cust.phone);
      }
      document.getElementById('customerEmail').innerText = user.email;
    });
  }
}

function saveCustData(ev) {
  const db = firebase.firestore();
  var docRef = db.collection('customers').doc(user.email);
  docRef.set({
    name: document.getElementById('customerName').value,
    email: user.email,
    phone: document.getElementById('customerPhone').value,
  })
}