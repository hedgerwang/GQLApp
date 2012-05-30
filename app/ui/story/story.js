/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBAPI = require('jog/fbapi').FBAPI;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var Story = Class.create(BaseUI, {
  /**
   * @param {Object} data
   */
  main: function(data) {
    this._data = data;
  },

  /** @override */
  createNode: function() {
    var data = this._data;
    var title = objects.getValueByName('title.text', data);
    var message = objects.getValueByName('message.text', data);
    var media = objects.getValueByName('attachments.0.media', data);

    var header = dom.createElement('div', cssx('app-ui-story-header'),
      ['div', cssx('app-ui-story-profile-pix')],
      ['div', cssx('app-ui-story-title'), title]
    );

    var body = dom.createElement('div', cssx('app-ui-story-body'), message);

    if (media && media.src && media.url && /\.jpg$/.test(media.src)) {
      body.appendChild(dom.createElement('div', {
        class: cssx('app-ui-story-img'),
        style: 'background-image:url(' + media.src + ')'
      }));
    }

    var footer = dom.createElement('div', cssx('app-ui-story-footer'),
      'Like - Comment'
    );

    return dom.createElement('div', cssx('app-ui-story'),
      header, body, footer);
  },

  _data: null
});


exports.Story = Story;