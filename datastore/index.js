const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      // create a createTime and updateTime variable
      const createTime = new Date().toString();
      const updateTime = createTime;
      const todo = { id, text, createTime, updateTime };
      const filePath = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(filePath, JSON.stringify(todo), (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, todo);
        }
      });
    }
  });
};

exports.createAsync = Promise.promisify(create);


readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
      return;
    }

    if (files.length === 0) {
      callback(null, []);
      return;
    }
    const todos = [];
    let fileCount = 0;

    files.forEach((file) => {
      const id = path.basename(file, '.txt');
      const filePath = path.join(exports.dataDir, file);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          callback(err);
          return;
        }
        todos.push({ id, text: data });
        fileCount++;
        if (fileCount === files.length) {
          callback(null, todos);
        }
      });
    });
  });
};

exports.readAllAsync = Promise.promisify(readAll);

readOne = (id, callback) => {

  var path = exports.dataDir + '/' + id + '.txt';

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      let todo = JSON.parse(data);
      callback(null, todo);
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.readOneAsync = Promise.promisify(readOne);

update = (id, text, callback) => {

  const filePath = path.join(exports.dataDir, id + '.txt');

  fs.exists(filePath, (exists) => {
    if (!exists) {
      callback(new Error('Todo item with ID of ${id} does not exist'));
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(err);
        return;
      }

      try {
        let todo = JSON.parse(data);
        todo.text = text;
        todo.updateTime = new Date().toString();
        fs.writeFile(filePath, JSON.stringify(todo), (err) => {
          if (err) {
            callback(err);
          } else {
            callback(null, todo);
          }
        });
      } catch (err) {
        callback(err);
      }
    });
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.updateAsync = Promise.promisify(update);

deleteOne = (id, callback) => {

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

exports.deleteOneAsync = Promise.promisify(deleteOne);

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
