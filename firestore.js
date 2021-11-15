const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'tokenflow-io-test',
  keyFilename: './keys/firestore-key-test.json',
});

module.exports = db