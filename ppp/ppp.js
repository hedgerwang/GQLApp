/**
 * @fileOverview PPP
 * @author Hedger Wang
 */

var APP = require('jog/app').APP;
var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var UserAgent = require('jog/useragent').UserAgent;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var Slide = require('ppp/ui/slide').Slide;

var PPP = Class.create(APP, {
  main: function() {
    this._chrome = new Chrome();
    this._chrome.render(document.body);

    var slide = new Slide();
    this._chrome.appendChild(slide, true);
    slide.setEnabled(true);
  },

  _chrome: null
});

exports.PPP = PPP;
APP.install(PPP);