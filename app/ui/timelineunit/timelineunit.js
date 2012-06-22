/**
 * @fileOverview
 * @author Hedger Wang
 */

var Album = require('app/ui/story/album').Album;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Deferred = require('jog/deferred').Deferred;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var Photo = require('app/ui/story/photo').Photo;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var TimelineUnit = Class.create(BaseUI, {
  /**
   * @param {Object} data
   */
  main: function(data) {
    this._data = data;
  },

  /** @override */
  createNode: function() {
    var data = this._data;

    var message = objects.getValueByName('story.message.text', data) ||
      objects.getValueByName('story.attachments.0.media.message.text', data);

    var image = objects.getValueByName(
      'story.attachments.0.media.image', data);

    var actor = objects.getValueByName('story.actors.0', data);

    if (!message && !image) {
      return dom.createElement('empty');
    }

    var body = dom.createElement('div', cssx('app-ui-timeline-unit_body'));

    if (message) {
      body.appendChild(document.createTextNode(message));
    }

    if (image) {
      var album = new Album();
      album.addPhoto(new Photo(image));
      album.render(body);
      this.appendChild(album);
    }

    return dom.createElement('div', cssx('app-ui-timeline-unit'),
      dom.createElement('div', cssx('app-ui-timeline-unit_border'),
        actor ? this._createHeader(actor, data) : '',
        body,
        this._createFooter()
      )
    );
  },

  /**
   * @param {Object} actor
   * @param {Object} data
   * @reutrn {Element}
   */
  _createHeader: function(actor, data) {
    var uri = objects.getValueByName('profile_picture.uri', actor);
    var pix = dom.createElement(
      'div', cssx('app-ui-timeline-unit_profile-pix'));
    new Imageable(pix, uri);

    return dom.createElement('div', cssx('app-ui-timeline-unit_header'),
      pix,
      ['div', cssx('app-ui-timeline-unit_title'),
        ['span', {profile_id: actor.id}, actor.name]
      ]
    );
  },

  /**
   * @return {Node}
   */
  _createFooter: function() {
    return dom.createElement('div', cssx('app-ui-timeline-unit_footer'),
      'Like . Comment'
    );
  },

  _data: null
});

exports.TimelineUnit = TimelineUnit;