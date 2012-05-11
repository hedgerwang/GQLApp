/**
 * @fileOverview Chrome UI.
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var dom = require('jog/dom').dom;

/**
 * @constructor
 * @extends {BaseUI}
 */
var Chrome = Class.create({
  extend: BaseUI,

  construct: function() {
    this.superClass.apply(this, arguments);
  },
  
  members: {
    /** @override */
    createNode : function() {
      return dom.createElement('div', 'app-ui-Chrome', 'hello');
    }
  }
});

exports.Chrome = Chrome;