/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Page = require('ppp/ui/page').Page;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var Slide = require('ppp/ui/slide').Slide;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Slides = Class.create(BaseUI, {
  /** @override */
  main: function() {
  },

  /** @override */
  createNode: function() {
    var body = dom.createElement('div', cssx('ppp-ui-slides-body'));
    var node = dom.createElement('div', cssx('ppp-ui-slides'), body);
    this._body = body;
    return node;
  },

  /** @override */
  dispose: function() {
    Class.dispose(this._scrollable);
  },

  /** @override */
  appendChild: function(child, opt_render) {
    if (__DEV__) {
      if (!(child instanceof Slide)) {
        throw new Error('child must be Slide');
      }
    }

    return BaseUI.prototype.appendChild.call(this, child, opt_render);
  },

  /** @override */
  onDocumentReady: function() {
    var width = Math.max(this.getNode().offsetWidth, 300);
    this._scrollDimensions = [width, 1, width * 2, 1];

    var scrollConfig = {
      direction:'horizontal',
      paging: true,
      dimensions: this._scrollDimensions
    };

    this._scrollable = new Scrollable(this.getNode(), scrollConfig);
    var events = this.getEvents();
    events.listen(this._scrollable, 'scrollstart', this._reflow);
    events.listen(this._scrollable, 'scrollend', this._reflow);
    this._reflow();
  },

  /**
   * @param {Event=} evt
   */
  _reflow: function(evt) {
    var dimensions = this._scrollDimensions;
    var children = this.getChildren();
    var width = this.getNode().offsetWidth || dom.getViewportWidth();
    width *= 0.86;
    dimensions[0] = width;
    dimensions[2] = width * children.length;

    if (evt && evt.type === 'scrollend') {
      var x = this._scrollable.getScrollLeft();
      if (x > this._scrollX) {
        this._scrollIndex++;
      } else if (x < this._scrollX) {
        this._scrollIndex--;
      } else {
        return;
      }

      this._scrollX = x;
    }
    this._toggleSlide(children[this._scrollIndex], true, true);
    this._toggleSlide(children[this._scrollIndex + 1], true, false);
    this._toggleSlide(children[this._scrollIndex + 2], true, false);
    this._toggleSlide(children[this._scrollIndex + 3], false, false);
    this._toggleSlide(children[this._scrollIndex - 1], true, false);
    this._toggleSlide(children[this._scrollIndex - 2], true, false);
    this._toggleSlide(children[this._scrollIndex - 3], false, false);
  },

  _toggleSlide: function(slide, visible, enabled) {
    if (slide) {
      var body = this._body;
      if (!slide.isInDocument()) {
        slide.render(body);
      }
      slide.setVisible(visible);
      slide.setEnabled(enabled);
    }
  },

  /**
   * @type {Array.<number>}
   */
  _scrollDimensions: null,

  /**
   * @type {number}
   */
  _scrollIndex: 0,

  /**
   * @type {number}
   */
  _scrollX : 0,

  /**
   * @type {Element}
   */
  _body : null
});

exports.Slides = Slides;