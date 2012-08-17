/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Page = require('ppp/ui/page').Page;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Slide = Class.create(BaseUI, {
  /** @override */
  main: function() {

  },

  /** @override */
  createNode: function() {
    var pages = dom.createElement('div', 'ppp-ui-slide-pages');
    var node = dom.createElement('div', 'ppp-ui-slide', pages);
    this._pages = pages;
    return node;
  },

  /** @override */
  onNodeReady: function() {
    this._leftPage = this.appendChild(new Page());
    this._rightPage = this.appendChild(new Page());
    this._leftPage.render(this._pages);
    this._rightPage.render(this._pages);
  },

  /**
   * @param {boolean} enabled
   */
  setEnabled: function(enabled) {
    if (enabled === this._enabled) {
      return;
    }

    this._enabled = enabled;

    if (enabled) {
      this.getEvents().listen(
        this._pages, TouchHelper.EVT_TOUCHSTART, this._onTouchStart);
    } else {
      this.getEvents().unlistenAll();
    }
  },

  /** @override */
  dispose: function() {
    Class.dispose(this._scroller);
  },

  /**
   * @param {Event} evt
   */
  _onTouchStart: function(evt) {
    if (evt.defaultPrevented || TouchHelper.isMultiTouch(event)) {
      return;
    }
    evt.preventDefault();

    var events = this.getEvents();
    events.unlistenAll();

    events.listen(
      document, TouchHelper.EVT_TOUCHMOVE, this._onTouchMove);

    events.listen(
      document, TouchHelper.EVT_TOUCHEND, this._onTouchEnd);

    events.listen(
      document, TouchHelper.EVT_TOUCHCANCEL, this._onTouchEnd);

    this._startTouchX = TouchHelper.getTouchPageCoord(event).x;
    this._startPagesDegree = this._pagesDegree;
  },

  /**
   * @param {Event} evt
   */
  _onTouchMove: function(evt) {
    if (TouchHelper.isMultiTouch(event)) {
      return;
    }

    var dx = this._startTouchX - TouchHelper.getTouchPageCoord(event).x;
    var deg = this._startPagesDegree + dx;
    deg = deg < 0 ? 0 : deg > 180 ? 180 : deg;
    this._setPagesDegree(deg);
  },

  /**
   * @param {Event} evt
   */
  _onTouchEnd: function(evt) {
    var enabled = this._enabled;
    this.setEnabled(false);
    this.setEnabled(enabled);
  },

  /**
   * @param {number} degree
   */
  _setPagesDegree: function(degree) {
    if (degree !== this._pagesDegree) {
      this._pagesDegree = degree;
      var x = 10 - Math.round(degree * 10 / 18) / 10;
      // TODO(hedger): Firefox?
      this._pages.style.webkitTransform = 'translate3d(-' + x + '%,0,0)';
    }
  },

  /**
   * @type {numnber}
   */
  _pagesDegree: 0,

  /**
   * @type {boolean}
   */
  _enabled: false,

  /**
   * @type {Scroller}
   */
  _scroller: null,

  /**
   * @type {Element}
   */
  _pages: null,

  /**
   * @type {Page}
   */
  _leftPage: null,

  /**
   * @type {Page}
   */
  _rightPage: null
});

exports.Slide = Slide;