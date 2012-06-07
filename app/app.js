/**
 * @fileOverview
 * @author Hedger Wang
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var Cover = require('app/ui/scene/cover').Cover;
var EventType = require('app/eventtype').EventType;
var Events = require('jog/events').Events;
var HashCode = require('jog/hashcode').HashCode;
var NewsFeed = require('app/ui/scene/newsfeed').NewsFeed;
var SideMenu = require('app/ui/scene/sidemenu').SideMenu;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var App = Class.create(null, {

  main: function() {
    this._updateURLHash();

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

    // show the whole chrome.
    this._chrome.render(dom.getDocument().body);
  },

  dispose: function() {
    var currScene = this._activeScene;

    while (currScene) {
      var prevScene = currScene._appScenePrev;
      Class.dispose(currScene);
      currScene = prevScene;
    }

    Class.dispose(this._events);
    Class.dispose(this._sideMenu);
    Class.dispose(this._chrome);
  },

  _start: function() {
    this._appendScene(0);
    this._chrome.appendChild(this._sideMenu, true);
    this._coverScene.faceOut(450, true);
    this._bindEvents();
  },

  _bindEvents: function() {
    this._events.listen(
      this._chrome,
      EventType.JEWEL_SIDE_MENU_TOGGLE,
      this._toggleSideMenu);

    this._events.listen(
      this._chrome,
      EventType.VIEW_PROFILE,
      this._onViewProfile);

    this._events.listen(
      this._sideMenu,
      EventType.SEARCH_BAR_ON_SEARCH_START,
      this._onSearchStart);

    this._events.listen(
      this._sideMenu,
      EventType.SEARCH_BAR_ON_SEARCH_END,
      this._onSearchEnd);

    this._events.listen(
      window,
      'hashchange',
      this._onHashChange);
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
    this._appendScene(uid);
  },

  /**
   * @param {number} uid
   */
  _appendScene: function(uid) {
    if (!this._activeScene) {
      this._activeScene = new NewsFeed(uid, true);
      window.location.hash = '#scene=' + HashCode.getHashCode(this._activeScene);
      this._chrome.appendChild(this._activeScene, true);
      return;
    }

    this._hideSideMenu().then(this.bind(function() {
      var currScene = this._activeScene;
      currScene.setDisabled(true);

      var newScene = new NewsFeed(uid, true);
      uid = null;

      // TODO(hedger): Use LinkedList?
      // HACK. Expando.
      currScene._appSceneNext = newScene;
      newScene._appScenePrev = currScene;
      this._chrome.appendChild(newScene);
      this._activeScene = newScene;
      this._updateURLHash();
      return newScene.translateXTo(this._chrome.getWidth());
    })).then(this.bind(function(nextScene) {
      nextScene.render(this._chrome.getNode());
      return nextScene.translateXTo(0);
    })).addCallback(this.bind(function(nextScene) {
      nextScene._appScenePrev.setHidden(true);
    }));
  },

  /**
   *
   * @param {Scene} targetScene
   */
  _removeScene: function(targetScene) {
    // CLear all scenes after targetScene.
    var scene = targetScene._appSceneNext;

    if (scene) {
      while (scene) {
        var nextScene = scene._appSceneNext;
        scene.dispose();
        scene = nextScene;
      }
    }

    var prevScene = targetScene._appScenePrev;
    if (__DEV__) {
      if (!prevScene) {
        throw new Error('The first scene should not be removed');
      }
    }

    prevScene.setHidden(false).setDisabled(false);
    this._activeScene = prevScene;
    delete this._activeScene._appSceneNext;
    this._updateURLHash();
    targetScene.setDisabled(true).
      translateXTo(this._chrome.getWidth()).
      addCallback(function(scene) {
        scene.dispose();
      });
  },

  _updateURLHash: function() {
    if (window.history.replaceState) {
      var url = window.location.href.split('#')[0];
      var hashPrefix = '#scene=';
      if (this._activeScene) {
        if (this._activeScene._appSceneNext) {
          window.history.replaceState(
            null,
            'prevscene',
            url + hashPrefix + HashCode.getHashCode(this._activeScene));
        } else {
          window.history.pushState(
            null,
            'currscene',
            url + hashPrefix + HashCode.getHashCode(this._activeScene));
        }
      } else {
        window.history.replaceState(null, 'scene', url);
      }

    } else {
      if (__DEV__) {
        throw new Error('Client does not support History API');
      }
    }
  },

  /**
   * @param {Event} event
   */
  _onSearchEnd: function(event) {
    dom.removeClassName(this._sideMenu.getNode(),
      cssx('app-ui-scene-sidemenu_onsearch'));

    this._showSideMenu();
  },

  /**
   * @param {Event} event
   */
  _onHashChange: function(event) {
    var re = /#*(scene=)([a-zA-Z0-9_-]+)/;
    var matches = window.location.hash.match(re);
    if (matches && matches[2]) {
      var hashCode = matches[2];
      var scene = this._activeScene;
      var targetScene;

      while (scene) {
        if (HashCode.getHashCode(scene) === hashCode) {
          if (scene === this._activeScene) {
            return;
          } else {
            targetScene = scene;
            break;
          }
        }
        scene = scene._appScenePrev;
      }

      if (targetScene && targetScene._appSceneNext) {
        this._removeScene(targetScene._appSceneNext);
      }
    }
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
    this._sideMenuMode++;

    var df = this._activeScene.translateXTo(this._sideMenu.getWidth());

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

    return this._activeScene.translateXTo(0);
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
  // app.xmain();
});