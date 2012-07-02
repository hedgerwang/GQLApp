/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var TimelineUnit = require('app/ui/timelineunit').TimelineUnit;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Section = Class.create(BaseUI, {
  /**
   * @param {Object} data
   */
  main: function(data) {
    this._data = data;
  },

  dispose: function() {
    Class.dispose(this._album);
  },

  /** @override */
  createNode: function() {
    var data = this._data;

    var units = objects.getValueByName('timeline_units.nodes', data);

    if (!lang.isArray(units) || !units.length) {
      return dom.createElement('div');
    }

    var section = dom.createElement(
      'div', cssx('app-ui-scene-profile-timeline_section')
    );

    section.appendChild(dom.createElement(
      'h3', cssx('app-ui-scene-profile-timeline_header'), data.label)
    );

    return section;
  },

  onNodeReady: function() {
    var data = this._data;

    var units = objects.getValueByName('timeline_units.nodes', data);

    if (lang.isArray(units) && units.length) {
      for (var i = 0, unitData; unitData = units[i]; i++) {
        var unit = new TimelineUnit(unitData);
        this.appendChild(unit, true);
      }
    }
  }
});

exports.Section = Section;