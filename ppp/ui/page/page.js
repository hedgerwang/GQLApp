/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Page = Class.create(BaseUI, {
  /** @override */
  main: function() {

  },
  /** @override */
  createNode: function() {
    var node = dom.createElement('div', 'ppp-ui-page');
    return node;
  },

  /** @override */
  dispose: function() {

  }
});

exports.Page = Page;