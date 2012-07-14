/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var Input = require('app/ui/story/input').Input;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Feedbacks = Class.create(BaseUI, {
  /**
   * @param {string} feedbackID
   */
  main: function(feedbackID) {
    this._feedbackID = feedbackID;
    this._input = this.appendChild(new Input());
  },

  /** @override */
  createNode: function() {
    return dom.createElement('div', cssx('app-ui-story-feedbacks'));
  },

  /** @override */
  onDocumentReady: function() {
    if (this._feedbackID) {
      FBData.getFeedbacks(this._feedbackID, 20, null, true).addCallback(
        this.bind(this._onFeedbacksReady)
      );
    } else {
      this._input.render(this.getNode());
    }
  },

  /**
   * @param {Object} data
   */
  _onFeedbacksReady: function(data) {
    var comments = objects.getValueByName(
      'comments.nodes', data[this._feedbackID]);

    if (lang.isArray(comments) && comments.length) {
      var fragment = dom.createDocumentFragment();
      for (var i = 0, comment; comment = comments[i]; i++) {
        fragment.appendChild(this._createCommentRow(comment));
      }
      this.getNode().appendChild(fragment);
    } else {
      if (__DEV__) {
        console.info('No feedback for UFI.',
          'feedbackID = ', this._feedbackID,
          'data = ', data,
          'this._data = ', this._data
        );
      }
    }
    this._input.render(this.getNode());
    this.dispatchEvent('reflow', null, true);
  },

  /**
   * @param {Object} data
   */
  _createCommentRow: function(data) {
    var name = objects.getValueByName('author.name', data);
    var src = objects.getValueByName('author.profile_picture.uri', data);
    var text = objects.getValueByName('body.text', data);
    var node = dom.createElement('div', cssx('app-ui-story-feedbacks-row'),
      ['div', cssx('app-ui-story-feedbacks-row-pix')],
      ['div', cssx('app-ui-story-feedbacks-row-body'),
        ['div', cssx('app-ui-story-feedbacks-row-name'), name],
        ['div', cssx('app-ui-story-feedbacks-row-text'), text]
      ]
    );
    this.renderImage(node.firstChild, src);
    return node;
  },

  _feedbackID: '',
  _input: null
});

exports.Feedbacks = Feedbacks;