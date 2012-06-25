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
var TimelineUnit = require('app/ui/timelineunit').TimelineUnit;
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
    var units = objects.getValueByName('timeline_units.nodes', sectionData);
    if (!lang.isArray(units) || !units.length) {
      return;
    }

    var section = dom.createElement(
      'div', cssx('app-ui-scene-profile-timeline_section')
    );

    if (index > 0) {
      section.appendChild(dom.createElement(
        'h3', cssx('app-ui-scene-profile-timeline_header'), sectionData.label)
      );
    }

    for (var i = 0, unit; unit = units[i]; i++) {
      this._renderUnit(section, unit);
    }

    this.getNode().appendChild(section);
  },

  /**
   * @param {Object} unitData
   */
  _renderUnit: function(sectionNode, unitData) {
    var unit = new TimelineUnit(unitData);
    this.appendChild(unit);
    unit.render(sectionNode);
  },

  _uid : 0
});

exports.Timeline = Timeline;