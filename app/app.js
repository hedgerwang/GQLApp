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
    var chrome = new Chrome();
    var coverScene = new Cover();
    var newsFeed = new NewsFeed();

    // Show the initial blue screen.
    coverScene.render(chrome.getNode());

    coverScene.addEventListener(EventType.EVT_FB_SESSION_READY, function() {
      newsFeed.render(chrome.getNode());
      coverScene.dispose();
      coverScene = null;
    });

    // show the whole chrome.
    chrome.render(dom.getDocument().body);
  }
});


window.addEventListener('load', function() {
  var app = new App();
  // app.xmain();
});