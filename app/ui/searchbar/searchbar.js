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
      'div', cssx('app-ui-searchbar_cancel'), 'Cancel');

    this._input = dom.createElement(
      'input',
      {
        spellcheck :'off' ,
        autocapitalize: 'off',
        autocorrect: 'off',
        className: cssx('app-ui-searchbar_input'),
        placeholder: 'Search'
      });

    // this._input.tabIndex = 0;

    this._searchPopup = dom.createElement('div');

    var node = dom.createElement(
      'div', cssx('app-ui-searchbar'),
      ['div', cssx('app-ui-searchbar_head'),
        this._cancel,
        ['div', cssx('app-ui-searchbar_head-background'), this._input],
        this._icon
      ],
      this._mask,
      this._searchPopup
    );

    this.renderImage(this._icon, '/images/spyglass-2x.png');
    return node;
  },

  onDocumentReady: function() {
    var tappable = this.getNodeTappable();
    tappable.addTarget(this.getNode());
    tappable.addTarget(this._cancel);
    tappable.addTarget(this._searchPopup);
    this.getEvents().listen(tappable, 'tapclick', this._onTap);
    this.getEvents().listen(this._input, 'focus', this._onFocus);
  },

  _onFocus: function(event) {
    // event.preventDefault();
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    var profileID;

    switch (event.data) {
      case this._cancel:
        this._close();
        return;

      case this._searchPopup :
        var node = event.target;
        while (node) {
          profileID = node._profileID;

          if (profileID) {
            this._close();

            this.dispatchEvent(
              EventType.SEARCH_BAR_ON_SEARCH_SELECT,
              profileID,
              true);

            break;
          }
          node = node.parentNode;
        }
        return;

      default:
        this._start();
        return;
    }
  },

  /**
   * @param {Event} event
   */
  _onInput: function(event) {
    if (this._loadingIcon || !this._active) {
      return;
    }

    if (!this._friendsData && !this._loadingIcon) {
      // No data yet. Show loading icon instead.
      this._loadingIcon = new LoadingIndicator();
      this.appendChild(this._loadingIcon, true);

      FBData.getFriends(100, null, true).addCallback(
        this.bind(function(data) {
          this._loadingIcon.dismiss().addCallback(
            this.bind(function() {
              delete this._loadingIcon;
              this._friendsData = objects.getValueByName(
                'friends.nodes', data[data.userid]) || [];
              // Trigger the search again.
              this._onInput(null);
            })
          );

        })
      );
      return;
    }

    this._search();
  },

  _search: function() {
    if (!this._active || this.disposed) {
      return;
    }

    var value = this._input.value.trim().toLowerCase();

    if (value === this._queryValue) {
      return;
    }

    this._queryValue = value;
    Class.dispose(this._scrollList);
    delete this._scrollList;

    if (!value) {
      return;
    }

    this._scrollList = new ScrollList();
    this._scrollList.render(this._searchPopup);

    if (value) {
      var valueLength = value.length;
      for (var i = 0, data; data = this._friendsData[i]; i++) {
        var idx = data.name.toLowerCase().indexOf(value);
        if (valueLength === 1 && idx === 0 || valueLength > 1 && idx > -1) {
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

    node._profileID = data.id;

    this.renderImage(icon, objects.getValueByName('profile_picture.uri', data));
    return node;
  },

  _start: function() {
    if (!this._active) {
      this._active = true;

      dom.addClassName(this.getNode(), cssx('app-ui-searchbar_onsearch'));
      this.getEvents().listen(this._input, 'input', this._onInput);
      this.dispatchEvent(EventType.SEARCH_BAR_ON_SEARCH_START, null, true);
    }
    this._input.focus();
    window.scrollTo(0, 1);
  },

  _close: function() {
    if (this._active) {
      Class.dispose(this._scrollList);
      delete this._scrollList;

      Class.dispose(this._loadingIcon);
      delete this._loadingIcon;

      delete this._active;
      this._input.value = '';
      this._input.blur();
      this.getEvents().unlisten(this._input, 'input', this._onInput);
      dom.removeClassName(this.getNode(), cssx('app-ui-searchbar_onsearch'));
      this.dispatchEvent(EventType.SEARCH_BAR_ON_SEARCH_END, null, true);
    }
  },

  _scrollList: null,
  _loadingIcon: null,
  _friendsData: null,
  _icon : null,
  _input : null,
  _mask: null,
  _searchPopup:null,
  _cancel: null,
  _active: false,
  _queryValue: ''
});


exports.SearchBar = SearchBar;