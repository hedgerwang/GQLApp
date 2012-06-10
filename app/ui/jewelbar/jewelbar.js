/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

// Images:
// phabricator.fb.com/diffusion/E/browse/tfb/trunk/www/html/images/jewel/

var JewelBar = Class.create(BaseUI, {
  /**
   * @param {boolean=} opt_showBackButton
   * @override
   */
  main: function(opt_showBackButton) {
    this._showBackButton = opt_showBackButton;
  },

  /** @override */
  createNode: function() {
    var iconClassName = ' ' + cssx('app-ui-jewelbar_icon');

    if (this._showBackButton) {
      this._backIcon = dom.createElement(
        'div', cssx('app-ui-jewelbar_back'), '\u00AB');
    } else {
      this._sideMenuIcon = dom.createElement(
        'div', cssx('app-ui-jewelbar_sidemenu') + iconClassName);
    }
    this._friendRequestsIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_freind-requests') + iconClassName);

    this._messagesIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_messages') + iconClassName);

    this._notificationIcon = dom.createElement(
      'div', cssx('app-ui-jewelbar_notification') + iconClassName);

    var node = dom.createElement(
      'div', cssx('app-ui-jewelbar'),
      this._backIcon || this._sideMenuIcon,
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
    var tappable = this.getNodeTappable();

    tappable.addTarget(this._backIcon || this._sideMenuIcon).
      addTarget(this._friendRequestsIcon).
      addTarget(this._notificationIcon).
      addTarget(this._messagesIcon).
      addTarget(this.getNode());

    var events = this.getEvents();
    events.listen(tappable, 'tap', this._onTap);

    if (this._sideMenuIcon) {
      new Imageable(this._sideMenuIcon, '/images/menu-2x.png');
    }

    new Imageable(this._friendRequestsIcon, '/images/requests-2x.png');
    new Imageable(this._messagesIcon, '/images/messages-2x.png');
    new Imageable(this._notificationIcon, '/images/notifications-2x.png');
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    if (event.data) {
      switch (event.data) {
        case this._sideMenuIcon:
          this.dispatchEvent(EventType.JEWELBAR_SIDE_MENU_TOGGLE, null, true);
          break;

        case this._backIcon:
          this.dispatchEvent(EventType.JEWELBAR_BACK, null, true);
          break;
      }
    }
  },

  _showBackButton: false,
  _sideMenuIcon: null,
  _friendRequestsIcon:null,
  _messagesIcon: null,
  _notificationIcon: null
});


exports.JewelBar = JewelBar;