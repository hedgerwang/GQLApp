/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Imageable = require('jog/behavior/imageable').Imageable;
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
  },

  /** @override */
  createNode: function() {
    var data = this._data;
    var actor = objects.getValueByName('actors.0', data);
    var actorPix = objects.getValueByName('profile_picture.uri', actor);
    var title = objects.getValueByName('title.text', data);
    var image = objects.getValueByName('attachments.0.media.image', data);
    var message = objects.getValueByName('message.text', data) ||
      objects.getValueByName('title.text', data);

    var header = dom.createElement('div', cssx('app-ui-story-header'),
      ['div', {
        className: cssx('app-ui-story-profile-pix'),
        style: 'background-image:url(' + actorPix + ')'
      }],
      ['div', cssx('app-ui-story-title'),
        ['span', {profile_id: actor.id}, actor.name],
        this._createTime(data.creation_time)
      ]
    );

    var body = dom.createElement('div', cssx('app-ui-story-body'), message);
    dom.append(body, this._createImage(image));

    var footer = dom.createElement('div', cssx('app-ui-story-footer'),
      'Like . Comment'
    );

    var node = dom.createElement('div', cssx('app-ui-story'),
      header, body, footer);

    return node;
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
  _data: null
});


exports.Story = Story;