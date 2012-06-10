/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

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


  onDocumentReady:function() {
    this.getEvents().listen(
      this, EventType.STORY_PHOTO_TAP, this._onStoryPhotoTap);
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
   * @param {Event} event
   */
  _onStoryPhotoTap: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(EventType.STORY_ALBUM_TAP, null, true);
  },

  /**
   * @type {Element}
   */
  _body: null,

  /**
   * @type {Scrollable}
   */
  _scrollable: null
});

exports.Album = Album;