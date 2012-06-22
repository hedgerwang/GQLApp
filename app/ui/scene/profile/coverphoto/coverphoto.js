/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var objects = require('jog/objects').objects;

var CoverPhoto = Class.create(BaseUI, {
  /** @override */
  main: function(uid) {
    this._uid = uid;
  },

  createNode: function() {
    return dom.createElement('div', cssx('app-ui-scene-profile-cover-photo'));
  },

  /** @override */
  dispose: function() {

  },

  onDocumentReady:function() {
    FBData.getLargeProfile(this._uid, true).
      addCallback(this.bind(this._onQueryBack));
  },

  _onQueryBack: function(data) {
    if (!this._uid) {
      this._uid = data.userid;
    }
    this.getNode().appendChild(this._createProfileNode(data[this._uid]));
    this.dispatchEvent('load', null, true);
  },

  /**
   * @param {Object} data
   * @return {Element}
   */
  _createProfileNode: function(data) {
    var node = dom.createElement(
      'div', cssx('app-ui-scene-profile-cover-photo_body'));

    var coverUri = objects.getValueByName(
      'albums.nodes.0.cover_photo.image.uri', data);

    if (coverUri) {
      var cover = dom.createElement(
        'div', cssx('app-ui-scene-profile-cover-photo_image'));
      new Imageable(cover, coverUri);
      node.appendChild(cover);
    }

    var profileUri = objects.getValueByName('profile_picture.uri', data);

    if (profileUri) {
      var img = dom.createElement(
        'div', cssx('app-ui-scene-profile-cover-photo_profile-pix'));
      new Imageable(img, profileUri);

      node.appendChild(img);
    }

    node.appendChild(dom.createElement(
      'div', cssx('app-ui-scene-profile-cover-photo_profile-name'), data.name));

    return node;
  },

  _uid: 0
});

exports.CoverPhoto = CoverPhoto;