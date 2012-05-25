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
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

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

    FBAPI.isLoggedIn().
      addCallback(this.bind(function(result) {
      FBAPI.query('me()').addCallback(this.bind(function(response) {
        this.appendChild(this._scrollList, true);
        this._scrollList.addContent(JSON.stringify(response));
      }));
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