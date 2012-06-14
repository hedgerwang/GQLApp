/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var ComposerBar = require('app/ui/composerbar').ComposerBar;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var JewelBar = require('app/ui/jewelbar').JewelBar;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Story = require('app/ui/story').Story;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var NewsFeed = Class.create(Scene, {
  /**
   * @param {number=} opt_uid
   * @param {boolean=} opt_showBackButton
   * @override
   */
  main: function(opt_uid, opt_showBackButton) {
    this._uid = opt_uid;
    this._jewel = this.appendChild(new JewelBar(opt_showBackButton));
    this._scrollList = this.appendChild(new ScrollList());
    this._loading = this.appendChild(new LoadingIndicator());
    this._composerBar = this.appendChild(new ComposerBar());
  },

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-newsfeed'));
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    var node = this.getNode();
    this._jewel.render(node);
    this._loading.render(node);
    this._composerBar.render(node);
    this._loading.center();
    this._query(14, null);

    var events = this.getEvents();
    events.listen(this.getNodeTappable(), 'tap', this._onTap);
    events.listen(this._scrollList, 'scroll', this._onFeedScroll);
  },

  _onFeedScroll: function() {
    var newTop = this._scrollList.scrollTop;
    newTop = newTop < 0 ? 0 : newTop;

    if (this._feedSrollTop > newTop) {
      this._composerBar.setVisible(true);
    } else if (this._feedSrollTop < newTop) {
      this._composerBar.setVisible(false);
    }
    this._feedSrollTop = newTop;
  },

  /**
   * @param {number} count
   * @param {string?} startCursor
   */
  _query: function(count, startCursor) {
    var callback = this._loading ?
      this.callAfter(this._onQueryResult, 1200) :
      this.bind(this._onQueryResult);

    FBData.getHomeStories(this._uid, count, startCursor, true).
      addCallback(callback);
  },

  /**
   * @param {Object} response
   */
  _onQueryResult: function(response) {
    if (this.disabled) {
      return;
    }

    if (this._loading) {
      this._loading.dispose();
      delete this._loading;
    }

    this.callLater(function() {
      var stories = objects.getValueByName(
        response.userid + '.' + 'home_stories.nodes',
        response);

      var scrollList = this._scrollList;
      var tappable = this.getNodeTappable();

      if (!scrollList.isInDocument()) {
        scrollList.render(this.getNode());
        scrollList.addContent(
          dom.createElement('div',
            cssx('app-ui-scene-newsfeed-top-spacer')));
        tappable.addTarget(scrollList.getNode());
      }

      if (lang.isArray(stories) && stories.length) {
        for (var i = 0, j = stories.length; i < j; i++) {
          scrollList.addContent(new Story(stories[i]));
        }
        this._storiesLength += stories.length;
      } else if (this._storiesLength === 0) {
        this._scrollList.addContent(
          dom.createElement(
            'textarea',
            cssx('app-ui-scene-newsfeed-denug-no-stories'),
            'No Stories Found\n\r.' + JSON.stringify(response)
          )
        );
      }

      if (this._storiesLength && this._storiesLength < 150) {
        var startCursor = objects.getValueByName(
          response.userid + '.home_stories.page_info.end_cursor',
          response);

        if (startCursor) {
          this._query(20, startCursor);
        }
      }
      response = null;
    }, 16);
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    var targetNode = event.target;
    if (targetNode.getAttribute) {
      var profile = targetNode.getAttribute('profile_id');
      if (profile) {
        this.dispatchEvent(EventType.VIEW_PROFILE, profile, true);
        return;
      }
    }
  },

  _storiesLength: 0,

  _feedSrollTop: 0,

  _uid: 0,

  /**
   * @type {ScrollList}
   */
  _scrollList: null,

  /**
   * @type {JewelBar}
   */
  _jewel: null
});

exports.NewsFeed = NewsFeed;