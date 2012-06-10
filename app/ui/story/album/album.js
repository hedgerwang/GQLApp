/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var Photo = require('app/ui/story/photo').Photo;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var objects = require('jog/objects').objects;

var Album = Class.create(BaseUI, {
  dispose: function() {
    Class.dispose(this._scrollable);
  },

  /** @override */
  createNode: function() {
    this._body = body = dom.createElement(
      'div', cssx('app-ui-story-album-body'));

    return dom.createElement('div', cssx('app-ui-story-album'), this._body);
  },

  onDocumentReady: function() {
    this._scrollable = new Scrollable(
      this.getNode(),
      {direction:'horizontal', paging: true}
    );
  },

  /**
   * @param {Photo} photo
   */
  addPhoto: function(photo) {
    if (!this._scrollable) {
      this._scrollable = new Scrollable(
        this.getNode(),
        Scroller.OPTIONS_PAGING_HORIZONTAL
      );
    }
    this.appendChild(photo);
    photo.render(this._body);
  },


  /**
   * @type {Element}
   */
  _body: null,

  /**
   * @type {Scrollable}
   */
  _scrollable: null,

  /**
   * @type {Array}
   */
  _subAttachments: null
});

exports.Album = Album;