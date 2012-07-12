/**
 * @fileOverview
 * @author Hedger Wang
 */

var Album = require('app/ui/story/album').Album;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var FBData = require('jog/fbdata').FBData;
var Input = require('app/ui/story/input').Input;
var Photo = require('app/ui/story/photo').Photo;
var UFI = require('app/ui/story/ufi').UFI;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Story = Class.create(BaseUI, {
  /**
   * @param {Object} data
   * @param {number=} opt_option
   */
  main: function(data, opt_option) {
    this._data = data;
    this._option = opt_option;
    this._input = this.appendChild(new Input());
  },

  /** @override */
  createNode: function() {
    var data = this._data;
    var actor = objects.getValueByName('actors.0', data);
    var title = objects.getValueByName('title.text', data);
    var message = objects.getValueByName('message.text', data) ||
      objects.getValueByName('title.text', data);

    var subattachments =
      objects.getValueByName('attachments.0.subattachments', data);

    var header = this._createHeader(actor, data);
    var body = this._createBody(message);
    var images = this._createImages(subattachments, data);

    if (images) {
      this._images = images;
      images.render(body);
    }

    var footer = this._createFooter();

    return dom.createElement('div', cssx('app-ui-story'),
      dom.createElement('div', cssx('app-ui-story-border'),
        header,
        body,
        footer
      )
    );
  },

  /** @override */
  onNodeReady: function() {
    if (this._images) {
      this.appendChild(this._images);
    }

    switch (this._option) {
      case Story.OPTION_FULL_STORY:
        break;

      default:
        var ufi = this.appendChild(new UFI(this._data));
        ufi.render(this._footer);
        break;
    }
  },

  onDocumentReady: function() {
    switch (this._option) {
      case Story.OPTION_FULL_STORY:
        this._feedbackID = objects.getValueByName('feedback.id', this._data);
        if (this._feedbackID) {
          FBData.getFeedbacks(this._feedbackID, 20, null, true).addCallback(
            this.bind(this._onFeedbacksReady)
          );
        } else {
          this._input.render(this._footer);
        }
        break;
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
      this._footer.appendChild(fragment);
    } else {
      if (__DEV__) {
        console.info('No feedback for UFI.',
          'feedbackID = ', this._feedbackID,
          'data = ', data,
          'this._data = ', this._data
        );
      }
    }
    this._input.render(this._footer);
    this.dispatchEvent('reflow', null, true);
  },

  /**
   * @param {Object} actor
   * @param {Object} data
   * @reutrn {Element}
   */
  _createHeader: function(actor, data) {
    var uri = objects.getValueByName('profile_picture.uri', actor);
    var pix = dom.createElement('div', cssx('app-ui-story-profile-pix'));
    this.renderImage(pix, uri);

    return dom.createElement('div', cssx('app-ui-story-header'),
      pix,
      ['div', cssx('app-ui-story-title'),
        ['span', {profile_id: actor.id}, actor.name],
        this._createTime(data.creation_time)
      ]
    );
  },

  /**
   * @param {string} message
   * @return {Node}
   */
  _createBody: function(message, data) {
    return dom.createElement('div', cssx('app-ui-story-body'), message);
  },

  /**
   * @return {Node}
   */
  _createFooter: function() {
    this._footer = dom.createElement('div', cssx('app-ui-story-footer'));
    return this._footer;
  },


  /**
   * @param {Array} subAttachments
   * @param {Object} data
   * @return {BaseUI}
   */
  _createImages: function(subAttachments, data) {
    var album = new Album();

    if (lang.isArray(subAttachments) && subAttachments.length > 1) {

      for (var i = 0, j = subAttachments.length; i < j; i++) {
        var subImage = objects.getValueByName('media.image', subAttachments[i]);
        album.addPhoto(new Photo(subImage));
      }
      return album;
    }

    var image = objects.getValueByName('attachments.0.media.image', data);
    if (image) {
      album.addPhoto(new Photo(image));
      return album;
    }

    return null;
  },

  /**
   * @param {number} unixTime
   * @return {Node}
   */
  _createTime: function(unixTime) {
    if (unixTime) {
      var jsTime = unixTime * 1000;
      var diff = Date.now() - jsTime;
      if (isNaN(diff)) {
        return null;
      }

      var text;
      if (diff < 5 * 60 * 1000) {
        text = '5 minutes ago'
      } else if (diff < 15 * 60 * 1000) {
        text = '15 minutes ago'
      } else if (diff < 30 * 60 * 1000) {
        text = '30 minutes ago'
      } else if (diff < 60 * 60 * 1000) {
        text = '59 minutes ago'
      } else {
        text = Math.floor(diff / (60 * 60 * 1000)) + ' hours ago';
      }
      return dom.createElement('div', cssx('app-ui-story-time'), text);
    }
    return null;
  },

  /**
   * @param {Object} data
   */
  _createCommentRow: function(data) {
    var name = objects.getValueByName('author.name', data);
    var src = objects.getValueByName('author.profile_picture.uri', data);
    var text = objects.getValueByName('body.text', data);
    var node = dom.createElement('div', cssx('app-ui-story_comment-row'),
      ['div', cssx('app-ui-story_comment-row-pix')],
      ['div', cssx('app-ui-story_comment-row-body'),
        ['div', cssx('app-ui-story_comment-row-name'), name],
        ['div', cssx('app-ui-story_comment-row-text'), text]
      ]
    );
    this.renderImage(node.firstChild, src);
    return node;
  },

  /**
   * @type {BaseUI}
   */
  _images: null,
  _data: null,
  _footer: null,
  _option: false
});

Story.OPTION_FULL_STORY = 1;

exports.Story = Story;