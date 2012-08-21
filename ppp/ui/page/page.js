/**
 * @fileOverview
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Page = Class.create(BaseUI, {
  /** @override */
  main: function() {

  },
  /** @override */
  createNode: function() {
    this._cover = dom.createElement('div',
      cssx('ppp-ui-page-side') + ' ' + cssx('ppp-ui-page-cover'));

    this._contentLeft = dom.createElement('div',
      cssx('ppp-ui-page-side') + ' ' + cssx('ppp-ui-page-content-left'));

    this._contentRight = dom.createElement('div',
      cssx('ppp-ui-page-side') + ' ' + cssx('ppp-ui-page-content-right'));

    this._frontShadow = dom.createElement('div',
      cssx('ppp-ui-page-shadow') + ' ' + cssx('ppp-ui-page-front-shadow'));

    this._backShadow = dom.createElement('div',
      cssx('ppp-ui-page-shadow') + ' ' + cssx('ppp-ui-page-back-shadow'));

    return dom.createElement('div', cssx('ppp-ui-page'),
      this._cover,
      this._contentLeft,
      this._contentRight,
      this._frontShadow,
      this._backShadow
    );
  },

  /** @override */
  dispose: function() {

  },

  /**
   * @param {string} pageCover
   * @param {string} pageContent
   */
  setContent: function(pageCover, pageContent) {
    if (!this._cover) {
      this.getNode();
    }

    this._cover.innerHTML = '<div class="' + cssx('ppp-ui-page-cover-body') +
      '">' + pageCover + '</div>';

    this._contentLeft.innerHTML = '<div class="' +
      cssx('ppp-ui-page-content-body') + '">' + pageContent + '</div>';

    this._contentRight.innerHTML = '<div class="' +
      cssx('ppp-ui-page-content-body') + '">' + pageContent + '</div>';
  },

  /**
   * @param {number} degree
   */
  setDegree: function(degree) {
    if (__DEV__) {
      if (degree < 0 || degree > 180) {
        throw new Error('Invalid degree ' + degree);
      }
    }

    if (degree === this._degree) {
      return;
    }

    if (degree === 0) {
      this._setContentVisible(false);
    } else if (this._degree === 0) {
      this._setContentVisible(true);
    }

    this._degree = degree;

    // Ensure node is created.
    this.getNode();
    if (degree == 90) {
      // do nothing.
    } else if (degree > 90) {
      this._setFrontVisible(false);
      this._contentLeft.style.webkitTransform = 'rotateY(' + (180 - degree) + 'deg)';
    } else {
      this._setFrontVisible(true);
      this._cover.style.webkitTransform = 'rotateY(-' + degree + 'deg)';
    }

    this._updateShadow();
  },

  _setContentVisible:function(visible) {
    this._contentLeft.style.display = visible ? '' : 'hidden';
    this._contentRight.style.display = visible ? '' : 'hidden';
  },

  _updateShadow: function() {
    var degree = this._degree;
    var opacity = 0;
    var percent = 0;

    if (degree == 90) {
      // do nothing.
    } else if (degree > 90) {
      this._setFrontVisible(false);
      percent = (degree - 90) / 90;
    } else {
      percent = (90 - degree) / 90;
    }

    if (percent) {
      opacity = Math.round(0.8 * percent * 100) / 100;
    }

    if (opacity !== this._shadowOpacity) {
      this._shadowOpacity = opacity;
      this._backShadow.style.opacity = opacity;
      opacity = (1 - percent) * 0.5;
      this._frontShadow.style.opacity = opacity;
    }

    var showFrontShadow = degree > 0 && degree < 180;
    if (showFrontShadow !== this._showFrontShadow) {
      this._showFrontShadow = showFrontShadow;
      this._frontShadow.style.visibility = showFrontShadow ?
        'visible' : 'hidden';
    }
  },

  _setFrontVisible: function(visible) {
    if (visible !== this._frontVisible) {
      this._frontVisible = visible;
      dom.alterClassName(
        this.getNode(), cssx('ppp-ui-page-expanded'), !visible);
      this._cover.style.visibility = visible ? 'visible' : 'hidden';
      this._contentLeft.style.visibility = visible ? 'hidden' : 'visible';
      if (visible) {
        this._cover.appendChild(this._frontShadow);
      } else {
        this._contentLeft.appendChild(this._frontShadow);
      }
    }
  },

  /**
   * @type {number}
   */
  _shadowOpacity: 0,

  /**
   * @type {boolean}
   */
  _frontVisible: true,

  /**
   * @type {Element}
   */
  _cover: null,

  /**
   * @type {Element}
   */
  _contentLeft: null,

  /**
   * @type {Element}
   */
  _contentRight: null,

  /**
   * @type {Element}
   */
  _frontShadow: null,

  /**
   * @type {Element}
   */
  _backShadow: null,

  /**
   * @type {number}
   */
  _degree: 0
});

exports.Page = Page;