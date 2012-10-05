
/**
 * @fileoverview Simple main method.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('lightsout.Main');

goog.require('goog.debug.Console');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('lightsout.LightsOutController');


goog.events.listen(goog.dom.getDocument(), 'DOMContentLoaded', function(e) {
  goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.INFO);
  var logconsole = new goog.debug.Console();
  logconsole.setCapturing(true);

  new lightsout.LightsOutController(/** @type {!Element} */
      (window.document.body));
});
