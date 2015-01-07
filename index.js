/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// Dependencies for creating the native tab code
const { Panel } = require("dev/panel");
const { Tool } = require("dev/toolbox");
const { Class } = require("sdk/core/heritage");

// Dependencies for locatlization
var _ = require("sdk/l10n").get;

// Create and place the new tab within the panel
const MDNPanel = Class({
  extends: Panel,
  label: _("tab_name"),
  tooltip: _("tab_tooltip"),
  icon: "./icon.png",
  url: "./index.html",
  id: "mdnPanel",
  setup: function() {
    console.log("MDN panel setup!");

  },
  dispose: function() {
    console.log("MDN panel dispose!");

  },
  onReady: function() {
    console.log("MDN panel document is interactive");
    
  },
  onLoad: function() {
    console.log("MDN panel document is fully loaded");

    // Lazyload tab SDK, retrieve the active tab for the developer tool
    var activeTab = require("sdk/tabs").activeTab;

    // Detect "pageshow" event for the tab, meaning the page is ready to be analyzed
    // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs#pageshow
    // We may want to enable or disabled some stuff based on this event
    activeTab.on("pageshow", function() {
      console.log('pageshow: ', activeTab.window);
    });

    activeTab.on("activate", function() {
      console.log('activate: ', activeTab.window);
    });

  }
});
exports.MDNPanel = MDNPanel;
const mdnTool = new Tool({ panels: { mdnPanel: MDNPanel } });


// Create a menu item for the "Tools" toolbar
require("addon-pathfinder/ui/menuitems").Menuitem({
  id: "mdnMenuItem",
  // Using this menuid "menuWebDeveloperPopup" since "menu_devToolbox" appears to be dynamic and I can't append to it
  menuid: "menuWebDeveloperPopup",
  label: _("tab_name"),
  insertbefore: "menu_devToolbox",
  onCommand: function() {    
    // ToDo:  Open DevTools with the MDN tab focused
    require("dev/utils").openToolbox(MDNPanel);
  }
});