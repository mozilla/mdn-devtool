/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

const tabs = require('sdk/tabs');
const { data } = require('sdk/self');
const { Loader } = require("sdk/test/loader");

const { Redirect } = require('../redirect');

function getData(url) {
  return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(url);
}

exports.testRedirect = function(assert, done) {
  const loader = Loader(module);
  const httpd = loader.require('addon-httpd');
  const { startServerAsync } = httpd;
  let requestCount = 0;
  let serverPort = 8058;

  assert.pass("Starting the server");
  let server = httpd.startServerAsync(serverPort);
  const contents = "testRedirect";

  server.registerPathHandler("/test.txt", (request, response) => {
    requestCount++;
    response.write(contents);
  });

  let details = {
    from: 'http://localhost:' + serverPort + '/test.txt',
    to: getData('exptected')
  };
  tabs.open({
    url: details.from,
    onReady: (tab) => {
      assert.equal(requestCount, 1, "the server did handle the request");

      // now setup the redirect
      let redirect = Redirect(JSON.parse(JSON.stringify(details)));

      tab.close(() => {
        tabs.open({
          url: details.from,
          onReady: (tab) => {
            assert.equal(tab.url, details.to, 'The final destination is correct!');
            assert.equal(requestCount, 1, "the server did not handle the request");
            redirect.destroy();

            tab.close(() => {
              tabs.open({
                url: details.from,
                onReady: (tab) => {
                  assert.equal(requestCount, 2, "the server did handle the request");

                  assert.pass("Stopping the server");
                  server.stop(() => {
                    assert.pass("unload");
                    loader.unload();
                    tab.close(done);
                  });
                }
              });
            });
          }
        });
      })
    }
  });
}

require('sdk/test').run(exports);
