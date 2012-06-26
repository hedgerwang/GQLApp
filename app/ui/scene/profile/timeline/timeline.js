/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var Deferred = require('jog/deferred').Deferred;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scrollable = require('jog/behavior/scrollable').Scrollable;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var Section = require('app/ui/scene/profile/timeline/section').Section;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Timeline = Class.create(BaseUI, {
  /**
   * @param {number} uid
   */
  main: function(uid) {
    this._uid = uid;
  },

  /** @override */
  dispose: function() {

  },

  /** @override */
  createNode: function() {
    return dom.createElement(
      'div', cssx('app-ui-scene-profile-timeline'));
  },

  onDocumentReady: function() {
    FBData.getTimelineSections().addCallback(this.bind(this._onQueryBack));
  },

  /**
   * @param {Object} data
   */
  _onQueryBack: function(data) {
    this._uid = data.userid;


    var sections = objects.getValueByName(
      'timeline_sections.nodes', data[this._uid]);

    if (lang.isArray(sections) && sections.length) {
      sections.forEach(this.bind(this._renderSection));
    }
    this.dispatchEvent('load', null, true);
  },

  /**
   * @param {Object} sectionData
   * @param {number} index
   */
  _renderSection: function(sectionData, index) {
    this.appendChild(new Section(sectionData), true);
  },

  _uid : 0
});

exports.Timeline = Timeline;