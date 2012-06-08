/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var JewelBar = require('app/ui/jewelbar').JewelBar;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Story = require('app/ui/story').Story;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Profile = Class.create(Scene, {
  /**
   * @param {number=} opt_uid
   * @param {boolean=} opt_showBackButton
   * @override
   */
  main: function(opt_uid, opt_showBackButton) {
    this._jewel = new JewelBar(opt_showBackButton);
    this._scrollList = new ScrollList();
    this._loading = new LoadingIndicator();
    this._uid = opt_uid;
    this.appendChild(this._jewel);
    this.appendChild(this._scrollList);
    this.appendChild(this._loading);
  },
  /** @override */
  dispose: function() {
    Class.dispose(this._tappable);
  },

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-profile'));
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    this._jewel.render(this.getNode());
    this._loading.render(this.getNode());
    this._loading.center();
    this._query();
  },


  _query: function() {
    FBData.getLargeProfile(this._uid, true).addCallback(
      this.callAfter(function(data) {
        this._loading.dispose();
        if (!this._uid) {
          this._uid = data.userid;
        }
        this.getNode().appendChild(this._createProfileNode(data[this._uid]));
      }), 1200);
  },

  /**
   * @param {Object} data
   * @return {Element}
   */
  _createProfileNode: function(data) {
    var node = dom.createElement(
      'div', cssx('app-ui-scene-profile_content'));


    var coverUri = objects.getValueByName(
      'albums.nodes.0.cover_photo.image.uri', data);

    if (coverUri) {
      var cover = dom.createElement(
        'div', cssx('app-ui-scene-profile_cover'));
      new Imageable(cover, coverUri);
      node.appendChild(cover);
    }

    var profileUri = objects.getValueByName('profile_picture.uri', data);

    if (profileUri) {
      var img = dom.createElement(
        'div', cssx('app-ui-scene-profile_content-img'), name);
      new Imageable(img, profileUri);

      node.appendChild(img);
    }

    node.appendChild(dom.createElement(
      'div', cssx('app-ui-scene-profile_content-name'), data.name));

    if (data.birthday) {
      node.appendChild(dom.createElement(
        'div', null, 'Born at ' + data.birthday));
    }
    return node;
  }
});

exports.Profile = Profile;