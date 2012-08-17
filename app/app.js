/**
 * @fileOverview
 * @author Hedger Wang
 */
var APP = require('jog/app').APP;
var ActiveSceneScroller = require('app/behavior/activescenescroller').ActiveSceneScroller;
var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var Composer = require('app/ui/scene/composer').Composer;
var Cover = require('app/ui/scene/cover').Cover;
var Developer = require('app/ui/scene/developer').Developer;
var EventType = require('app/eventtype').EventType;
var Events = require('jog/events').Events;
var FullStory = require('app/ui/scene/fullstory').FullStory;
var NewsFeed = require('app/ui/scene/newsfeed').NewsFeed;
var Photos = require('app/ui/fullview/photos').Photos;
var Profile = require('app/ui/scene/profile').Profile;
var SideMenu = require('app/ui/scene/sidemenu').SideMenu;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var UserAgent = require('jog/useragent').UserAgent;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var GQLApp = Class.create(APP, {

  main: function() {
    this._chrome = new Chrome();
    this._coverScene = new Cover();
    this._sideMenu = new SideMenu();
    this._events = new Events(this);

    // Show the initial blue screen.
    this._chrome.appendChild(this._coverScene, true);

    this._coverScene.addEventListener(
      EventType.FB_SESSION_READY,
      lang.callAfter(this.bind(this._start), 600)
    );

    // show the whole chrome.
    var body;
    if (UserAgent.IS_IOS6) {
      // Trick to disable the addressbar then enforce the fullscreen view.
      var body = dom.createElement('div', cssx('app_body'));
      dom.getDocument().body.appendChild(body);
    } else {
      body = dom.getDocument().body;
    }

    this._chrome.render(body);
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
    Class.dispose(this._photosView);
  },

  _start: function() {
    this._coverScene.fadeOut(450, true).addCallback(this.bind(function() {
      this._chrome.appendChild(this._sideMenu, true);
      this._bindEvents();
      this._enableSceneScroller();
    }));


    // TEST!
    // this._addScene(new Composer(0));
    // this._addScene(new Profile(0));
    this._addScene(new NewsFeed(0, false));
  },

  _bindEvents: function() {
    var events = this._events;

    events.listen(
      this._chrome,
      EventType.JEWELBAR_SIDE_MENU_TOGGLE,
      this._toggleSideMenu);

    events.listen(
      this._chrome,
      EventType.COMPOSER_OPEN,
      this._showComposer);

    events.listen(
      this._chrome,
      EventType.COMPOSER_CLOSE,
      this._hideComposer);

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
      this._chrome,
      EventType.NEWSFEED_REFRESH,
      this._onViewHome);

    events.listen(
      this._sideMenu,
      EventType.SIDE_MENU_DEVELOPER,
      this._onDeveloper);

    events.listen(
      this._sideMenu,
      EventType.SEARCH_BAR_ON_SEARCH_START,
      this._onSearchStart);

    events.listen(
      this._sideMenu,
      EventType.SEARCH_BAR_ON_SEARCH_END,
      this._onSearchEnd);

    events.listen(
      this._chrome,
      EventType.STORY_ALBUM_TAP,
      this._onViewPhoto);

    events.listen(
      this._chrome,
      EventType.VIEW_STORY,
      this._onViewStory);
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
        this._sideMenu.dismissSelectedItem();
        this._addScene(new Profile(uid, true));
        break;
    }
  },


  /**
   * @param {Event} event
   */
  _onViewStory: function(event) {
    var data = event.data;
    this._hideSideMenu().addCallback(this.bind(function() {
      this._addScene(new FullStory(data, true));
      data = undefined;
    }));
  },

  /**
   * @param {Event} event
   */
  _onViewHome: function(event) {
    var useCache = event.type !== EventType.NEWSFEED_REFRESH;
    this._hideSideMenu().addCallback(this.bind(function() {
      this._clearScenes();
      this._addScene(new NewsFeed(0, false, useCache));
    }));
  },

  /**
   * @param {Event} event
   */
  _onViewPhoto: function(event) {
    var album = event.target;
    this._hideSideMenu().addCallback(this.bind(function() {
      Class.dispose(this._photosView);

      var photsView = new Photos();
      photsView = new Photos();
      photsView.render(this._chrome.getNode());
      photsView.importAlbum(album);

      var handler = this.bind(this._onPhotosViewChange);
      photsView.addEventListener(EventType.PHOTOS_VIEW_CLOSE, handler);
      photsView.addEventListener(EventType.PHOTOS_VIEW_READY, handler);
      album = null;
      this._activeScene.setDisabled(true);
    }));
  },

  /**
   * @param {Event} event
   */
  _onPhotosViewChange: function(event) {
    var disabled = event.type === EventType.PHOTOS_VIEW_READY;
    this._sideMenu.setDisabled(disabled);
    this._sideMenu.setHidden(disabled);
    this._activeScene.setDisabled(disabled);
  },

  _onDeveloper: function() {
    this._hideSideMenu().addCallback(this.bind(function() {
      this._clearScenes();
      this._sideMenu.dismissSelectedItem();
      this._addScene(new Developer());
    }));
  },

  _clearScenes: function() {
    var scene = this._activeScene;
    while (scene) {
      var nextScene = scene._nextScene;
      scene.dispose();
      scene = nextScene;
    }
    this._activeScene = undefined;
  },

  /**
   * @param {Scene} scene
   */
  _addScene: function(scene) {
    if (!this._activeScene) {
      this._activeScene = scene;
      this._chrome.appendChild(this._activeScene, true);
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
      nextScene.setDisabled(true);
      return nextScene.translateXTo(0, 350);
    })).addCallback(this.bind(function(nextScene) {
      nextScene._prevScene.setHidden(true);
      nextScene.setDisabled(false);
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
    this._activeScene._nextScene = undefined;

    targetScene.setDisabled(true).
      translateXTo(this._chrome.getWidth() - 50, 350).addCallback(
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

  _showComposer: function() {
    if (!this._composer) {
      this._composer = new Composer();
      this._composer.setDisabled(true);
      this._composer.translateYTo(dom.getViewportHeight()).
        addCallback(this.bind(
        function() {
          this._chrome.appendChild(this._composer, true);
          this._composer.translateYTo(0, 450).
            addCallback(this.bind(function() {
            this._composer.setDisabled(false);
          }));
        }
      ));

      this._activeScene.setDisabled(true);
      this._sideMenu.setDisabled(true);
      this._sideMenu.setHidden(true);
    }
  },

  _hideComposer: function() {
    if (this._composer) {
      this._composer.setDisabled(true);
      this._composer.translateYTo(dom.getViewportHeight(), 300).addCallback(
        this.bind(function() {
          this._activeScene.setDisabled(false);
          this._sideMenu.setDisabled(false);
          this._sideMenu.setHidden(false);
          Class.dispose(this._composer);
          delete this._composer;
        })
      );
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
    this._disableSceneScroller();
    this._activeScene.setDisabled(true);
    this._sideMenu.setDisabled(true);
    this._sideMenuMode++;

    var df = this._activeScene.translateXTo(this._sideMenu.getWidth(), 350).
      addCallback(this.bind(this._onSideMenuShown));

    switch (this._sideMenuMode) {
      case 1:
        // Open
        df.addCallback(this.bind(
          function() {
            if (this._sideMenuMode == 1) {
              // To receive the TOUCH event to close the side menu.
              this._events.listen(
                this._activeScene.getNode(),
                TouchHelper.EVT_TOUCHSTART,
                this._hideSideMenu,
                null,
                true);

              dom.addClassName(
                this._activeScene.getNode(),
                cssx('app-scene-with-shadow'));
            }
          }));
        break;

      case 2:
        // Fullscreen
        dom.removeClassName(
          this._activeScene.getNode(),
          cssx('app-scene-with-shadow'));
        break;

      case 3:
        //  Resume from fullscreen to open.
        this._sideMenuMode = 1;
        dom.addClassName(
          this._activeScene.getNode(),
          cssx('app-scene-with-shadow'));
    }

    return df;
  },

  _onSideMenuShown: function() {
    // To receive the TOUCH event to close the side menu.
    this._activeScene.setDisabled(false);
    this._sideMenu.setDisabled(false);
  },

  /**
   * @param {Event} opt_event
   * @return {Deferred}
   */
  _hideSideMenu: function(opt_event) {
    this._disableSceneScroller();

    this._sideMenuMode = 0;
    this._sideMenu.setDisabled(true);
    this._activeScene.setDisabled(true);

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

    return this._activeScene.translateXTo(0, 350).
      addCallback(this.bind(this._onSideMenuHidden)).
      addCallback(this.bind(this._enableSceneScroller));
  },

  _onSideMenuHidden: function() {
    this._activeScene.setDisabled(false);
    this._sideMenu.setDisabled(true);
  },

  _enableSceneScroller: function() {
    this._disableSceneScroller();
    this._sceneScroller = new ActiveSceneScroller(this._activeScene);
    this._sceneScroller.setWidth(this._sideMenu.getWidth());
    this._sceneScroller.setScale(this._chrome.getScale());
    this._sceneScroller.addEventListener(
      EventType.ACTIVE_SCENE_SCROLLER_SCROLLOUT,
      this.bind(this._showSideMenu));
  },

  _disableSceneScroller: function() {
    Class.dispose(this._sceneScroller);
    this._sceneScroller = undefined;
  },

  /**
   * @type {BaseUI}
   */
  _chrome: null,

  /**
   * @type {Composer}
   */
  _composer: null,

  /**
   * @type {ActiveSceneScroller}
   */
  _sceneScroller: null,

  /**
   * @type {Scene}
   */
  _coverScene: null,

  /**
   * @type {Scene}
   */
  _activeScene: null,

  /**
   * @type {Photos}
   */
  _photosView: null,

  /**
   * 0 - close
   * 1 - open
   * 2 - fullsreen
   * @type {number}
   */
  _sideMenuMode: 0
});

exports.GQLApp = GQLApp;

APP.install(GQLApp);