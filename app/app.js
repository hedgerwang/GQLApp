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
var TouchHelper = require('jog/touchhelper').TouchHelper;


var App = Class.create(null, {
  main: function() {
    this._chrome = new Chrome();
    this._coverScene = new Cover();
    this._mainScene = new NewsFeed();
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

  dispose: function() {
    Class.dispose(this._events);
    Class.dispose(this._sideMenu);
    Class.dispose(this._mainScene);
    Class.dispose(this._chrome);
  },

  _start: function() {
    var node = this._chrome.getNode();
    this._mainScene.render(node);
    this._sideMenu.render(node);
    this._coverScene.faceOut(450, true);
    this._bindEvents();
  },

  _bindEvents: function() {
    this._events.listen(
      this._mainScene, EventType.JEWEL_SIDE_MENU_TOGGLE, this._toggleSideMenu);
  },

  _toggleSideMenu: function() {
    switch (this._sideMenuMode) {
      case 0:
        this._hideMainScene();
        break;

      case 1:
        this._showMainScene();
        break;
    }
  },

  _hideMainScene: function() {
    this._sideMenuMode = 1;

    this._mainScene.translateXTo(this._sideMenu.getNode().offsetWidth).
      addCallback(this.bind(
      function() {
        dom.addClassName(
          this._mainScene.getNode(),
          cssx('app-main_scene_opened'));
      }));

    this._events.listen(
      this._mainScene.getNode(),
      TouchHelper.EVT_TOUCHSTART,
      this._showMainScene,
      true);
  },

  /**
   *
   * @param {Event} opt_event
   */
  _showMainScene: function(opt_event) {
    if (opt_event) {
      opt_event.preventDefault();
    }

    this._sideMenuMode = 0;
    this._mainScene.translateXTo(0);

    dom.removeClassName(
      this._mainScene.getNode(),
      cssx('app-main_scene_opened'));

    this._events.unlisten(
      this._mainScene.getNode(),
      TouchHelper.EVT_TOUCHSTART,
      this._showMainScene,
      true);
  },

  /**
   * @type {BaseUI}
   */
  _chrome: null,

  /**
   * @type {Scene}
   */
  _coverScene: null,

  /**
   * @type {Scene}
   */
  _mainScene: null,

  /**
   * 0 - close
   * 1 - open
   * 2 - fullsreen
   * @type {number}
   */
  _sideMenuMode: 0
});

exports.App = App;

window.addEventListener('DOMContentLoaded', function() {
  var app = new App();
  // app.xmain();
});