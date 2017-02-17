'use strict';

var decorate = require('../../frontend/decorate');
var SettingsCheckbox = require('../../frontend/SettingsCheckbox');

var Wrapped = decorate({
  listeners() {
    return ['turbomodechange'];
  },
  props(store) {
    return {
      state: store.turboModeState,
      text: 'Engage Turbo Mode',
      onChange: state => store.changeTurboMode(state),
    };
  },
}, SettingsCheckbox);

module.exports = Wrapped;
