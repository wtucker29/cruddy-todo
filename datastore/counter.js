const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, count) => {
    if (err) {
      callback(err, null);
    } else {
      const nextCounter = count + 1;
      writeCounter(nextCounter, (err, counterString) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, zeroPaddedNumber(nextCounter));
        }
      });
    }
  });
  // Use readCounter and writeCounter to create new function
  // Accept callback as input (test.js has a callback as input (err, id) => {})
  // Use readCounter first, then writeCounter
  // Create new counter variable by incrementing counter by 1
  // New counter variable is the first input of writeCounter, callback is (err, counterString)
  // Use zeroPaddedNumber on the second callback input within writeCounter
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
