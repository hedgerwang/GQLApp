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


var SearchBar = Class.create(BaseUI, {

  createNode: function() {
    this._icon = dom.createElement('i', cssx('app-ui-searchbar_icon'));
    this._input = dom.createElement(
      'input',
      {
        className: cssx('app-ui-searchbar_input'),
        placeholder: 'Search'
      });

    var node = dom.createElement(
      'div', cssx('app-ui-searchbar'),
      ['div', cssx('app-ui-searchbar_background')],
      this._icon,
      this._input
    );

    new Imageable(this._icon, '/images/spyglass-2x.png');
    return node;
  },

  onDocumentReady: function() {

  },

  _icon : null,
  _inout : null
});


exports.SearchBar = SearchBar;