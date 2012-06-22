/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var CoverPhoto = require('app/ui/scene/profile/coverphoto').CoverPhoto;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var JewelBar = require('app/ui/jewelbar').JewelBar;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var ProfileTabs = require('app/ui/scene/profile/profiletabs').ProfileTabs;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Tappable = require('jog/behavior/tappable').Tappable;
var Timeline = require('app/ui/scene/profile/timeline').Timeline;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var Profile = Class.create(Scene, {
  /**
   * @param {number=} opt_uid
   * @param {boolean=} opt_showBackButton
   * @override
   */
  main: function(opt_uid, opt_showBackButton) {
    this._jewelBar = this.appendChild(new JewelBar(opt_showBackButton));
    this._scrollList = this.appendChild(new ScrollList());
    this._loading = this.appendChild(new LoadingIndicator());
    this._uid = opt_uid;
  },

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-profile'));
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    this._jewelBar.render(this.getNode());
    this._scrollList.render(this.getNode());
    this._loading.render(this.getNode());
    this._loading.center();
    this._onLoad();
  },

  _onLoad: function(evt) {
    this._scrollList.reflow();
    this._onLoadCount++;

    this.getEvents().unlistenAll();

    switch (this._onLoadCount) {
      case 1:
        var coverPhoto = new CoverPhoto(this._uid);
        coverPhoto.getNode().style.display = 'none';
        this.getEvents().listen(coverPhoto, 'load', this.bind(function(evt) {
          this._loading.dismiss().addCallback(this.bind(function() {
            coverPhoto.getNode().style.display = '';
            coverPhoto = null;
            this._onLoad();
          }));
        }));
        this._scrollList.addContent(coverPhoto);
        break;

      case 2:
        var profileTabs = new ProfileTabs(this._uid);
        this.getEvents().listen(profileTabs, 'load', this._onLoad);
        this._scrollList.addContent(profileTabs);
        break;

      case 3:
        var timeline = new Timeline(this._uid);
        this.getEvents().listen(timeline, 'load', this._onLoad);
        this._scrollList.addContent(timeline);
        break;
    }
  },

  _jewelBar: null,
  _scrollList:null,
  _loading:null,
  _onLoadCount: 0,
  _uid: 0
});

exports.Profile = Profile;