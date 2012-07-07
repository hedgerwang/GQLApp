/**
 * @fileOverview
 * @author Hedger Wang
 */

var Animator = require('jog/animator').Animator;
var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Imageable = require('jog/behavior/imageable').Imageable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var ComposerBar = Class.create(BaseUI, {
  /** @override */
  main: function() {

  },

  /** @override */
  dispose: function() {
    Class.dispose(this._animator);
  },

  /** @override */
  createNode: function() {
    this._photoTab = this._createTab('Photo', '/images/photo.png');
    this._composeTab = this._createTab('Status', '/images/compose.png');

    var photoInput = dom.createElement('input', {
      type: 'file',
      accept: 'image/*',
      capture: 'camera',
      className: cssx('app-ui-composerbar_camera-input')
    });

    this._photoTab.appendChild(photoInput);

    this._newStoriesCountPanel = dom.createElement(
      'div', cssx('app-ui-composerbar_new-stories-count'));

    var node = dom.createElement('div', cssx('app-ui-composerbar'),
      [
        'div',
        cssx('app-ui-composerbar_tabs'),
        this._composeTab,
        this._photoTab,
        this._createTab('Check In', '/images/place.png')
      ],
      this._newStoriesCountPanel
    );

    return node;
  },

  /**
   * @param {boolean} visible
   */
  setVisible: function(visible) {
    if (this._visible === visible) {
      return;
    }

    this._visible = visible;

    Class.dispose(this._animator);

    this._startTranslateY = this._translateY;
    this._endTranslateY = visible ? 0 : -this.getNode().offsetHeight;
    this._deltaTranslateY = this._endTranslateY - this._startTranslateY;

    this._animator = new Animator();
    this._animator.start(
      this.bind(this._onAnimStep),
      this.bind(this._onAnimCheck),
      this.bind(this._onAnimComplete),
      200);
  },

  onDocumentReady: function() {
    this._visible = true;
    var tappable = this.getNodeTappable();
    tappable.addTarget(this._composeTab);
    tappable.addTarget(this._photoTab);
    tappable.addTarget(this._newStoriesCountPanel);
    this.getEvents().listen(this.getNodeTappable(), 'tapstart', this._onTap);
    this.getEvents().listen(this.getNodeTappable(), 'tapend', this._onTap);
  },

  /**
   * @param {number} count
   */
  updateNewStoriesCount: function(count) {
    if (count > 0) {
      var msg = 'You have ';
      if (count === 1) {
        msg += 'one new story';
      } else {
        if (count > 10) {
          count = 'more than 10';
        }
        msg += count + ' new stories';
      }
      this._newStoriesCountPanel.textContent = msg;
      dom.addClassName(
        this._newStoriesCountPanel,
        cssx('app-ui-composerbar_new-stories-count-shown')
      );
    } else {
      dom.removeClassName(
        this._newStoriesCountPanel,
        cssx('app-ui-composerbar_new-stories-count-shown')
      );
    }
  },

  _onTap: function(event) {
    var tapStart = event.type === 'tapstart';
    dom.alterClassName(event.data, cssx('pressed'), tapStart);
    if (tapStart) {
      return;
    }

    switch (event.data) {
      case this._composeTab:
        this.dispatchEvent(EventType.COMPOSER_OPEN, null, true);
        break;

      case this._newStoriesCountPanel:
        this.dispatchEvent(EventType.NEWSFEED_REFRESH, null, true);
        break;
    }
  },

  _onAnimStep: function(value) {
    this._setTranslateY(
      this._startTranslateY + ~~(value * this._deltaTranslateY));
  },

  _onAnimCheck: function() {
    return this._endTranslateY !== this._translateY;
  },

  _onAnimComplete: function() {
    Class.dispose(this._animator);
    delete this._animator;
  },

  /**
   * @param {number} y
   */
  _setTranslateY: function(y) {
    this._translateY = y;
    this.getNode().style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
  },

  /**
   * @param {string} text
   * @param {string} iconSrc
   */
  _createTab: function(text, iconSrc) {
    var img = dom.createElement(
      'div', cssx('app-ui-composerbar_tab-icon'));

    this.renderImage(img, iconSrc);

    return dom.createElement('div', cssx('app-ui-composerbar_tab'),
      img, text);
  },

  /**
   * @type {Animator}
   */
  _animator: null,
  _visible: false,
  _translateY: 0,
  _deltaTranslateY: 0,
  _startTranslateY: 0,
  _endTranslateY: 0,
  _photoTab: null,
  _composeTab:null
});

exports.ComposerBar = ComposerBar;