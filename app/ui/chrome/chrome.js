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
function Chrome() {
  this.superClass.apply(this, arguments);
}
Class.extend(Chrome, BaseUI);

/**
 * @override
 */
Chrome.prototype.createNode = function() {
  return dom.createElement('div', 'app-ui-Chrome', 'hello');
};


exports.Chrome = Chrome;