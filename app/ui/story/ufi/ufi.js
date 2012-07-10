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

var UFI = Class.create(BaseUI, {
  /**
   * @param {string} storyID
   */
  main: function(storyID) {
    this._storyID = storyID;
  },

  /** @override */
  dispose: function() {

  },

  createNode: function() {
    return dom.createElement('div', cssx('app-ui-story-ufi'),
      'Like \u00b7 Comment'
    );
  },

  _storyID: ''
});

exports.UFI = UFI;