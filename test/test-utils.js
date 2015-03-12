let { _ } = require('../chrome/utils');

exports['test i18n strings'] = function(assert) {
  assert.equal(_('MDNDevTool.label'), 'Security', 'Is the text "Security"');
  assert.equal(_('MDNDevTool.stringPass'), 'Pass', 'Is the text "Pass"');
};

require('sdk/test').run(exports);
