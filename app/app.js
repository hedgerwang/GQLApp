/**
 * @fileOverview
 * @author Hedger Wang
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Cover = require('app/ui/scene/cover').Cover;
var dom = require('jog/dom').dom;

var App = Class.create({
  main: function() {
    var chrome = new Chrome();

    var coverScene = new Cover();
    coverScene.render(chrome.getNode());

    coverScene.addEventListener(EventType.EVT_FB_SESSION_READY, function() {
      alert(3);
    });

    chrome.render(dom.getDocument().body);
  }
});

window.addEventListener('load', function() {
  new App();
});