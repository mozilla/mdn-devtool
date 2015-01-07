/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

const { Cc, Ci, Cu } = require("chrome");
const { Class } = require('../core/heritage');
const { AddonManager, AddonAuthor } = require("../utils/addonmanager");
const DO_NOTHING = () => {};

// https://developer.mozilla.org/en/Addons/Add-on_Manager/Addon
const Addon = Class({
  initialize: function(options) {
    this.appDisabled = !!options.appDisabled || false;
    if (options.creator) {
      this.creator = new AddonAuthor(options.creator.name);
    }
    this.id = options.id;

    if (typeof options.isActive != "undefined")
      this.isActive = !!options.isActive;
    if (typeof options.isCompatible != "undefined")
      this.isCompatible = !!options.isCompatible;
    if (typeof options.isPlatformCompatible != "undefined")
      this.isPlatformCompatible = !!options.isPlatformCompatible;

    if (options.addonType) {
      this.addonType = options.addonType;
      this.type = options.addonType;
    }
    if (options.type) {
      this.type = options.type;
    }
    this.name = options.name || "";
    //this.pendingOperations =
    this.description = options.description || "";

    if (options.iconURL) {
      this.iconURL = options.iconURL;
    }

    return this;
  },
  // req'd
  appDisabled: false,
  blocklistState: Ci.nsIBlocklistService.STATE_NOT_BLOCKED,
  creator: null,
  id: null,
  isActive: true,
  permissions: AddonManager.PERM_CAN_UNINSTALL | AddonManager.PERM_CAN_ENABLE,
  isCompatible: true,
  isPlatformCompatible: true,
  name: null,
  pendingOperations: AddonManager.PENDING_NONE,
  providesUpdatesSecurely: false,
  scope: AddonManager.SCOPE_PROFILE,
  type: null,
  userDisabled: false,
  version: null,

  //not reqd
  applyBackgroundUpdates: AddonManager.AUTOUPDATE_DISABLE,
  contributors: [],
  description: "",
  translators: [],
  sourceURI: null,

  get permissions() {
    let permissions = AddonManager.PERM_CAN_UNINSTALL;
    if (this.userDisabled)
      permissions |= AddonManager.PERM_CAN_ENABLE;
    else
      permissions |= AddonManager.PERM_CAN_DISABLE;
    return permissions;
  },

  // METHODS
  getResourceURI: DO_NOTHING,
  getXPI: function() {
    return this.getResourceURI("").QueryInterface(Ci.nsIFileURL).file;
  },
  uninstall: DO_NOTHING,
  findUpdates: DO_NOTHING,
  cancelUninstall: DO_NOTHING,
  hasResource: DO_NOTHING
});
exports.Addon = Addon;
