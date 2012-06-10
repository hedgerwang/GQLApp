/**
 * @fileOverview
 * @author Hedger Wang
 */

var Album = require('app/ui/story/album').Album;
var Animator = require('jog/animator').Animator;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Photos = Class.create(BaseUI, {
  /** @override */
  main: function() {
  },

  /** @override */
  dispose: function() {
    Class.dispose(this._animator);
    Class.dispose(this._scrollable);
  },

  /** @override */
  createNode:function() {
    this._body = dom.createElement(
      'div', cssx('app-ui-fullview-photos_body'));

    return dom.createElement(
      'div', cssx('app-ui-fullview-photos'), this._body);
  },

  /** @override */
  onDocumentReady: function() {
    this.getEvents().listen(this.getNodeTappable(), 'tap', this._onTap);

    var album = this._albumToImport;
    if (album) {
      delete this._albumToImport;
      this.importAlbum(album);
    }
  },

  /**
   * TODO(hedger): Clear exising photos before importing more photos.
   * @param {Album} album
   */
  importAlbum: function(album) {
    if (this._albumToImport || this._albumImported) {
      if (__DEV__) {
        throw new Error('Only one album can be imported');
      }
      return;
    }

    if (!this.isInDocument()) {
      this._albumToImport = album;
      return;
    }

    this._albumImported = true;
    this._translateAlbumPhotoIntoView(album);
  },

  _translateAlbumPhotoIntoView: function(album) {
    var photo = album.getPhotoInView();

    if (!photo) {
      return;
    }

    if (!photo.naturalHeight) {
      // Photo can't be translated.
      // Simply import photos.
      this._onAlbumPhotoTranslatedIntoView(album, null);
      return;
    }

    var nodeRect = this.getNode().getBoundingClientRect();
    var photoRect = photo.getNode().getBoundingClientRect();
    var placeHolder = dom.createElement(
      'div', cssx('app-ui-fullview-photos_placeholder'));

    var x1 = photoRect.left - nodeRect.left;
    var y1 = photoRect.top - nodeRect.top;
    var h1 = photoRect.height;
    var w1 = photoRect.width;
    var placeHolderStyle = placeHolder.style;

    placeHolderStyle.left = x1 + 'px';
    placeHolderStyle.top = y1 + 'px';
    placeHolderStyle.width = h1 + 'px';
    placeHolderStyle.height = w1 + 'px';
    this.getNode().appendChild(placeHolder);

    var h2;
    var w2;

    var photoRatio = photo.naturalWidth / photo.naturalHeight;
    if (photoRatio >= 1) {
      w2 = nodeRect.width;
      h2 = w2 / photoRatio;
      if (h2 > nodeRect.height) {
        h2 = nodeRect.height;
        w2 = photoRatio * h2;
      }
    } else if (photoRatio < 1) {
      h2 = nodeRect.height;
      w2 = photoRatio * h2;
      if (w2 > nodeRect.width) {
        w2 = nodeRect.width;
        h2 = w2 / photoRatio;
      }
    } else {
      h2 = Math.min(nodeRect.width);
      w2 = h2;
    }

    var x2 = (nodeRect.width - w2) / 2;
    var y2 = (nodeRect.height - h2) / 2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dw = w2 - w1;
    var dh = h2 - h1;

    new Imageable(placeHolder, photo.uri);

    this._animator = new Animator();

    this._animator.start(
      this.bind(function(value) {
        placeHolderStyle.left = x1 + ~~(dx * value) + 'px';
        placeHolderStyle.top = y1 + ~~(dy * value) + 'px';
        placeHolderStyle.width = w1 + ~~(dw * value) + 'px';
        placeHolderStyle.height = h1 + ~~(dh * value) + 'px';
      }),
      this.bind(function() {
        return true;
      }),
      this.bind(function() {
        x1 = null;
        y1 = null;
        w1 = null;
        w2 = null;
        dw = null;
        dh = null;
        placeHolderStyle = null;
        this._onAlbumPhotoTranslatedIntoView(album, photo);
        this.callLater(function() {
          dom.remove(placeHolder);
          placeHolder = null;
        }, 500);
        album = null;
        photo = null;
      }),
      350);
  },

  /**
   * @param {Album} album
   * @param {Photo} translatedPhoto
   */
  _onAlbumPhotoTranslatedIntoView:function(album, translatedPhoto) {
    if (album.disposed) {
      return;
    }

    var photos = album.getPhotos();

    if (!photos) {
      return;
    }

    if (photos.length > 1) {
      this._scrollable = new Scrollable(
        this.getNode(),
        Scroller.OPTIONS_PAGING_HORIZONTAL);
    }

    var photoClassName = cssx('app-ui-fullview-photos-photo');
    var photoNodeBase = dom.createElement('div', photoClassName);
    var body = this._body;
    var tappable = this.getNodeTappable();

    for (var i = 0, j = photos.length; i < j; i++) {
      var photo = photos[i];
      var photoNode = photoNodeBase.cloneNode();
      new Imageable(photoNode, photo.uri, Imageable.RESIZE_MODE_USE_NATURAL);
      body.appendChild(photoNode);
      tappable.addTarget(photoNode);
      if (translatedPhoto === photo) {
        this._scrollable.scrollTo(i * photoNode.offsetWidth, 0);
        translatedPhoto = null;
      }
    }
  },

  _onTap: function() {
    this.dispose();
  },

  /**
   * @type {boolean}
   */
  _albumImported: false,

  /**
   * @type {Animator}
   */
  _animator: null,

  /**
   * @type {Element}
   */
  _albumBody: null,

  /**
   * @type {Scrollable}
   */
  _scrollable: null,

  /**
   * @type {Album}
   */
  _albumToImport: null
});

exports.Photos = Photos;