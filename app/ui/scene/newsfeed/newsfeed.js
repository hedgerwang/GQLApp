/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var Jewel = require('app/ui/jewel').Jewel;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Story = require('app/ui/story').Story;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var NewsFeed = Class.create(Scene, {
  /** @override} */
  main: function() {
    this._jewel = new Jewel();
    this._scrollList = new ScrollList();
    this._loading = new LoadingIndicator();
    this.appendChild(this._jewel);
    this.appendChild(this._scrollList);
    this.appendChild(this._loading);
  },

  /** @override} */
  dispose: function() {

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
    this._query();
  },

  _query: function() {
    FBData.getHomeStories().addCallback(this.bind(function(response) {
      this._loading.dispose();

      var stories = objects.getValueByName(
        response.userid + '.' + 'home_stories.nodes',
        response);

      var scrollList = this._scrollList;

      if (lang.isArray(stories) && stories.length) {
        for (var i = 0, j = stories.length; i < j; i++) {
          scrollList.addContent(new Story(stories[i]));
        }
        scrollList.render(this.getNode());
      } else {
        this.getNode().appendChild(dom.createElement('div', null, 'no stories'))
      }
    }));
  },

  /**
   * @type {ScrollList}
   */
  _scrollList: null,

  /**
   * @type {Jewel}
   */
  _jewel: null
});

exports.NewsFeed = NewsFeed;