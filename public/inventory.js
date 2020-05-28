let user;

firebase.auth().onAuthStateChanged(getCurrentInventory);

function getCurrentInventory(newUser) {
  user = newUser;
  if (user) {
    const db = firebase.firestore();
    const invColl = db.collection('customers').doc(user.email).collection('items');
    invColl.orderBy('name').onSnapshot(function(snapshot) {
      const div = document.getElementById('inventory');
      div.innerHTML = '<table>';

      snapshot.docs.forEach(item => {
        let inv = item.data();
        div.innerHTML += '<tr><td>' + item.id + ' ' + inv.name + ' ' + inv.quantity + '</td></tr>';
        div.innerHTML += '<br/>'
      })
      div.innerHTML += '</table>';

      if (snapshot.docs.length == 0) {
        div.innerHTML = 'No inventory items';
      }
    });
  }
};

document.getElementById('create').addEventListener('click', createInventory);
document.getElementById('update').addEventListener('click', updateInventory);
document.getElementById('delete').addEventListener('click', deleteInventory);

function createInventory(ev) {
  let startDate = new Date();
  const millis = startDate.getTime();

  const db = firebase.firestore();

  let itemKey = document.getElementById('itemId').value

  db.collection('customers').doc(user.email).collection('items').doc(itemKey).set({
    name: document.getElementById('itemName').value,
    quantity: document.getElementById('itemQty').value,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
    console.log("Added "+ itemKey);
  })
  .catch(function(error) {
    console.error("Error adding item: " + itemKey, error);
  });
 
 };

function updateInventory(ev) {
  let startDate = new Date();
  const millis = startDate.getTime();

  const db = firebase.firestore();

  let itemKey = document.getElementById('itemId').value
  db.collection('customers').doc(user.email).collection('items').doc(itemKey).update({
    name: document.getElementById('itemName').value,
    quantity: document.getElementById('itemQty').value,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
    console.log("updated " + itemKey);
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating item: " + itemKey, error);
  });
 
};


function deleteInventory(ev) {
  let startDate = new Date();
  const millis = startDate.getTime();

  const db = firebase.firestore();

  let itemKey = document.getElementById('itemId').value
  db.collection('customers').doc(user.email).collection('items').doc(itemKey).delete()
  .then(function() {
    console.log("deleted " + itemKey);
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error deleting item: " + itemKey, error);
  });
 
};