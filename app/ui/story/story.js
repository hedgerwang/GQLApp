/**
 * @fileOverview
 * @author Hedger Wang
 */

var Album = require('app/ui/story/album').Album;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Photo = require('app/ui/story/photo').Photo;
var UFI = require('app/ui/story/ufi').UFI;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Story = Class.create(BaseUI, {
  /**
   * @param {Object} data
   */
  main: function(data) {
    this._data = data;
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
    var ufi = this.appendChild(new UFI(this._data.id));
    ufi.render(this._footer);
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
   * @type {BaseUI}
   */
  _images: null,
  _data: null,
  _footer: null
});


exports.Story = Story;