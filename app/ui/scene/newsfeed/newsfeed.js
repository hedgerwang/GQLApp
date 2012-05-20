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
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-newsfeed'));

    var jewel = new Jewel();
    jewel.render(node);

    this.appendChild(jewel);
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    FBAPI.isLoggedIn().
      addCallback(this.bind(function(result) {
      FBAPI.query('me()').addCallback(this.bind(function(response) {
        var scrollList = new ScrollList();
        scrollList.render(this.getNode());
        this.appendChild(scrollList);

        this.getNode().appendChild(
          dom.createElement('div', {
            style: 'padding-top:100px;'
          }, JSON.stringify(response))
        );
      }));
    }));
  }
});

exports.NewsFeed = NewsFeed;