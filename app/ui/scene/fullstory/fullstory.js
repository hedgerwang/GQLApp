/**
 * @fileOverview
 * @author Hedger Wang
 */


var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var JewelBar = require('app/ui/jewelbar').JewelBar;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Story = require('app/ui/story').Story;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var FullStory = Class.create(Scene, {
  /**
   * @param {string} storyID
   */
  main: function(storyID) {

  },

  /** @override */
  dispose: function() {

  },

  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-fullstory'));
    return node;
  }
});

exports.GeneratedClass = FullStory;