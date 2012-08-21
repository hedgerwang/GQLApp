/**
 * @fileOverview
 * @author Hedger Wang
 */

var Animator = require('jog/animator').Animator;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Page = require('ppp/ui/page').Page;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var UserAgent = require('jog/useragent').UserAgent;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Slide = Class.create(BaseUI, {
  /** @override */
  main: function() {
    this._page = this.appendChild(new Page());
  },

  /** @override */
  createNode: function() {
    var pages = dom.createElement('div', cssx('ppp-ui-slide-page'));
    var background = dom.createElement('div', cssx('ppp-ui-slide-background'));
    var node = dom.createElement('div', cssx('ppp-ui-slide'),
      background, pages);
    this._pageNode = pages;
    return node;
  },

  /** @override */
  onNodeReady: function() {
    this._page.render(this._pageNode);
    this._setPageDegree(0);
  },

  /** @override */
  dispose: function() {
    Class.dispose(this._animator);
  },

  /**
   * @param {string} pageCover
   * @param {string} pageContent
   */
  setContent: function(pageCover, pageContent) {
    this._page.setContent(pageCover, pageContent);
  },

  /**
   * @param {boolean} enabled
   */
  setEnabled: function(enabled) {
    if (enabled === this._enabled) {
      return;
    }

    this._enabled = enabled;
    this._toggleListeners(enabled);
    if (!enabled) {
      this._page.setDegree(0);
    }
  },

  /**
   * @param {boolean} visible
   */
  setVisible:function(visible) {
    if (visible !== this._visible) {
      this._visible = visible;
      if (!visible) {
        this._page.setDegree(0);
      }
      this.getNode().style.visibility = visible ? 'visible' : 'hidden';
      this._page.getNode().style.display = visible ? 'block' : 'none';
    }
  },

  /**
   * @param {boolean} enabled
   */
  _toggleListeners: function(enabled) {
    if (enabled) {
      this.getEvents().listen(
        this.getNode(), TouchHelper.EVT_TOUCHSTART, this._onTouchStart);
    } else {
      this.getEvents().unlistenAll();
    }
  },

  /**
   * @param {Event} evt
   */
  _onTouchStart: function(evt) {
    Class.dispose(this._animator);

    if (evt.defaultPrevented || TouchHelper.isMultiTouch(event)) {
      return;
    }

    var target = evt.target;

    if (target !== this._pageNode && !this._pageNode.contains(target)) {
      if (this._pageDegree > 0) {
        evt.preventDefault();
        this._setPageDegree(0);
      }
      return;
    }

    evt.preventDefault();

    var events = this.getEvents();
    events.unlistenAll();

    target = this.getNode();

    events.listen(
      target, TouchHelper.EVT_TOUCHMOVE, this._onTouchMove);

    events.listen(
      target, TouchHelper.EVT_TOUCHEND, this._onTouchEnd);

    events.listen(
      target, TouchHelper.EVT_TOUCHCANCEL, this._onTouchEnd);

    if (__DEV__) {
      if (UserAgent.IS_DESKTOP) {
        target = document;

        events.listen(
          target, TouchHelper.EVT_TOUCHMOVE, this._onTouchMove);

        events.listen(
          target, TouchHelper.EVT_TOUCHEND, this._onTouchEnd);

        events.listen(
          target, TouchHelper.EVT_TOUCHCANCEL, this._onTouchEnd);
      }
    }

    var x = TouchHelper.getTouchPageCoord(event).x;
    this._startTouchX = x;
    this._touchX0 = x;
    this._touchX1 = x;
    this._startPagesDegree = this._pageDegree;
  },

  /**
   * @param {Event} evt
   */
  _onTouchMove: function(evt) {
    if (TouchHelper.isMultiTouch(event) || event.defaultPrevented) {
      return;
    }

    var x = TouchHelper.getTouchPageCoord(event).x;
    evt.preventDefault();

    if (x === this._touchX1) {
      return;
    }

    this._touchX0 = this._touchX1;
    this._touchX1 = x;

    var dx = (this._startTouchX - x) / 4;
    var deg = Math.round(this._startPagesDegree + dx);
    deg = deg < 0 ? 0 : deg > 180 ? 180 : deg;
    this._setPageDegree(deg);
  },

  /**
   * @param {Event} evt
   */
  _onTouchEnd: function(evt) {
    evt.preventDefault();
    this._toggleListeners(false);
    if (this._enabled) {
      this._toggleListeners(true);
    }

    var deg1;
    var deg0 = this._pageDegree;

    if (this._touchX0 < this._touchX1) {
      // ltr
      deg1 = deg0 === 0 ? 180 : 0;
    } else if (this._touchX0 > this._touchX1) {
      // rtl
      deg1 = 180;
    } else {
      deg1 = deg0 === 0 ? 180 : 0;
    }

    var degDelta = deg1 - deg0;

    var stepFn = this.bind(function(p) {
      this._setPageDegree(deg0 + degDelta * p);
    });

    var completedFn = this.bind(function() {
      Class.dispose(this._animator);
      this._animator = null;
    });

    this._animator = new Animator();
    this._animator.start(
      stepFn,
      this.bind(this._verifyFn), completedFn, 600, Animator.easeOutCubic);
  },

  _verifyFn: function() {
    return this._visible && this._enabled;
  },

  /**
   * @param {number} degree
   */
  _setPageDegree: function(degree) {
    if (__DEV__) {
      if (degree < 0 || degree > 180) {
        throw new Error('Invalid degree ' + degree);
      }
    }
    if (degree !== this._pageDegree) {
      this._pageDegree = degree;
      var ratio = degree / 180;
      var x = -20 * (1 - ratio);
      var scaleX = 0.85 + (1 - 0.85) * ratio;
      var scaleY = 0.98 + (1 - 0.98) * ratio;
      this._pageNode.style.webkitTransform = 'translate3d(' + x + '%, 0, 0) ' +
        'scale3d(' + scaleX + ', ' + scaleY + ', 1)';
      this._page.setDegree(degree);
    }
  },

  /**
   * @type {boolean}
   */
  _visible: true,

  /**
   * @type {number}
   */
  _touchX0: 0,

  /**
   * @type {number}
   */
  _touchX1: 0,

  /**
   * @type {number}
   */
  _pageDegree: -1,

  /**
   * @type {boolean}
   */
  _enabled: false,

  /**
   * @type {Element}
   */
  _pageNode: null,

  /**
   * @type {Page}
   */
  _page: null
});

exports.Slide = Slide;