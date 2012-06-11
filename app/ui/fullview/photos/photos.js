/**
 * @fileOverview
 * @author Hedger Wang
 */

var Album = require('app/ui/story/album').Album;
var Animator = require('jog/animator').Animator;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Functions = require('jog/functions').Functions;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var Photos = Class.create(BaseUI, {
  /** @override */
  main: function() {
    this._showMoreImages = lang.throttle(this._showMoreImages, 300, this);
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
    this._importAlbum(album);
  },

  _importAlbum: function(album) {
    var photos = album.getPhotos();
    var photoInView = album.getPhotoInView();

    if (photos.length > 1) {
      this._scrollable = new Scrollable(
        this.getNode(),
        Scroller.OPTIONS_PAGING_HORIZONTAL
      );
    } else {
      // Prevent page from scrolling.
      this.getEvents().listen(
        this.getNode(),
        TouchHelper.EVT_TOUCHMOVE,
        Functions.PREVENT_DEFAULT);
    }

    var willTranslate;
    var scrollLeft = 0;
    var selectedPageNode;

    for (var i = 0, j = photos.length; i < j; i++) {
      var photo = photos[i];

      var pageNode = dom.createElement(
        'div', cssx('app-ui-fullview-photos-page'));

      if (photo === photoInView) {
        willTranslate = true;
        scrollLeft = i * this.getWidth();
        selectedPageNode = pageNode;
      }

      // Hack: Expando.
      pageNode._uri = photo.uri;

      this._body.appendChild(pageNode);
      this.getNodeTappable().addTarget(pageNode);
    }

    if (this._scrollable) {
      this._scrollable.scrollTo(scrollLeft, 0);
    }

    if (!selectedPageNode) {
      if (__DEV__) {
        throw new Error('selectedPageNode not found');
      }
      this._onTranslateComplete();
      return;
    }

    if (photoInView.naturalWidth) {
      this._translateAlbumPhotoIntoView(
        selectedPageNode,
        photoInView.getNode(),
        photoInView.naturalWidth,
        photoInView.naturalHeight
      );
    } else {
      var img = new Image();
      this.getEvents().listen(img, 'load', function(event) {
        this._translateAlbumPhotoIntoView(
          selectedPageNode,
          photoInView.getNode(),
          img.naturalWidth,
          img.naturalHeight
        );
        img = null;
      });
      img.src = photoInView.uri;
    }
  },

  _translateAlbumPhotoIntoView: function(pageNode, photoNode, naturalWidth,
                                         naturalHeight) {
    var photoRect = photoNode.getBoundingClientRect();
    var imageNode =
      dom.createElement('div', cssx('app-ui-fullview-photos-image'));
    var pageRect = pageNode.getBoundingClientRect();
    var scale = photoNode.offsetWidth / photoRect.width;

    var imageNodeStyle = imageNode.style;
    var photoStyle = photoNode.style;
    imageNodeStyle.backgroundImage = photoStyle.backgroundImage;
    imageNodeStyle.backgroundSize = photoStyle.backgroundSize;
    imageNodeStyle.width = ~~(scale * photoRect.width) + 'px';
    imageNodeStyle.height = ~~ (scale * photoRect.height) + 'px';
    imageNodeStyle.left = ~~(scale * (photoRect.left - pageRect.left)) + 'px';
    imageNodeStyle.top = ~~(scale * (photoRect.top - pageRect.top)) + 'px';
    pageNode.appendChild(imageNode);

    var ratio = naturalWidth / naturalHeight;

    var w0 = parseInt(imageNodeStyle.width, 10);
    var w1 = pageNode.offsetWidth;
    var dw = w1 - w0;

    var h0 = parseInt(imageNodeStyle.height, 10);
    var h1 = w1 / ratio;
    var dh = h1 - h0;

    var x0 = parseInt(imageNodeStyle.left, 10);
    var x1 = 0;
    var dx = x1 - x0;

    var y0 = parseInt(imageNodeStyle.top, 10);
    var y1 = (pageNode.offsetHeight - h1) / 2;
    var dy = y1 - y0;

    this._animator = new Animator();

    var step = function(value) {
      imageNodeStyle.width = ~~(value * dw + w0) + 'px';
      imageNodeStyle.height = ~~(value * dh + h0) + 'px';
      imageNodeStyle.left = ~~(value * dx + x0) + 'px';
      imageNodeStyle.top = ~~(value * dy + y0) + 'px';
    };

    var complete = this.bind(function() {
      imageNodeStyle.witdh = '100%';
      this._onTranslateComplete();
    });

    this._animator.start(
      step, Functions.VALUE_TRUE, complete, 350);
  },

  _onTranslateComplete: function() {
    Class.dispose(this._animator);

    this.getEvents().listen(this.getNodeTappable(), 'tap', this._onTap);

    if (this._scrollable) {
      this.getEvents().listen(
        this._scrollable, 'scrollstart', this._showMoreImages);
      this.getEvents().listen(
        this._scrollable, 'scrollend', this._showMoreImages);
    }
  },

  _showMoreImages: function() {
    var idx = this._scrollable.getScrollPageIndex();
    var pageNodes = this._body.childNodes;
    this._showImage(pageNodes[idx - 1]);
    this._showImage(pageNodes[idx]);
    this._showImage(pageNodes[idx + 1]);
  },

  _showImage: function(pageNode) {
    if (!pageNode || pageNode.firstChild) {
      return;
    }

    var imageNode = dom.createElement(
      'div', cssx('app-ui-fullview-photos-image'));

    pageNode.appendChild(imageNode);
    new Imageable(imageNode, pageNode._uri, Imageable.RESIZE_MODE_USE_WIDTH);
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