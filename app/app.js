/**
 * @fileOverview
 * @author Hedger Wang
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var Cover = require('app/ui/scene/cover').Cover;
var EventType = require('app/eventtype').EventType;
var NewsFeed = require('app/ui/scene/newsfeed').NewsFeed;
var dom = require('jog/dom').dom;

var App = Class.create(null, {
  main: function() {
    this._chrome = new Chrome();
    this._coverScene = new Cover();
    this._newsFeed = new NewsFeed();

    // Show the initial blue screen.
    this._coverScene.render(this._chrome.getNode());

    this._coverScene.addEventListener(
      EventType.EVT_FB_SESSION_READY,
      this.callAfter(this._start, 600)
    );

    // show the whole chrome.
    this._chrome.render(dom.getDocument().body);
  },

  dispose: function() {
    this._chrome.dispose();
    this._coverScene.dispose();
    this._newsFeed.dispose();
  },

  _start: function() {
    this._newsFeed.render(this._chrome.getNode());
    this._coverScene.faceOut(450, true)
  },

  _chrome: null,
  _coverScene: null,
  _newsFeed: null
});

exports.App = App;

window.addEventListener('load', function() {
  var app = new App();
  // app.xmain();
});