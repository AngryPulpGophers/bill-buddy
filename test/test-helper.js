/* jshint undef: false, unused: false */

process.env.NODE_ENV = 'test';

// The following allows you to require files independent of
// the location of your test file.
// Example:
//  var User = require(__server + '/models/user.js')
//
global.__server = __dirname + '/../server';
global.__client = __dirname + '/../client';

//
// Assertions
//
var chai = require('chai');
// Option 1: Make the `expect` function available in every test file
global.expect = chai.expect;
// Option 2: Make everything should-able
// global.should = chai.should()


//
// Helper Functions
//
// This is the object you can attach any helper functions used across
// several test files.
global.TestHelper = {};

var db       = require('../server/db.js');

TestHelper.setup = function(){
  return db.deleteEverything();
};

//
// Mock apps for API testing
//
var express = require('express');

TestHelper.createApp = function (loader) {
  var app = express();
  app.use(require('body-parser').json());

  app.testReady = function () {
    // Log all errors
    app.use(function (err, req, res, next) {
      console.error('==Error==');
      console.error('   ' + err.stack);
      next(err);
    });
  };
  return app;
};

var Bluebird = require('bluebird');

/*
// Monkey-patch mocha's `it` function
// to support `yield` within generator functions
// for pleasant test writing.
//
// Thanks goes to http://stackoverflow.com/a/23029774/49695
//

var originalIt = it;
it = function(title, test) {

  // If the test is a generator function - run it using suspend
  if (test.constructor.name === 'GeneratorFunction') {
    originalIt(title, function() {
      return Bluebird.coroutine(test)();
    });
  }
  // Otherwise use the original implementation
  else {
    originalIt(title, test);
  }
};
*/

global.before_ = function (f) { before ( Bluebird.coroutine(f) ); };
global.beforeEach_ = function (f) { beforeEach ( Bluebird.coroutine(f) ); };
global.it_ = function (description, f) { it ( description, Bluebird.coroutine(f) ); };
global.xit_ = function (description, f) { xit ( description, f ); };
global.it_.only = function (description, f) { it.only( description, Bluebird.coroutine(f) ); };
