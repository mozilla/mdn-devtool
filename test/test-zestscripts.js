const { Cu } = require('chrome');
const {TextDecoder, OS} = Cu.import('resource://gre/modules/osfile.jsm', {});

let ZestRunner = require('zest-runner');

let opts = {
  sourceType: 'object',
  platform: 'firefox',
  debug: false
};
let zr, script;
let decoder = new TextDecoder();


exports['test fail-high'] = function(assert, done) {
  OS.File.read('./test/Sample-Fail-High.zst')
    .then(function(array) {
      script = JSON.parse(decoder.decode(array));
      opts.zest = script;
      zr = new ZestRunner(opts);
      zr.run()
        .then(function(r) {
          assert.equal(r[0].result, false, 'Is the result false');
          assert.equal(r[0].priority, 'HIGH', 'Is the priority HIGH');
          done();
        });
    });
};

exports['test fail-info'] = function(assert, done) {
  OS.File.read('./test/Sample-Fail-Info.zst')
    .then(function(array) {
      script = JSON.parse(decoder.decode(array));
      opts.zest = script;
      zr = new ZestRunner(opts);
      zr.run()
        .then(function(r) {
          assert.equal(r[0].result, false, 'Is the result false');
          assert.equal(r[0].priority, 'INFO', 'Is the priority INFO');
          done();
        });
    });
};

exports['test fail-low'] = function(assert, done) {
  OS.File.read('./test/Sample-Fail-Low.zst')
    .then(function(array) {
      script = JSON.parse(decoder.decode(array));
      opts.zest = script;
      zr = new ZestRunner(opts);
      zr.run()
        .then(function(r) {
          assert.equal(r[0].result, false, 'Is the result false');
          assert.equal(r[0].priority, 'LOW', 'Is the result LOW');
          done();
        });
    });
};

exports['test fail-medium'] = function(assert, done) {
  OS.File.read('./test/Sample-Fail-Medium.zst')
    .then(function(array) {
      script = JSON.parse(decoder.decode(array));
      opts.zest = script;
      zr = new ZestRunner(opts);
      zr.run()
        .then(function(r) {
          assert.equal(r[0].result, false, 'Is the result false');
          assert.equal(r[0].priority, 'MEDIUM', 'Is the result MEDIUM');
          done();
        });
    });
};

exports['test pass'] = function(assert, done) {
  OS.File.read('./test/Sample-Passes.zst')
    .then(function(array) {
      script = JSON.parse(decoder.decode(array));
      opts.zest = script;
      zr = new ZestRunner(opts);
      zr.run()
        .then(function(r) {
          assert.equal(r[0].print, 'hi', 'Is the print message "hi"');
          done();
        });
    });
};


require('sdk/test').run(exports);
