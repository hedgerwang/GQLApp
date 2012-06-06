/**
 * @fileOverview Scene
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Jewel = Class.create(BaseUI, {
  dispose: function() {
    Class.dispose(this._tappable);
  },

  /** @override */
  createNode: function() {
    var iconClassName = ' ' + cssx('app-ui-jewel_icon');
    this._sideMenuIcon = dom.createElement(
      'div', cssx('app-ui-jewel_sidemenu') + iconClassName);

    this._friendRequestsIcon = dom.createElement(
      'div', cssx('app-ui-jewel_freind-requests') + iconClassName);

    this._inboxIcon = dom.createElement(
      'div', cssx('app-ui-jewel_inbox') + iconClassName);

    this._notificationIcon = dom.createElement(
      'div', cssx('app-ui-jewel_notification') + iconClassName);

    var node = dom.createElement(
      'div', cssx('app-ui-jewel'),
      this._sideMenuIcon,
      ['div', cssx('app-ui-jewel_center'),
        this._friendRequestsIcon,
        this._inboxIcon,
        this._notificationIcon
      ]
    );
    return node;
  },

  /** @override */
  onDocumentReady:function() {
    this._tappable = new Tappable(this.getNode());
    this._tappable.addTarget(this._sideMenuIcon);
    this._tappable.addTarget(this._friendRequestsIcon);
    this._tappable.addTarget(this._notificationIcon);
    this._tappable.addTarget(this._inboxIcon);
    this._tappable.addTarget(this.getNode());
    var events = this.getEvents();
    events.listen(this._tappable, 'tap', this._onTap);
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    switch (event.data) {
      case this._sideMenuIcon:
        this.dispatchEvent(EventType.JEWEL_SIDE_MENU_TOGGLE, null, true);
        break;
    }
  },

  _tappable: null,
  _sideMenuIcon: null,
  _friendRequestsIcon:null,
  _inboxIcon: null,
  _notificationIcon: null
});


exports.Jewel = Jewel;