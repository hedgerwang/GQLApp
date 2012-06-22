/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Deferred = require('jog/deferred').Deferred;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var ProfileTabs = Class.create(BaseUI, {
  /** @override */
  main: function(uid) {
    this._uid = uid;
  },

  /** @override */
  createNode: function() {
    this._body = dom.createElement(
      'div', cssx('app-ui-scene-profile-profile-tabs_body'));

    return dom.createElement(
      'div', cssx('app-ui-scene-profile-profile-tabs'), this._body);
  },

  /** @override */
  onDocumentReady: function() {
    this._scrollable = new Scrollable(
      this.getNode(),
      Scroller.OPTIONS_HORIZONTAL);

    this._renderFriendsTab().
      then(this.bind(this._renderAlbums));
  },

  /**
   * @return {Deferred}
   */
  _renderFriendsTab: function() {
    var df = new Deferred();
    FBData.getLargeProfile(this._uid, null, true).addCallback(
      this.bind(
        function(data) {
          if (!this._uid) {
            this._uid = data.userid;
          }
          var friends = objects.getValueByName(
            'mutual_friends.nodes', data[this._uid]);

          if (lang.isArray(friends) && friends.length) {
            var fragment = dom.createDocumentFragment();
            for (var i = 0, friend; friend = friends[i]; i++) {
              var facePile = dom.createElement(
                'div', cssx('app-ui-scene-profile-profile-tabs_facepile'));

              fragment.appendChild(facePile);

              new Imageable(
                facePile,
                objects.getValueByName('profile_picture.uri', friend));
            }
            this._renderTab('Friends', fragment);
          }
          df.succeed(true);
        }));
    return df;
  },

  /**
   * @return {Deferred}
   */
  _renderAlbums: function() {
    var df = new Deferred();
    FBData.getAlbums(this._uid, 6, null, true).addCallback(
      this.bind(function(data) {
        var albums = objects.getValueByName('albums.nodes', data[this._uid]);
        if (lang.isArray(albums) && albums.length) {
          var fragment = dom.createDocumentFragment();
          for (var i = 0, album; album = albums[i]; i++) {
            var facePile = dom.createElement(
              'div', cssx('app-ui-scene-profile-profile-tabs_facepile'));

            fragment.appendChild(facePile);

            new Imageable(
              facePile,
              objects.getValueByName('cover_photo.image.uri', album));
          }
          this._renderTab('Albums', fragment);
        }
      })
    );
    return df;
  },

  /**
   *
   * @param {string} label
   * @param {Node} tabContent
   */
  _renderTab: function(label, tabContent) {
    var tab = dom.createElement(
      'div', cssx('app-ui-scene-profile-profile-tabs_tab'),
      ['div', cssx('app-ui-scene-profile-profile-tabs_tab-body'), tabContent],
      ['div', cssx('app-ui-scene-profile-profile-tabs_tab-label'), label]
    );
    this._body.appendChild(tab);
  },

  _uid: 0,
  _body: null
});

exports.ProfileTabs = ProfileTabs;