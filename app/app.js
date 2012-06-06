/**
 * @fileOverview
 * @author Hedger Wang
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var Cover = require('app/ui/scene/cover').Cover;
var Events = require('jog/events').Events;
var EventType = require('app/eventtype').EventType;
var NewsFeed = require('app/ui/scene/newsfeed').NewsFeed;
var SideMenu = require('app/ui/scene/sidemenu').SideMenu;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var App = Class.create(null, {
  main: function() {
    this._chrome = new Chrome();
    this._coverScene = new Cover();
    this._newsFeed = new NewsFeed();
    this._sideMenu = new SideMenu();
    this._events = new Events(this);

    // Show the initial blue screen.
    this._coverScene.render(this._chrome.getNode());

    this._coverScene.addEventListener(
      EventType.FB_SESSION_READY,
      this.callAfter(this._start, 600)
    );

    // show the whole chrome.
    this._chrome.render(dom.getDocument().body);
  },

  _start: function() {
    var node = this._chrome.getNode();
    this._newsFeed.render(node);
    this._sideMenu.render(node);
    this._coverScene.faceOut(450, true);
    this._bindEvents();
  },

  _bindEvents: function() {
    this._events.listen(
      this._newsFeed, EventType.JEWEL_SIDE_MENU_TOGGLE, this._toggleSideMenu);
  },

  _toggleSideMenu: function() {
    switch (this._sideMenuMode) {
      case 0:
        this._sideMenuMode = 1;

        this._newsFeed.translateXTo(260).addCallback(
          this.bind(function() {
            dom.addClassName(
              this._newsFeed.getNode(),
              cssx('app-ui-scene-newsfeed_opened'));
          }));

        break;

      case 1:
        this._sideMenuMode = 0;
        this._newsFeed.translateXTo(0);
        dom.removeClassName(
          this._newsFeed.getNode(),
          cssx('app-ui-scene-newsfeed_opened'));
        break;
    }

    console.log(this._newsFeed.getNode().className);
  },

  _chrome: null,
  _coverScene: null,
  _newsFeed: null,
  _sideMenuMode: 0
});

exports.App = App;

window.addEventListener('DOMContentLoaded', function() {
  var app = new App();
  // app.xmain();
});