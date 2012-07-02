/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var Tappable = require('jog/behavior/tappable').Tappable;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var translate = require('jog/style/translate').translate;

var PullToRefreshPanel = Class.create(BaseUI, {
  /**
   * @param {EventTarget} scrollTarget
   */
  attachToScrollTarget: function(scrollTarget) {
    if (__DEV__) {
      if (this._scrollTarget) {
        throw new Error('scrollTarget already assigned');
      }
    }

    this._scrollTarget = scrollTarget;
    scrollTarget.appendChild(this);

    this.render(scrollTarget.getNode());
    this._bindEvents(false);
  },

  /** @override */
  createNode: function() {
    this._label = dom.createElement('div',
      cssx('app-ui-pulltorefreshpanel_label'));

    return dom.createElement(
      'div', cssx('app-ui-pulltorefreshpanel'), this._label);
  },

  onDocumentReady: function() {
    this._reflow();
    this._onScroll();
  },

  _bindEvents: function(scrolling) {
    this.getEvents().unlistenAll();
    var scrollTarget = this._scrollTarget;
    if (!scrolling) {
      if (!this._mayRefresh) {
        this.getEvents().listen(
          this._scrollTarget.getNode(),
          TouchHelper.EVT_TOUCHSTART,
          this._onTouchStart);
      }
    } else {
      this.getEvents().listen(
        this._scrollTarget.getNode(),
        TouchHelper.EVT_TOUCHCANCEL,
        this._onTouchEnd);
      this.getEvents().listen(
        document,
        TouchHelper.EVT_TOUCHEND,
        this._onTouchEnd);
    }
    this.getEvents().listen(scrollTarget, 'scroll', this._onScroll);
  },

  /**
   * @param {Event=} opt_event
   */
  _onScroll: function(opt_event) {
    if (! this._scrollStartTime) {
      this._scrollStartTime = Date.now();
    }

    var height = this._panelHeight;
    var scrollY = -this._scrollTarget.scrollTop - height;
    var deltaY = scrollY - this._scrollY;
    var text = this._labelText;

    if (scrollY < this._minY) {
      // Scroll to far. We won't be able to see the label anyway.
      delete this._mayRefresh;
      return;
    }

    if (this._wantRefresh) {
      if (scrollY < this._maxY) {
        this.getEvents().unlistenAll();
        var loading = new LoadingIndicator();
        this.appendChild(loading, true);
        loading.center();
        scrollY = this._maxY;
        this.setTimeout(function() {
          this.dispatchEvent(EventType.NEWSFEED_REFRESH, null, true);
        }, 1000);
      }
      text = 'Refreshing...';
    } else {
      var mayRefresh = (deltaY > 0) && (scrollY > this._maxY);

      if (mayRefresh !== this._mayRefresh) {
        this._mayRefresh = mayRefresh;

        text = this._mayRefresh ?
          '\u21d1 Release to refresh...' :
          '\u21d3 Pull to refresh...';
      }
    }

    if (text !== this._labelText) {
      this._labelText = text;
      this._label.textContent = text;
    }

    if (!(this._wantRefresh && this._scrollY === 0)) {
      translate.toY(this.getNode(), scrollY);
      this._scrollY = scrollY;
    }
  },

  _onTouchStart: function() {
    delete this._mayRefresh;
    this._bindEvents(true);
  },

  _onTouchEnd: function() {
    if (this._mayRefresh) {
      var duation = Date.now() - this._scrollStartTime;
      if (duation > 800) {
        this._wantRefresh = true;
      }
    }
    delete this._scrollStartTime;
    delete this._mayRefresh;
    dom.alterClassName(
      this.getNode(),
      cssx('app-ui-pulltorefreshpanel-refreshing'),
      this._wantRefresh);
    this._bindEvents(false);
  },

  _reflow: function() {
    if (!this._panelHeight) {
      this._panelHeight = this.getNode().offsetHeight;
      this._minY = -this._panelHeight * 2;
      this._maxY = -this._panelHeight / 3;
    }
  },

  /**
   * @type {string}
   */
  _labelText: '',

  /**
   * @type {Element}
   */
  _label: null,

  /**
   * @type {number}
   */
  _minY: 0,

  /**
   * @type {number}
   */
  _maxY: 0,

  /**
   * @type {number}
   */
  _scrollY: 0,

  /**
   * @type {boolean?}
   */
  _mayRefresh: null,

  /**
   * @type {boolean?}
   */
  _wantRefresh: false,

  /**
   * @type {number}
   */
  _panelHeight: 0,

  /**
   * @type {number}
   */
  _scrollStartTime: 0,

  /**
   * @type {BaseUI}
   */
  _scrollTarget : null
});

exports.PullToRefreshPanel = PullToRefreshPanel;

