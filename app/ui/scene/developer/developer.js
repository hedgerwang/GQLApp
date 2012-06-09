/**
 * @fileOverview
 * @author Hedger Wang
 */


var Class = require('jog/class').Class;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Scroller = require('jog/behavior/scrollable/scroller').Scroller;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Developer = Class.create(Scene, {
  /** @override */
  main: function() {
    this._scroll = this.appendChild(new ScrollList());
  },

  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-developer'));

    this._scroll.addContent(
      dom.createElement('div',
        cssx('app-ui-scene-developer_item'),
        'Developer Settings'));

    this._scroll.addContent(
      this._createRangeInput(
        'Inertial scrolling time (100 ~ 2000)',
        'scroll_dur',
        Scroller.prototype._SCROLLING_DURATION,
        100,
        3000)
    );

    this._scroll.addContent(
      this._createRangeInput(
        'Inertial scrolling speed factor (0.1 ~ 2)',
        'scroll_fac',
        Scroller.prototype._SPEED_FACTOR,
        0.1,
        1)
    );

    this._submit = dom.createElement(
      'input',
      {
        className: cssx('app-ui-scene-developer_item-submit'),
        type: 'button',
        value: 'Save'
      },
      'Save');

    this._scroll.addContent(this._submit);
    return node;
  },

  onDocumentReady: function() {
    this._scroll.render(this.getNode());
    this.getEvents().listen(this._submit, 'click', this._save);
  },

  _save: function() {
    this._submit.value = 'Saving...';
    this.getEvents().unlistenAll();

    var input = this._findInput('scroll_dur');
    var duration = Math.max(100, parseInt(input.value.trim(), 10) || 0);
    duration = Math.min(2000, duration);
    input.value = duration;
    Scroller.prototype._SCROLLING_DURATION = duration;

    input = this._findInput('scroll_fac');
    var factor = Math.max(0.1, parseFloat(input.value.trim(), 10) || 0);
    factor = Math.min(2, factor);
    input.value = factor;
    Scroller.prototype._SPEED_FACTOR = factor;

    this.callLater(function() {
      this._submit.value = 'Saved';
      this.getEvents().listen(this._submit, 'click', this._save);
    }, 500);
  },

  /**
   * @param {string} name
   * @return {Node}
   */
  _findInput: function(name) {
    return this.getNode().querySelector('input[name="' + name + '"]');
  },

  /**
   * @param {string} label
   * @param {string} name
   * @param {string|number} value
   */
  _createRangeInput: function(label, name, value, min, max) {
    return dom.createElement('div', cssx('app-ui-scene-developer_item'),
      ['div', cssx('app-ui-scene-developer_item-label'), label],
      ['input', {
        type: 'text',
        className: cssx('app-ui-scene-developer_item-input'),
        name: name,
        value: value
      }]
    );
  },

  _submit: null
});

exports.Developer = Developer;