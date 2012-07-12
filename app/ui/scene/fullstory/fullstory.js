/**
 * @fileOverview
 * @author Hedger Wang
 */


var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var JewelBar = require('app/ui/jewelbar').JewelBar;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Story = require('app/ui/story').Story;
var asserts = require('jog/asserts').asserts;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var FullStory = Class.create(Scene, {
  /**
   * @param {Object} storyData
   */
  main: function(storyData) {
    asserts.notNull(storyData, 'FullStory data must not be null');
    this._jewelBar = this.appendChild(new JewelBar(true));
    this._scrollList = this.appendChild(new ScrollList());
    this._data = storyData;
    this._renderStory = this.bind(this._renderStory);
  },

  /** @override */
  dispose: function() {
  },

  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-fullstory'));
    return node;
  },

  /** @override} */
  onNodeReady: function() {
    this._jewelBar.render(this.getNode());
  },

  /** @override} */
  onDocumentReady:function() {
    this._renderStory();
  },

  _renderStory: function() {
    if (this.translating) {
      this.setTimeout(this._renderStory, 500);
      return;
    }
    this._scrollList.render(this.getNode());
    var story = new Story(this._data, Story.OPTION_FULL_STORY);
    this._scrollList.addContent(story, true);
  },

  _jewelBar: null,
  _scrollList: null,
  _data: null
});

exports.FullStory = FullStory;