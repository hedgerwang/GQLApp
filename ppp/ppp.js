/**
 * @fileOverview PPP
 * @author Hedger Wang
 */

var APP = require('jog/app').APP;
var AlbumRenderer = require('ppp/ui/page/albumrenderer').AlbumRenderer;
var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var MockData = require('ppp/ui/page/mockdata').MockData;
var Slide = require('ppp/ui/slide').Slide;
var Slides = require('ppp/ui/slides').Slides;
var TouchHelper = require('jog/touchhelper').TouchHelper;
var UserAgent = require('jog/useragent').UserAgent;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var PPP = Class.create(APP, {
  main: function() {
    this._chrome = new Chrome();
    this._chrome.render(document.body);

    for (var id in MockData) {
      var albums = objects.getValueByName('albums.nodes', MockData[id]);
      if (lang.isArray(albums) && albums.length) {
        var slides = new Slides();
        for (var i = 0, j = albums.length; i < j; i++) {
          var slide = new Slide();
          slide.setContent(
            AlbumRenderer.renderCover(albums[i]),
            AlbumRenderer.renderPhotos(albums[i]));
          slides.appendChild(slide);
        }
        this._chrome.appendChild(slides, true);

      }
      break;
    }
  },

  _chrome: null
});

exports.PPP = PPP;
APP.install(PPP);