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

var NewsFeed = Class.create(Scene, {
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
    dom.addClassName(node, cssx('app-ui-scene-newsfeed'));
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    this._jewel.render(this.getNode());
    this._loading.render(this.getNode());
    this._tappable = new Tappable(this.getNode());
    this._query(14, null);
    this.getEvents().listen(this._tappable, 'tap', this._onTap);
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
    if (this._loading) {
      this._loading.dispose();
      delete this._loading;
    }

    this.callLater(function() {
      var stories = objects.getValueByName(
        response.userid + '.' + 'home_stories.nodes',
        response);

      var scrollList = this._scrollList;

      if (lang.isArray(stories) && stories.length) {
        for (var i = 0, j = stories.length; i < j; i++) {
          scrollList.addContent(new Story(stories[i]));
        }

        if (!scrollList.isInDocument()) {
          scrollList.render(this.getNode());
          this._tappable.addTarget(scrollList.getNode());
        }

        this._storiesLength += stories.length;
      } else {
        dom.append(
          this.getNode(),
          dom.createElement(
            'div',
            cssx('app-ui-scene-newsfeed-denug-no-stories'),
            JSON.stringify(response)
          )
        );
      }

      if (this._storiesLength && this._storiesLength < 200) {
        var startCursor = objects.getValueByName(
          response.userid + '.home_stories.page_info.end_cursor',
          response);

        if (startCursor) {
          this._query(40, startCursor);
        }
      }
      response = null;
    }, 16);
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    if (event.target.getAttribute) {
      var id = event.target.getAttribute('profile_id');
      if (id) {
        this.dispatchEvent(EventType.VIEW_PROFILE, id, true);
      }
    }
  },

  _storiesLength: 0,

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