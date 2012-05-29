/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBAPI = require('jog/fbapi').FBAPI;
var Jewel = require('app/ui/jewel').Jewel;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Story = require('app/ui/story').Story;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var HOME_STORIES = 'me(){home_stories.first(50){' +
  'nodes{message,title,id,url,creation_time,actors,attachments{' +
  'media{src,url,id,message},source,description}}}}';


var NewsFeed = Class.create(Scene, {
  /** @override} */
  main: function() {
    this._jewel = new Jewel();
    this._scrollList = new ScrollList();
  },

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-newsfeed'));
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    this.appendChild(this._jewel, true);
    this._query();
  },

  _query: function() {
    FBAPI.queryGraph(HOME_STORIES).addCallback(this.bind(function(response) {
      var stories = objects.getValueByName(
        response.userid + '.' + 'home_stories.nodes',
        response);

      var scrollList = this._scrollList;

      if (lang.isArray(stories) && stories.length) {
        this.appendChild(scrollList, true);

        for (var i = 0, j = stories.length; i < j; i++) {
          scrollList.addContent(new Story(stories[i]));
        }
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