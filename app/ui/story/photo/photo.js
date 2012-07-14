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
   * @param {Object=} feedback
   */
  main: function(image, feedback) {
    this.feedbackID = feedback ? feedback.id : null;
    this.uri = image ? image.uri : null;
  },

  /** @override */
  createNode: function() {
    if (this.uri) {
      var node = dom.createElement('div', {
        className: cssx('app-ui-story-photo')
      });
      return node;
    }

    if (__DEV__) {
      throw new Error('Photo does not have valid uri');
    }

    return dom.createElement('div');
  },

  /** @override */
  onDocumentReady: function() {
    if (this.uri) {
      var imageable = this.renderImage(this.getNode(), this.uri);
      imageable.addEventListener('load', this.bind(function(event) {
        this.naturalWidth = event.target.naturalWidth;
        this.naturalHeight = event.target.naturalHeight;
      }));
    }
  },

  /**
   * @type {string}
   */
  uri: null,

  /**
   * @type {string}
   */
  feedbackID: '',
  naturalWidth: 0,
  naturalHeight: 0
});

exports.Photo = Photo;