/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var ComposerBar = Class.create(BaseUI, {
  /** @override */
  main: function() {

  },

  /** @override */
  dispose: function() {

  }
});

exports.ComposerBar = ComposerBar;