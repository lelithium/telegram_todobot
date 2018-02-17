const Datastore = require('nedb');
const path = require('path');

// Import Datastore
const db = new Datastore({
  filename: path.resolve(__dirname, './todo.db'),
  autoload: true,
});
db.loadDatabase((err) => {
  if (err) {
    throw err;
  }
});

// Adds an item to the NeDB
const newItem = item =>
  new Promise((resolve, reject) =>
    db.insert(item, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    }));

// Gets the items from the NeDB
const getItems = new Promise((resolve, reject) => {
  db.find({}, (err, items) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(items);
  });
});

module.exports = { newItem, getItems };
