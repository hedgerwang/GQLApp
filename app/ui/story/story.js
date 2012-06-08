/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
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

  dispose: function() {
    Class.dispose(this._imageable);
    Class.dispose(this._scrollableAlbum);
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

    if (__DEV__ && !lang.isArray(subattachments) || subattachments.length < 2) {
      // Do not show stories that has no attachments.
      // return dom.createElement('div', null, '');
    }

    var header = this._createHeader(actor, data);
    var body = this._createBody(message);
    var images = this._createImages(subattachments, data);

    if (images) {
      body.appendChild(images);
    }

    var footer = this._createFooter();

    return dom.createElement('div', cssx('app-ui-story'),
      header, body, footer);
  },

  /**
   * @param {Object} actor
   * @param {Object} data
   * @reutrn {Element}
   */
  _createHeader: function(actor, data) {
    var actorPix = objects.getValueByName('profile_picture.uri', actor);

    return dom.createElement('div', cssx('app-ui-story-header'),
      ['div', {
        className: cssx('app-ui-story-profile-pix'),
        style: 'background-image:url(' + actorPix + ')'
      }],
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
    return dom.createElement('div', cssx('app-ui-story-footer'),
      'Like . Comment'
    );
  },


  /**
   * @param {Array} subattachments
   * @param {Object} data
   * @return {Node}
   */
  _createImages: function(subattachments, data) {
    var imagesAlbum;
    var imagesAlbumBody;
    var imagesCount = 0;

    if (lang.isArray(subattachments) && subattachments.length > 1) {
      for (var i = 0, j = subattachments.length; i < j; i++) {
        var subImage = objects.getValueByName('media.image', subattachments[i]);
        if (!subImage || !subImage.uri || !subImage.width) {
          continue;
        }
        if (imagesCount === 0) {
          imagesAlbumBody = dom.createElement(
            'div', cssx('app-ui-story-album-body'));

          imagesAlbum = dom.createElement(
            'div', cssx('app-ui-story-album'), imagesAlbumBody);
        }
        imagesAlbumBody.appendChild(this._createImage(subImage));
        imagesCount++;
        if (imagesCount > 4) {
          // Too many photos.
          break;
        }
      }
    }

    if (imagesAlbum) {
      this._scrollableAlbum = new Scrollable(
        imagesAlbum,
        {direction:'horizontal', paging: true}
      );
      return imagesAlbum;
    } else {
      var image = objects.getValueByName('attachments.0.media.image', data);
      return this._createImage(image);
    }
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
   * @param {Image} image
   * @return {Node}
   */
  _createImage: function(image) {
    if (image && image.width && image.uri && /\.jpg$/.test(image.uri)) {
      var node = dom.createElement('div', {
        className: cssx('app-ui-story-img')
      });

      this._imageable = new Imageable(node, image.uri);
      return node;
    }
    return null;
  },

  /**
   * @type {Imageable}
   */
  _imageable: null,

  /**
   * @type {Scrollable}
   */
  _scrollableAlbum: null,

  _data: null
});


exports.Story = Story;