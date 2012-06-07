/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var SearchBar = Class.create(BaseUI, {
  main: function() {
    this._search = lang.throttle(this._search, 350, this);
  },

  dispose: function() {
    this._close();
  },

  createNode: function() {
    this._mask = dom.createElement('i', cssx('app-ui-searchbar_mask'));
    this._icon = dom.createElement('i', cssx('app-ui-searchbar_icon'));

    this._cancel = dom.createElement(
      'i', cssx('app-ui-searchbar_cancel'), 'Cancel');

    this._input = dom.createElement(
      'input',
      {
        className: cssx('app-ui-searchbar_input'),
        placeholder: 'Search'
      });

    var node = dom.createElement(
      'div', cssx('app-ui-searchbar'),
      ['div', cssx('app-ui-searchbar_head'),
        this._cancel,
        ['div', cssx('app-ui-searchbar_head-background'), this._input],
        this._icon
      ],
      this._mask
    );

    new Imageable(this._icon, '/images/spyglass-2x.png');
    return node;
  },

  dispose: function() {
    Class.dispose(this._tappable);
  },

  onDocumentReady: function() {
    this._tappable = new Tappable(this.getNode());
    this._tappable.addTarget(this.getNode());
    this._tappable.addTarget(this._cancel);
    this.getEvents().listen(this._tappable, 'tap', this._onTap);
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    switch (event.data) {
      case this._cancel:
        this._close();
        break;

      default:
        this._start();
    }
  },

  /**
   * @param {Event} event
   */
  _onInput: function(event) {
    if (this._loading || !this._on) {
      return;
    }

    if (!this._friendsData) {
      this._loading = new LoadingIndicator();
      this.appendChild(this._loading, true);

      FBData.getFriends(100, null, true).addCallback(
        this.callAfter(function(data) {
          this._friendsData = objects.getValueByName(
            data.userid + '.friends.nodes', data) || [];

          Class.dispose(this._loading);
          delete this._loading;

          this._onInput(null);
        }, 1200));

      return;
    }

    this._search();
  },

  _search: function() {
    if (!this._on || this.disposed) {
      return;
    }

    var value = this._input.value.trim().toLowerCase();

    if (value === this._queryValue) {
      return;
    }

    this._queryValue = value;

    if (!value) {
      Class.dispose(this._scrollList);
      delete this._scrollList;
      return;
    }

    if (this._scrollList) {
      this._scrollList.clearContent();
    } else {
      this._scrollList = new ScrollList();
      this._scrollList.render(this.getNode());
    }

    if (value.length > 2) {
      for (var i = 0, data; data = this._friendsData[i]; i++) {
        if (data.name.toLowerCase().indexOf(value) > -1) {
          this._scrollList.addContent(this._createSearchItem(data));
        }
      }
    }
  },

  _createSearchItem : function(data) {
    var icon = dom.createElement('div',
      cssx('app-ui-searchbar_item-icon'));

    var text = dom.createElement(
      'div', cssx('app-ui-searchbar_item-text'), data.name);

    var node = dom.createElement(
      'div', cssx('app-ui-searchbar_item'), icon, text);

    new Imageable(icon, objects.getValueByName('profile_picture.uri', data));
    return node;
  },

  _start: function() {
    if (!this._on) {
      this._on = true;

      dom.addClassName(this.getNode(), cssx('app-ui-searchbar_onsearch'));
      this.getEvents().listen(this._input, 'input', this._onInput);
      this.dispatchEvent(EventType.SEARCH_BAR_ON_SEARCH_START, null, true);
    }
    this._input.focus();
  },

  _close: function() {
    if (this._on) {
      Class.dispose(this._scrollList);
      delete this._scrollList;

      Class.dispose(this._loading);
      delete this._loading;

      delete this._on;
      this._input.value = '';
      this._input.blur();
      this.getEvents().unlisten(this._input, 'input', this._onInput);
      dom.removeClassName(this.getNode(), cssx('app-ui-searchbar_onsearch'));
      this.dispatchEvent(EventType.SEARCH_BAR_ON_SEARCH_END, null, true);
    }
  },

  _scrollList: null,
  _loading: null,
  _friendsData: null,
  _icon : null,
  _input : null,
  _mask: null,
  _cancel: null,
  _on: false,
  _queryValue: ''
});


exports.SearchBar = SearchBar;