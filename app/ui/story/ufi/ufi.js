/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var Tappable = require('jog/behavior/tappable').Tappable;
var asserts = require('jog/asserts').asserts;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var objects = require('jog/objects').objects;

var UFI = Class.create(BaseUI, {
  /**
   * @param {Object} storyData
   */
  main: function(storyData) {
    asserts.notNull(storyData, 'UFI data must not be null');
    this._data = storyData;
  },

  /** @override */
  createNode: function() {
    var data = this._data;

    var node = dom.createElement('div', cssx('app-ui-story-ufi'),
      ['div', cssx('app-ui-story-ufi-start'), 'Like \u00b7 Comment'],
      ['div', cssx('app-ui-story-ufi-end')]
    );

    var endNode = node.lastChild;
    var iconNode;
    var comments = objects.getValueByName('feedback.comments.count', data);
    var likes = objects.getValueByName('feedback.likers.count', data);

    if (likes) {
      iconNode = dom.createElement('i', cssx('app-ui-story-ufi-icon-likes'));
      endNode.appendChild(iconNode);
      endNode.appendChild(document.createTextNode(likes));
      this.renderImage(iconNode, '/images/likes.png');
    }

    if (comments) {
      iconNode = dom.createElement('i', cssx('app-ui-story-ufi-icon-comments'));
      endNode.appendChild(iconNode);
      endNode.appendChild(document.createTextNode(comments));
      this.renderImage(iconNode, '/images/comments.png');
    }

    return node;
  },

  onDocumentReady: function() {
    this.getNodeTappable().addTarget(this.getNode());
    this.getEvents().listen(this.getNodeTappable(), 'tapclick', this._onTap);
  },

  _onTap: function() {
    this.dispatchEvent(EventType.VIEW_STORY, this._data, true);
  },

  _data: null
});

exports.UFI = UFI;