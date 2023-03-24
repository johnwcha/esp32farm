// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
/*
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
}); */
const toEmail = 'johnwcha@usc.edu'
const phone = '+16266071959'
const threshold = 75

async function notify(data) {
  console.log('email notification ----------->')
  const sub = 'Warning: temperature fluctuation ' + data.temp.toString()
  const txt = 'Sensor read remperature out of normal range: ' + data.temp.toString()
  const htm = 'Sensor read remperature out of normal range: <span style="color:red;">' + data.temp.toString() + '</span>'
  const obj = {subject: sub, text: txt, html: htm}
  const writeResult = await admin.firestore().collection('warning')
                            .add({to: toEmail, message: obj});
  console.log('SMS notification ----------->')
  const smsResult = await admin.firestore().collection('sms_message')
                            .add({to: phone, body: txt});
}

exports.newSensorData = functions.firestore
  .document('sensor_data/{data}')
  .onCreate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.data()
    if (newValue.temp > threshold) {
      notify(newValue)
    }
})


// export const setProductsToExpired = functions.https.onRequest(async(request, response) => {
//     const expiredProducts = await admin.firestore()
//       .collection('products')
//       .where('timestamp','<=', admin.firestore.Timestamp.now())
//       .get();
// })

