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
          var debugInfo = [
            'Image width or height appears 0. ' +
              'Maybe this image is too big? ' +
              'This could be resolved by Imageable.',
            image.uri,
            image
          ];
          console.warn(debugInfo);
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

try {

  var context = document.getCSSCanvasContext("2d", "bordershadow", 10, 10);
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 2;
  context.shadowColor = '#000';
  context.fillStyle = '#000';
  context.fillRect(3, 3, 3, 3);
} catch(ex) {
  alert(ex.message);
}
