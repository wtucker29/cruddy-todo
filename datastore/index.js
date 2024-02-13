const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      const filePath = path.join('test', 'testData', id + '.txt');
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // Use new getNextUniqueId function to find our id
  // Create a filepath using path.join() for each unique id. path.join(__dirname, 'data', id + '.txt')? This should output something like /datastore/data/00001.txt for first todo
  // Only add the text to the file since the id is encoded into filename
  // Use fs.writeFile() to do this. fs.writeFile(path, data = text, callback)




  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      const todos = files.map((file) => {
        const id = path.basename(file, '.txt');
        return { id, text: id };
      });
      callback(null, todos);
    }
  });
};

exports.readOne = (id, callback) => {

  var path = exports.dataDir + '/' + id + '.txt';

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: data });
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {

  const filePath = path.join(exports.dataDir, id + '.txt');

  fs.exists(filePath, (exists) => {
    if (!exists) {
      callback(new Error('Todo item with ID of ${id} does not exist'));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {

  const filePath = path.join(exports.dataDir, id + '.txt');

  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
