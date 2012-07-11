/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Photo = require('app/ui/story/photo').Photo;
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
    this._albumBody = dom.createElement(
      'div', cssx('app-ui-story-album-body'));

    return dom.createElement(
      'div', cssx('app-ui-story-album'), this._albumBody);
  },

  /** @override */
  onDocumentReady:function() {
    this.getEvents().listen(this.getNodeTappable(), 'tapclick', this._onPhotoTap);
  },

  /** @override */
  removeChild:function(child) {
    BaseUI.prototype.removeChild.call(this, child);
    if (child instanceof Photo) {
      if (this._photos) {
        this._photos.slice(this._photos.indexOf(child), 1);

        if (!this._photos.length) {
          delete this._photos;
        }
      }

      if (child === this._firstPhoto) {
        delete this._firstPhoto;
      }
    }
  },

  /**
   * @return {Element}
   */
  getPhotosParentNode: function() {
    return this._albumBody;
  },

  /**
   * @param {Photo} photo
   */
  addPhoto: function(photo) {

    if (this._firstPhoto && !this._photos) {
      this._photos = [this._firstPhoto];

      this._scrollable = new Scrollable(
        this.getNode(),
        Scroller.OPTION_PAGING_HORIZONTAL
      );
    }

    this.appendChild(photo);
    this.getNodeTappable().addTarget(photo.getNode());
    photo.render(this.getPhotosParentNode());

    if (!this._firstPhoto) {
      this._firstPhoto = photo;
    } else {
      this._photos.push(photo);
    }
  },

  /**
   * @return {Array.<Photo>}
   */
  getPhotos: function() {
    if (!this._photos) {
      this._photos = this._firstPhoto ? [this._firstPhoto] : [];
    }
    return this._photos;
  },

  getPhotoInView: function() {
    if (!this._firstPhoto) {
      return null;
    }

    var idx = this._scrollable ?
      this._scrollable.getScrollPageIndex() : 0;

    return idx === 0 ?
      this._firstPhoto :
      this._photos[idx];
  },

  /**
   * @param {Event} event
   */
  _onPhotoTap: function(event) {
    var photo = this.getPhotoInView();
    if (photo && photo.naturalWidth > 1) {
      this.dispatchEvent(EventType.STORY_ALBUM_TAP, photo, true);
      return;
    }

    console.warn('Unable to open album photo', photo.uri, photo);
  },

  /**
   * @type {Array.<Photo>}
   */
  _photos: null,

  /**
   * @type {Photo}
   */
  _firstPhoto: null,

  /**
   * @type {Element}
   */
  _albumBody: null,

  /**
   * @type {Scrollable}
   */
  _scrollable: null
});

exports.Album = Album;