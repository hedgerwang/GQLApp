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
    if (image && image.uri) {
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

      var imageable = new Imageable(node, image.uri);
      imageable.addEventListener('load', this.bind(function(event) {
        this.naturalWidth = event.target.naturalWidth;
        this.naturalHeight = event.target.naturalHeight;
      }));

      return node;
    }

    if (__DEV__) {
      throw new Error('Invalid photo data:' + JSON.stringify(image));
    }

    return dom.createElement('div');
  },

  /**
   * @type {string}
   */
  uri: null,

  naturalWidth: 0,
  naturalHeight: 0,

  /**
   * @type {Object}
   */
  _image: null
});

exports.Photo = Photo;