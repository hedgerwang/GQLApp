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
var objects = require('jog/objects').objects;

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
    this.getNodeTappable().addTarget(this._cancel);
    this.getEvents().listen(this._input, 'focus', this._onFocus);
    this.getEvents().listen(this.getNodeTappable(), 'tapclick', this._onTap);
    this.setTimeout(function() {
      this._input && this._input.focus();
    }, 800);
  },

  /**
   * @param {Event} event
   */
  _onFocus: function(event) {
    window.scrollTo(0, 1);
    this._focusTimer = this.setTimeout(function() {
      window.scrollTo(0, 1);
      dom.addClassName(this._input, cssx('app-ui-scene-composer_input-focus'));
    }, 100);
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    this._input.blur();

    switch (event.data) {
      case this._cancel:
        this.dispatchEvent(EventType.COMPOSER_CLOSE, null, true);
        break;
    }
  },

  /**
   * @return {Element}
   */
  _createHeader: function() {
    var className = ' ' + cssx('app-ui-scene-composer_button');
    var node = dom.createElement('div', cssx('app-ui-scene-composer_header'),
      ['div', cssx('app-ui-scene-composer_cancel') + className, 'Cancel'],
      ['div', cssx('app-ui-scene-composer_publish') + className, 'Publish']
    );
    this._header = node;
    this._cancel = node.firstChild;
    this._publish = node.lastChild;
    return node;
  },

  /**
   * @return {Element}
   */
  _createBody: function() {
    var node = dom.createElement('label', cssx('app-ui-scene-composer_body'),
      ['div', cssx('app-ui-scene-composer_profile-pix')],
      ['textarea',
        {
          tabIndex: 0,
          autofocus: 'autofocus',
          placeholder: 'post something...',
          className: cssx('app-ui-scene-composer_input'),
          autocapitalize : 'off',
          autocorrect: 'off'
        }
      ]
    );

    this._input = node.querySelector('textarea');
    this._body = node;
    this._pix = node.firstChild;

    FBData.getProfile(0, true).addCallback(this.bind(function(data) {
      var src = objects.getValueByName(
        'profile_picture.uri', data[data.userid]);
      this.renderImage(this._pix, src).show(50, 50);
    }));

    return node;
  },

  /**
   * @return {Element}
   */
  _createFooter: function() {
    var node = dom.createElement('div', cssx('app-ui-scene-composer_footer'));
    this._footer = node;
    return node;
  },

  _focusTimer: 0,
  _input: null,
  _body: null,
  _pix: null,
  _header: null,
  _footer: null,
  _cancel: null,
  _publish: null
});

exports.Composer = Composer;