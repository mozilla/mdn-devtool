"use strict";

const { Cc, Ci, Cu, Cr } = require('chrome');
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource:///modules/devtools/gDevTools.jsm");

var ZestRunner = require('zest-runner');

/**
 * `osString` specifies the current operating system.
 * Go to https://developer.mozilla.org/docs/XPCOM_Interface_Reference/nsIXULRuntime
 * for more information.
 */
XPCOMUtils.defineLazyGetter(this, "osString", () =>
  Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS);

/**
 * `toolStrings` is a bundle containing localized strings.
 * Go to https://developer.mozilla.org/docs/Localization for more information.
 */
XPCOMUtils.defineLazyGetter(this, "toolStrings", () =>
  Services.strings.createBundle("chrome://mdn-devtool/locale/strings.properties")
);

XPCOMUtils.defineLazyGetter(this, "toolDefinition", () => ({
  // A unique id. Must not contain whitespace.
  id: "mdn-devtool",

  // The position of the tool's tab within the toolbox
  ordinal: 99,

  // Main keybinding key (used as a keyboard shortcut).
  key: toolStrings.GetStringFromName("MDNDevTool.commandkey"),

  // Main keybinding modifiers.
  modifiers: osString == "Darwin" ? "accel,alt" : "accel,shift",

  // The url of the icon, displayed in the Toolbox.
  icon: "chrome://mdn-devtool/skin/icon.png",

  // A tool lives in its own iframe. The Toolbox will load this URL.
  url: "chrome://mdn-devtool/content/tool.xul",

  // The tool's name. Showed in Firefox' tool menu and in the Toolbox' tab.
  label: toolStrings.GetStringFromName("MDNDevTool.label"),

  // The tooltip text shown in the Toolbox's tab.
  tooltip: toolStrings.GetStringFromName("MDNDevTool.tooltip"),

  // If the target is not supported, the toolbox will hide the tab.
  // Targets can be local or remote (used in remote debugging).
  isTargetSupported: function(target) {
    return target.isLocalTab;
  },

  // This function is called when the user select the tool tab.
  // It is called only once the toold definition's URL is loaded.
  build: function(iframeWindow, toolbox) {
    Cu.import("chrome://mdn-devtool/content/panel.js");
    let panel = new MDNSecurityPanel(iframeWindow, toolbox, ZestRunner);
    return panel.open();
  }
}));

/**
 * Called when the extension needs to start itself up. This happens at
 * application launch time or when the extension is enabled after being
 * disabled (or after it has been shut down in order to install an update.
 * As such, this can be called many times during the lifetime of the application.
 *
 * This is when your add-on should inject its UI, start up any tasks it may
 * need running, and so forth.
 *
 * Go to https://developer.mozilla.org/Add-ons/Bootstrapped_extensions
 * for more information.
 */
exports.main = function (options, callbacks) {
  gDevTools.registerTool(toolDefinition);
};


/**
 * Called when the extension needs to shut itself down, such as when the
 * application is quitting or when the extension is about to be upgraded or
 * disabled. Any user interface that has been injected must be removed, tasks
 * shut down, and objects disposed of.
 */
exports.onUnload = function() {
  gDevTools.unregisterTool(toolDefinition);
  Services.obs.notifyObservers(null, "startupcache-invalidate", null);
}

// Create a menu item for the "Tools" toolbar
require("addon-pathfinder/ui/menuitems").Menuitem({
  id: "securityMenuItem",
  // Using this menuid "menuWebDeveloperPopup" since "menu_devToolbox" appears to be dynamic and I can't append to it
  menuid: "menuWebDeveloperPopup",
  label: toolStrings.GetStringFromName("MDNDevTool.label"),
  insertbefore: "menu_devToolbox",
  onCommand: function() {    
    // TODO:  Open devtool to toolbox item

    //require("dev/utils").openToolbox(toolDefinition);
  }
});