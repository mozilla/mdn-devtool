"use strict";

const { Cu, Cc, Ci } = require('chrome'),
      utils          = require('sdk/window/utils');

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

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
function _(aName) {
  try {
    if (arguments.length == 1) {
      return toolStrings.GetStringFromName(aName);
    }
    let rest = Array.prototype.slice.call(arguments, 1);
    return toolStrings.formatStringFromName(aName, rest, rest.length);
  }
  catch (ex) {
    console.error(ex);
  }
}
exports._ = _;

/**
 * Open the nave file picker
 */
function _importFile(callback) {
  let window = utils.getMostRecentBrowserWindow();
  let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
  fp.init(window, _("MDNDevTool.importWindowTitle"), fp.modeOpen);
  fp.appendFilters(_("MDNDevTool.importWindowFilter"), "*.zst");
  fp.appendFilters(fp.filterAll);
  fp.open(function(result) {
    callback(result == Ci.nsIFilePicker.returnCancel ? null : fp.file);
  });
}
exports._importFile = _importFile;
