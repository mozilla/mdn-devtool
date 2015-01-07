/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

const { Cc, Ci } = require('chrome');

const gAccRetrieval = Cc["@mozilla.org/accessibleRetrieval;1"].
        getService(Ci.nsIAccessibleRetrieval);

function focus(thing) {
  gAccRetrieval.getAccessibleFor(thing).takeFocus();
}
exports.focus = focus;
