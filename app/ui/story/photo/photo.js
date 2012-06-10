/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Photo = Class.create(BaseUI, {
  /**
   * @param {Object} image
   */
  main: function(image) {
    this._image = image;
  },

  /** @override */
  createNode: function() {
    var image = this._image;
    delete this._image;

    if (image && image.uri && /\.jpg$/.test(image.uri)) {
      if (__DEV__) {
        if (!image.width || !image.height) {
          console.warn('Image width or height appears 0. ' +
            'Maybe this image is too big?',
            image.uri,
            image);
        }
      }
      var node = dom.createElement('div', {
        className: cssx('app-ui-story-photo')
      });

      this.uri = image.uri;
      new Imageable(node, image.uri);
      return node;
    }

    if (__DEV__) {
      throw new Error('Invalid photo data:' + JSON.stringify(image));
    }

    return dom.createElement('div');
  },

  onDocumentReady: function() {
    var tappable = this.getNodeTappable();
    tappable.addTarget(this.getNode());
    this.getEvents().listen(tappable, 'tap', this._onTap);
  },

  _onTap: function() {
    this.dispatchEvent(EventType.STORY_PHOTO_TAP, this.uri, true);
  },

  /**
   * @type {string}
   */
  uri: null,

  /**
   * @type {Object}
   */
  _image: null
});

exports.Photo = Photo;