/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var JewelBar = Class.create(BaseUI, {
  /**
   * @param {boolean=} opt_showBackButton
   * @override
   */
  main: function(opt_showBackButton) {
    this._showBackButton = opt_showBackButton;
  },

  dispose: function() {
    Class.dispose(this._tappable);
  },

  /** @override */
  createNode: function() {
    var iconClassName = ' ' + cssx('app-ui-jewelbar_icon');
    this._sideMenuIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_sidemenu') + iconClassName);

    this._friendRequestsIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_freind-requests') + iconClassName);

    this._messagesIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_messages') + iconClassName);

    this._notificationIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_notification') + iconClassName);

    var node = dom.createElement(
      'div', cssx('app-ui-jewelbar'),
      this._sideMenuIcon,
      ['div', cssx('app-ui-jewelbar_center'),
        this._friendRequestsIcon,
        this._messagesIcon,
        this._notificationIcon
      ]
    );
    return node;
  },

  /** @override */
  onDocumentReady:function() {
    this._tappable = new Tappable(this.getNode());

    this._tappable.addTarget(this._sideMenuIcon).
      addTarget(this._friendRequestsIcon).
      addTarget(this._notificationIcon).
      addTarget(this._messagesIcon).
      addTarget(this.getNode());

    var events = this.getEvents();
    events.listen(this._tappable, 'tap', this._onTap);

    new Imageable(this._sideMenuIcon, '/images/menu-2x.png');
    new Imageable(this._friendRequestsIcon, '/images/requests-2x.png');
    new Imageable(this._messagesIcon, '/images/messages-2x.png');
    new Imageable(this._notificationIcon, '/images/notifications-2x.png');
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
  _showBackButton: false,
  _sideMenuIcon: null,
  _friendRequestsIcon:null,
  _messagesIcon: null,
  _notificationIcon: null
});


exports.JewelBar = JewelBar;