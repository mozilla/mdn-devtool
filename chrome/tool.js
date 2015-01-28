/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/osfile.jsm");
Cu.import("resource://gre/modules/NetUtil.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "EventEmitter",
  "resource://gre/modules/devtools/event-emitter.js");
XPCOMUtils.defineLazyModuleGetter(this, "promise",
  "resource://gre/modules/commonjs/sdk/core/promise.js", "Promise");

XPCOMUtils.defineLazyGetter(this, "toolStrings", () =>
  Services.strings.createBundle("chrome://mdn-devtool/locale/strings.properties"));

/**
 * Returns a localized string with the given key name from the string bundle.
 *
 * @param aName
 * @param ...rest
 *        Optional arguments to format in the string.
 * @return string
 */
this._ = function _(aName) {
  try {
    if (arguments.length == 1) {
      return toolStrings.GetStringFromName(aName);
    }
    let rest = Array.prototype.slice.call(arguments, 1);
    return toolStrings.formatStringFromName(aName, rest, rest.length);
  }
  catch (ex) {
    console.error(ex);
    throw new Error("L10N error. '" + aName + "' is missing from " + PROPERTIES_URL);
  }
}


/**
 * This file has access to the `window` and `document` objects of the add-on's
 * iframe, and is included in tool.xul. This is the add-on's controller.
 */

/**
 * Called when the user select the tool tab.
 *
 * @param Toolbox toolbox
 *        The developer tools toolbox, containing all tools.
 * @param object target
 *        The local or remote target being debugged.
 * @return object
 *         A promise that should be resolved when the tool completes opening.
 */
function startup(toolbox, target) {
  return promise.resolve();
}

/**
 * Called when the user closes the toolbox or disables the add-on.
 *
 * @return object
 *         A promise that should be resolved when the tool completes closing.
 */
function shutdown() {
  return promise.resolve();
}

/**
 * DOM query helpers.
 */
function $(selector, target = document) { return target.querySelector(selector); }
function $$(selector, target = document) { return target.querySelectorAll(selector); }

/**
 * Called when the user clicks the "Import" button
 */
function onImportClick() {

	let onFileSelected = function(file) {
	      if (!file) return;

	      NetUtil.asyncFetch(file, function(stream, status) {
	        if (!Components.isSuccessCode(status)) {
	          this.emit("error", { key: LOAD_ERROR });
	          return;
	        }
	        let source = NetUtil.readInputStreamToString(stream, stream.available());
	        stream.close();

	        // Now do something with the source!
	      });

	    };

	_importFile(onFileSelected);

}

/**
 * Called when the user clicks the "Clear" button
 */
function onClearClick() {

}

/**
 * Called when the user clicks the "Record" button
 */
function onRecordClick() {

}

/**
 * Called when the user clicks the "Scan" button
 */
function onScanClick() {

}

/**
 * Open the nave file picker
 */
function _importFile(callback) {
	let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
	let fpCallback = function(result) {
	
	  if (result == Ci.nsIFilePicker.returnCancel) {
	    callback(null);
	  } else {
	    callback(fp.file);
	  }
	};

	fp.init(window, _("MDNDevTool.importWindowTitle"), fp.modeOpen);
	fp.appendFilters(_("MDNDevTool.importWindowFilter"), "*.zest");
	fp.appendFilters(fp.filterAll);
	fp.open(fpCallback);
}