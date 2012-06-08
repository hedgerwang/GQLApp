/**
 * @fileOverview
 * @author Hedger Wang
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var Cover = require('app/ui/scene/cover').Cover;
var EventType = require('app/eventtype').EventType;
var Events = require('jog/events').Events;
var NewsFeed = require('app/ui/scene/newsfeed').NewsFeed;
var Profile = require('app/ui/scene/profile').Profile;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var SideMenu = require('app/ui/scene/sidemenu').SideMenu;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var App = Class.create(null, {

  main: function() {
    this._chrome = new Chrome();
    this._coverScene = new Cover();
    this._sideMenu = new SideMenu();
    this._events = new Events(this);

    // Show the initial blue screen.
    this._chrome.appendChild(this._coverScene, true);

    this._coverScene.addEventListener(
      EventType.FB_SESSION_READY,
      this.callAfter(this._start, 600)
    );

    // show the whole chro me.
    this._chrome.render(dom.getDocument().body);
  },

  dispose: function() {
    var currScene = this._activeScene;

    while (currScene) {
      var prevScene = currScene._prevScene;
      Class.dispose(currScene);
      currScene = prevScene;
    }

    this._disableSceneScroller();
    Class.dispose(this._events);
    Class.dispose(this._sideMenu);
    Class.dispose(this._chrome);
  },

  _start: function() {
    this._addScene(new NewsFeed(0, false));
    this._chrome.appendChild(this._sideMenu, true);
    this._coverScene.fadeOut(450, true);
    this._bindEvents();
  },

  _bindEvents: function() {
    var events = this._events;

    events.listen(
      this._chrome,
      EventType.JEWELBAR_SIDE_MENU_TOGGLE,
      this._toggleSideMenu);

    events.listen(
      this._chrome,
      EventType.JEWELBAR_BACK,
      this._onBackScene);

    events.listen(
      this._chrome,
      EventType.VIEW_PROFILE,
      this._onViewProfile);

    events.listen(
      this._sideMenu,
      EventType.SIDE_MENU_PROFILE,
      this._onViewProfile);

    events.listen(
      this._chrome,
      EventType.SEARCH_BAR_ON_SEARCH_SELECT,
      this._onViewProfile);

    events.listen(
      this._sideMenu,
      EventType.SIDE_MENU_HOME,
      this._onViewHome);

    events.listen(
      this._sideMenu,
      EventType.SEARCH_BAR_ON_SEARCH_START,
      this._onSearchStart);

    events.listen(
      this._sideMenu,
      EventType.SEARCH_BAR_ON_SEARCH_END,
      this._onSearchEnd);
  },

  /**
   * @param {Event} event
   */
  _onBackScene: function(event) {
    this._removeScene(this._activeScene);
  },

  /**
   * @param {Event} event
   */
  _onSearchStart: function(event) {
    dom.addClassName(this._sideMenu.getNode(),
      cssx('app-ui-scene-sidemenu_onsearch'));

    this._showSideMenu();
  },

  /**
   * @param {Event} event
   */
  _onViewProfile: function(event) {
    var uid = event.data;

    switch (event.type) {
      case  EventType.SIDE_MENU_PROFILE:
      case  EventType.SEARCH_BAR_ON_SEARCH_SELECT:
        this._hideSideMenu().addCallback(this.bind(function() {
          this._clearScenes();
          this._addScene(new Profile(uid));
          uid = null;
        }));
        return;

      default:
        this._addScene(new Profile(uid, true));
        break;

    }
  },

  _onViewHome: function() {
    this._hideSideMenu().addCallback(this.bind(function() {
      this._clearScenes();
      this._addScene(new NewsFeed(0));
    }));
  },

  _clearScenes: function() {
    var scene = this._activeScene;
    while (scene) {
      var nextScene = scene._nextScene;
      scene.dispose();
      scene = nextScene;
    }
    delete this._activeScene;
  },

  /**
   * @param {Scene} scene
   */
  _addScene: function(scene) {
    if (!this._activeScene) {
      this._activeScene = scene;
      this._chrome.appendChild(this._activeScene, true);
      this._disableSceneScroller();
      this._enableSceneScroller();
      return;
    }

    this._disableSceneScroller();
    this._activeScene.setDisabled(true);

    this._hideSideMenu().then(this.bind(function() {
      var currScene = this._activeScene;

      var newScene = scene;
      scene = null;

      // TODO(hedger): Use LinkedList?
      // HACK. Expando.
      currScene._nextScene = newScene;
      newScene._prevScene = currScene;

      this._chrome.appendChild(newScene);
      this._activeScene = newScene;

      return newScene.translateXTo(this._chrome.getWidth(), 350);
    })).then(this.bind(function(nextScene) {
      nextScene.render(this._chrome.getNode());
      return nextScene.translateXTo(0, 350);
    })).addCallback(this.bind(function(nextScene) {
      nextScene._prevScene.setHidden(true);
      this._enableSceneScroller();
    }));
  },

  /**
   *
   * @param {Scene} targetScene
   */
  _removeScene: function(targetScene) {
    // CLear all scenes after targetScene.
    var scene = targetScene._nextScene;

    if (scene) {
      while (scene) {
        var nextScene = scene._nextScene;
        scene.dispose();
        scene = nextScene;
      }
    }

    var prevScene = targetScene._prevScene;
    if (__DEV__) {
      if (!prevScene) {
        throw new Error('The first scene should not be removed');
      }
    }

    this._disableSceneScroller();
    prevScene.setHidden(false).setDisabled(true);
    this._activeScene = prevScene;
    delete this._activeScene._nextScene;

    targetScene.setDisabled(true).
      translateXTo(this._chrome.getWidth() - 50, 600).addCallback(
      this.bind(function(scene) {
        scene.dispose();
        this._activeScene.setDisabled(false);
        this._enableSceneScroller();
      }));
  },

  /**
   * @param {Event} event
   */
  _onSearchEnd: function(event) {
    dom.removeClassName(this._sideMenu.getNode(),
      cssx('app-ui-scene-sidemenu_onsearch'));

    this._showSideMenu();
  },

  _toggleSideMenu: function() {
    switch (this._sideMenuMode) {
      case 1:
      case 2:
        this._hideSideMenu();
        break;

      case 0:
        this._showSideMenu();
        break;
    }
  },

  /**
   * @return {Deferred}
   */
  _showSideMenu: function() {
    this._disableSceneScroller();

    this._sideMenuMode++;

    var df = this._activeScene.translateXTo(this._sideMenu.getWidth(), 350);

    switch (this._sideMenuMode) {
      case 1:
        df.addCallback(this.bind(
          function() {
            if (this._sideMenuMode == 1) {
              dom.addClassName(
                this._activeScene.getNode(),
                cssx('app-scene-with-shadow'));
            }
          }));

        this._events.listen(
          this._activeScene.getNode(),
          TouchHelper.EVT_TOUCHSTART,
          this._hideSideMenu,
          null,
          true);

        break;

      case 2:
        dom.removeClassName(
          this._activeScene.getNode(),
          cssx('app-scene-with-shadow'));
        break;

      case 3:
        this._sideMenuMode = 1;
        dom.addClassName(
          this._activeScene.getNode(),
          cssx('app-scene-with-shadow'));
    }

    return df;
  },

  /**
   * @param {Event} opt_event
   * @return {Deferred}
   */
  _hideSideMenu: function(opt_event) {
    this._disableSceneScroller();

    this._sideMenuMode = 0;

    if (opt_event) {
      opt_event.preventDefault();
    }

    dom.removeClassName(
      this._activeScene.getNode(),
      cssx('app-scene-with-shadow'));

    this._events.unlisten(
      this._activeScene.getNode(),
      TouchHelper.EVT_TOUCHSTART,
      this._hideSideMenu,
      null,
      true);

    return this._activeScene.translateXTo(0, 350).addCallback(
      this.bind(this._enableSceneScroller));
  },

  _enableSceneScroller: function() {
    this._disableSceneScroller();

    var scroller = new Scroller(this, {
      paging: true,
      direction: 'horizontal'
    });

    this._sceneScroller = scroller;
    this._sceneScrollerEvents = new Events(this);

    var node = this._activeScene.getNode();
    this._sceneScroller.registerElement(node);

    var events = this._sceneScrollerEvents;
    events.listen(node, TouchHelper.EVT_TOUCHSTART, this._onSceneTouchStart);
  },

  _disableSceneScroller: function() {
    if (this._sceneScroller) {
      Class.dispose(this._sceneScroller);
      Class.dispose(this._sceneScrollerEvents);
      delete this._sceneScrollerEvents;
      delete this._sceneScroller;
    }
  },

  /**
   * @param {Event} event
   */
  _onSceneTouchStart: function(event) {
    this._sceneScroller.doTouchStart(event);
    var events = this._sceneScrollerEvents;
    events.unlistenAll();
    events.listen(document, TouchHelper.EVT_TOUCHMOVE, this._onSceneTouchMove);
    events.listen(document, TouchHelper.EVT_TOUCHEND, this._onSceneTouchEnd);
    events.listen(document, TouchHelper.EVT_TOUCHCANCEL, this._onSceneTouchEnd);
  },

  /**
   * @param {Event} event
   */
  _onSceneTouchMove: function(event) {
    this._sceneScroller.doTouchMove(event);
  },

  _onSceneTouchEnd: function(event) {
    this._sceneScroller.doTouchEnd(event);
    var node = this._activeScene.getNode();
    var events = this._sceneScrollerEvents;
    events.unlistenAll();
    events.listen(node, TouchHelper.EVT_TOUCHSTART, this._onSceneTouchStart);
    if (this._activeScene.getTranslateX() > this._sceneScrollerWidth / 3) {
      this._disableSceneScroller();
      this._showSideMenu();
    }
  },


  onScrollStart: function(left) {
    if (this._sideMenuMode !== 0) {
      this._disableSceneScroller();
    } else {
      this._activeScene.setDisabled(true);
      var width = this._sideMenu.getWidth();
      this._sceneScrollerWidth = width;
      this._sceneScroller.setDimensions(width, 1, width);
    }
  },

  onScroll: function(left) {
    var x = Math.min(-left * this._chrome.getScale(), this._sceneScrollerWidth);
    this._activeScene.translateXTo(Math.max(x, 0));
  },

  onScrollEnd: function() {
    // Do nothing.
    this._activeScene.setDisabled(false);
  },

  /**
   * @type {BaseUI}
   */
  _chrome: null,

  /**
   * @type {Scroller}
   */
  _sceneScroller: null,

  /**
   * @type {number}
   */
  _sceneScrollerWidth: 0,


  /**
   * @type {Events}
   */
  _sceneScrollerEvents: null,

  /**
   * @type {Scene}
   */
  _coverScene: null,

  /**
   * @type {Scene}
   */
  _activeScene: null,

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
});