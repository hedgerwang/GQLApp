/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var Tappable = require('jog/behavior/tappable').Tappable;
var ID = require('jog/id').ID;
var asserts = require('jog/asserts').asserts;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var objects = require('jog/objects').objects;

var Input = Class.create(BaseUI, {

  /** @override */
  createNode: function() {
    var id = ID.next();
    var text = 'Leave your comments...';
    var node = dom.createElement('div', cssx('app-ui-story-input'),
      ['textarea',
        {
          id: id,
          className: cssx('app-ui-story-input-textarea'),
          placeholder: text
        }
      ]
    );

    this._input = node.lastChild;
    return node;
  }
});

exports.Input = Input;