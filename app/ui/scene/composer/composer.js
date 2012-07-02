/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBAPI = require('jog/fbapi').FBAPI;
var FBData = require('jog/fbdata').FBData;
var Scene = require('jog/ui/scene').Scene;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var Composer = Class.create(Scene, {

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-composer'));

    node.appendChild(this._createHeader());
    node.appendChild(this._createBody());
    node.appendChild(this._createFooter());
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
  },

  /**
   * @return {Element}
   */
  _createHeader: function() {
    var node = dom.createElement('div', cssx('app-ui-scene-composer_header'),
      ['div', cssx('app-ui-scene-composer_cancel'), 'Cancel'],
      ['div', cssx('app-ui-scene-composer_publish'), 'Publish']
    );
    return node;
  },

  /**
   * @return {Element}
   */
  _createBody: function() {
    var node = dom.createElement('div', cssx('app-ui-scene-composer_body'),
      ['div', cssx('app-ui-scene-composer_profile-pix')],
      ['textarea', cssx('app-ui-scene-composer_input')]
    );
    return node;
  },

  /**
   * @return {Element}
   */
  _createFooter: function() {
    var node = dom.createElement('div', cssx('app-ui-scene-composer_footer')
    );
    return node;
  }
});

exports.Composer = Composer;