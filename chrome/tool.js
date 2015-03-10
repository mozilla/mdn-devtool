/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/osfile.jsm");
Cu.import("resource://gre/modules/NetUtil.jsm");

const {devtools} = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});

let { _, _importFile } = devtools.require('chrome://mdn-devtool/content/utils.js');

const HTML_NS = "http://www.w3.org/1999/xhtml";

XPCOMUtils.defineLazyModuleGetter(this, "EventEmitter",
  "resource://gre/modules/devtools/event-emitter.js");
XPCOMUtils.defineLazyModuleGetter(this, "promise",
  "resource://gre/modules/commonjs/sdk/core/promise.js", "Promise");

XPCOMUtils.defineLazyGetter(this, "TreeWidget",
  () => devtools.require("devtools/shared/widgets/TreeWidget").TreeWidget);

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

var ZR;

function startup(toolbox, target, ZestRunner) {
  // Make the runner globally available
  ZR = ZestRunner;

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
        this.emit("error", { key: "error-load" });
        return;
      }
      let source = NetUtil.readInputStreamToString(stream, stream.available());
      stream.close();

      // Now do something with the source!
      var obj;
      try { obj = JSON.parse(source); } catch(e){}

      // Make things happen if there's an object present
      if(obj) {
        _runZestTests(obj);

        // Reset the tree pane to the default tests
        $("#clear-button").setAttribute("disabled", "false");

        // Hide the error message if present
        $("#import-error-message").classList.add("hidden");
      }
      else { // Show an error message that the zest file isn't good
        $("#import-error-message").classList.remove("hidden");
      }
    });

  };

  _importFile(onFileSelected);
}

/**
 * Called when the user clicks the "Clear" button
 */
function onClearClick() {
	// Reset the tree pane to the default tests
      $("#clear-button").setAttribute("disabled", "true");
      $("#result-listing").innerHTML = "";

      // Clear out the tree area
      _clearJSONTrees();
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
 * Create new trees from provided JSON
 */
function _populateTreesFromJSON(json) {
  _clearJSONTrees();

  /*
  // Create the testing tree
  let treeSecurity = new TreeWidget($("#sec-test-tree"));
  treeSecurity.on("select", function(e, i) {

  });

  var div = document.createElementNS(HTML_NS, "div");
  div.setAttribute("style", "position: relative; padding-left: 22px;")

  var input = document.createElementNS(HTML_NS, "input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("checked", "checked");
  input.setAttribute("style", "position: absolute; top: 0; left: 0;");

  var label = document.createElementNS(HTML_NS, "label");
  label.textContent = "Check me";

  div.appendChild(input);
  div.appendChild(label);

  treeSecurity.add(["Tests", { label: div, type: "checkbox" }]);
  treeSecurity.add(["Tests", { label: "Item 2", type: "checkbox" }]);


  // Create the recommendations tree
  let treeRecommendation = new TreeWidget($("#sec-recommendation-tree"));
  treeRecommendation.add(["Tests", { label: "Item 1", type: "checkbox" }]);
  treeRecommendation.add(["Tests", { label: "Item 2", type: "checkbox" }]);
  */
}

/**
 * Clear out the sidebar tree area
 */
 function _clearJSONTrees() {
  $("#import-trees-container").textContent = "";
 }

/**
* Runs the ZestRunner of a verified object
*/
function _runZestTests(obj) {
  return new ZR({
        sourceType: "object",
        zest: obj,
        platform: "firefox"
      }).run().then(_runZestTestsCallback);
}

/**
* Callback for zest tests
*/
function _runZestTestsCallback(resultArr) {
  $("#result-content").value = JSON.stringify(resultArr);

  resultArr.forEach(function(result) {
    var listItem = document.createElementNS(HTML_NS, "li");
    if(result.result === false) {
      listItem.className = "error " + result.priority.toLowerCase() + " " + result.type;
      listItem.innerHTML = "<strong>" + _("MDNDevTool.stringError") + " (" + result.priority + "):</strong> " + result.print + " <i>(" + result.type + ")</i>";
    }
    else {
      listItem.innerHTML = "<strong>" + _("MDNDevTool.stringPass") + ":</strong> " + result.print;
    }
    $("#result-listing").appendChild(listItem);
  });
}
