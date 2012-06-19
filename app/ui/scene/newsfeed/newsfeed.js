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
var PullToRefreshPanel = require('app/ui/pulltorefreshpanel').PullToRefreshPanel;
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
   * @param {boolean=} opt_useCache
   * @override
   */
  main: function(opt_uid, opt_showBackButton, opt_useCache) {
    this._uid = opt_uid;
    this._useCache = (typeof opt_useCache === 'boolean') ? opt_useCache : true;
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

    var refreshPanel = new PullToRefreshPanel();
    refreshPanel.attachToScrollTarget(this._scrollList);

    this._query(14, null, this._useCache);

    var events = this.getEvents();
    events.listen(this.getNodeTappable(), 'tap', this._onTap);
    events.listen(this._scrollList, 'scroll', this._onFeedScroll);
  },

  _onFeedScroll: function() {
    var scrollTop = this._scrollList.scrollTop;
    var newTop = scrollTop < 0 ? 0 : scrollTop;

    if (this._feedSrollTop > newTop) {
      this._composerBar.setVisible(true);
    } else if (this._feedSrollTop < newTop) {
      this._composerBar.setVisible(false);
    }
    this._feedSrollTop = newTop;
  },

  /**
   * @param {number} count
   * @param {string?} cursor
   * @param {boolean} useCache
   * @return {Deferred}
   */
  _query: function(count, cursor, useCache) {
    var callback = this._loading ?
      this.callAfter(this._onQueryResult, 1200) :
      this.bind(this._onQueryResult);

    return FBData.getHomeStories(this._uid, count, cursor, useCache).
      addCallback(callback);
  },

  /**
   * @param {Object} response
   */
  _onQueryResult: function(response) {
    if (this.disposed) {
      return;
    }

    Class.dispose(this._loading);
    delete this._loading;

    this._queryResponse = response;
    this.setTimeout(this._renderResponse, 16);
  },

  _renderResponse: function() {
    var response = this._queryResponse;

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
      if (this._storiesLength === 0) {
        var firstStory = stories[0];
        // id could be null, use creation_time instead.
        this._firstStoryID = firstStory.id || firstStory.creation_time;
      }

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

    var pageInfo = objects.getValueByName(
      response.userid + '.home_stories.page_info',
      response);

    var startCursor = pageInfo ? pageInfo.start_cursor : null;
    var now = Date.now();

    if (!this._refreshTime &&
      response._cacheTime &&
      now - response._cacheTime > NewsFeed.REFRESH_INTERVAL &&
      startCursor &&
      !pageInfo.has_previous_page) {
      // It appears that we had the very latest cached data, but it seems old
      // so we should try to see if we some newer stories.
      this._refreshTime = now;
      this._queryFreshness(startCursor);
    }

    if (this._storiesLength &&
      this._storiesLength < NewsFeed.STORIES_TO_FETCH_COUNT) {
      var endCursor = objects.getValueByName(
        response.userid + '.home_stories.page_info.end_cursor',
        response);

      if (endCursor && pageInfo.has_next_page) {
        this._query(20, endCursor, true);
      }
    }
    delete this._queryResponse;
  },

  /**
   *
   * @param {string?} startCursor
   */
  _queryFreshness: function(startCursor) {
    if (startCursor) {
      this._queryFreshnessStartCursor = startCursor;
    } else {
      startCursor = this._queryFreshnessStartCursor;
    }

    console.log('NewsFeed query freshness from ', startCursor);

    FBData.getHomeStoriesPageInfo(this._uid, 20, startCursor).
      addCallback(this.bind(this._onFreshnessQuery));
  },

  _onFreshnessQuery: function(response) {
    var pageInfo = objects.getValueByName(
      response.userid + '.home_stories.page_info',
      response);

    var stories = objects.getValueByName(
      response.userid + '.' + 'home_stories.nodes',
      response);

    console.log(
      'Refresh query result pageInfo ',
      this._firstStoryID,
      stories[0] && stories[0].id,
      pageInfo,
      stories.length,
      response
    );

    if (lang.isArray(stories) && stories.length > 1 &&
      this._firstStoryID &&
      this._firstStoryID !== stories[0].id &&
      this._firstStoryID !== stories[0].creation_time) {
      this._firstStoryID = null;
      this._composerBar.updateNewStoriesCount(stories.length - 1);
    } else {
      // Check freshness periodically.
      this.setTimeout(this._queryFreshness, NewsFeed.REFRESH_INTERVAL);
    }
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
      }
    }
  },

  _firstStoryID: '',

  _refreshTime: 0,

  _queryFreshnessStartCursor: '',

  _storiesLength: 0,

  _feedSrollTop: 0,

  /**
   * @type {Object}
   */
  _queryResponse: null,

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

NewsFeed.STORIES_TO_FETCH_COUNT = 150;

NewsFeed.REFRESH_INTERVAL = 1 * 60 * 1000;

exports.NewsFeed = NewsFeed;