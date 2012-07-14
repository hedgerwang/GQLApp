/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventTarget = require('jog/events/eventtarget').EventTarget;
var EventType = require('app/eventtype').EventType;
var Events = require('jog/events').Events;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var ActiveSceneScroller = Class.create(EventTarget, {
  /**
   * @param {Scene} scene
   */
  main: function(scene) {
    this._scene = scene;

    this._scroller = new Scroller(this, Scroller.OPTION_HORIZONTAL);
    this._scroller.registerElement(scene.getNode());

    this._events = new Events(this);
    this._events.listen(
      scene.getNode(),
      TouchHelper.EVT_TOUCHSTART,
      this._onTouchStart);
  },

  /** @override */
  dispose: function() {
    Class.dispose(this._scroller);
    Class.dispose(this._events);
  },

  /**
   * @param {number} width
   */
  setWidth: function(width) {
    this._width = width;
  },

  /**
   * @param {number} scale
   */
  setScale: function(scale) {
    this._scale = scale;
  },


  onScrollStart: function() {
    this._scene.setDisabled(true);
    this._scroller.setDimensions(this._width, 1, this._width, 1);
  },

  onScroll: function(left) {
    var x = Math.min(-left / this._scale, this._width);
    this._scene.translateXTo(Math.max(x, 0));
    this._noop = left >= 0;
  },

  onScrollEnd: function() {
    // Do nothing.
    this._scene.setDisabled(false);
  },

  /**
   * @param {Event} event
   */
  _onTouchStart: function(event) {
    if (__DEV__) {
      if (!this._width) {
        throw new Error('ActiveSceneScroller width is 0.');
      }
    }

    this._scroller.doTouchStart(event);
    var events = this._events;
    events.unlistenAll();
    events.listen(document, TouchHelper.EVT_TOUCHMOVE, this._onTouchMove);
    events.listen(document, TouchHelper.EVT_TOUCHEND, this._onTouchEnd);
    events.listen(document, TouchHelper.EVT_TOUCHCANCEL, this._onTouchEnd);
  },

  /**
   * @param {Event} event
   */
  _onTouchMove: function(event) {
    this._scroller.doTouchMove(event);
  },

  /**
   * @param {Event} event
   */
  _onTouchEnd: function(event) {
    this._scroller.doTouchEnd(event);


    var events = this._events;
    events.unlistenAll();

    events.listen(
      this._scene.getNode(),
      TouchHelper.EVT_TOUCHSTART,
      this._onTouchStart);

    if (this._noop) {
      // No inertial scrolling.
      // This will stop the scroller.
      this._scene.setDisabled(false);
    }

    if (this._scene.getTranslateX() > this._width / 5) {
      this.dispatchEvent(EventType.ACTIVE_SCENE_SCROLLER_SCROLLOUT);
    }
  },

  _noop: false,

  _scale: 1,

  _width: 0,

  /**
   * @type {Scene}
   */
  _scene: null,

  /**
   * @type {Events}
   */
  _events: null,

  /**
   * @type {Scroller}
   */
  _scroller: null
});

exports.ActiveSceneScroller = ActiveSceneScroller;