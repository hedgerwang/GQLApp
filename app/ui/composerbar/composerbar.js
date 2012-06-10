/**
 * @fileOverview
 * @author Hedger Wang
 */

var Animator = require('jog/animator').Animator;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var ComposerBar = Class.create(BaseUI, {
  /** @override */
  main: function() {

  },

  /** @override */
  dispose: function() {
    Class.dispose(this._animator);
  },

  /** @override */
  createNode: function() {
    var node = dom.createElement('div', cssx('app-ui-composerbar'),
      this._createTab('Status', '/images/compose.png'),
      this._createTab('Photo', '/images/photo.png'),
      this._createTab('Check In', '/images/place.png')
    );
    return node;
  },

  /**
   * @param {boolean} visible
   */
  setVisible: function(visible) {
    if (this._visible === visible) {
      return;
    }

    this._visible = visible;

    Class.dispose(this._animator);

    this._startTranslateY = this._translateY;
    this._endTranslateY = visible ? 0 : -this.getNode().offsetHeight;
    this._deltaTranslateY = this._endTranslateY - this._startTranslateY;

    this._animator = new Animator();
    this._animator.start(
      this.bind(this._onAnimStep),
      this.bind(this._onAnimCheck),
      this.bind(this._onAnimComplete),
      200);
  },

  onDocumentReady: function() {
    this._visible = true;
  },

  _onAnimStep: function(value) {
    this._setTranslateY(
      this._startTranslateY + ~~(value * this._deltaTranslateY));
  },

  _onAnimCheck: function() {
    return this._endTranslateY !== this._translateY;
  },

  _onAnimComplete: function() {
    Class.dispose(this._animator);
    delete this._animator;
  },

  /**
   * @param {number} y
   */
  _setTranslateY: function(y) {
    this._translateY = y;
    this.getNode().style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
  },

  /**
   * @param {string} text
   * @param {string} iconSrc
   */
  _createTab: function(text, iconSrc) {
    var img = dom.createElement(
      'div', cssx('app-ui-composerbar_tab-icon'));

    new Imageable(img, iconSrc);

    return dom.createElement('div', cssx('app-ui-composerbar_tab'),
      img, text);
  },

  /**
   * @type {Animator}
   */
  _animator: null,
  _visible: false,
  _translateY: 0,
  _deltaTranslateY: 0,
  _startTranslateY: 0,
  _endTranslateY: 0
});

exports.ComposerBar = ComposerBar;