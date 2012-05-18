/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBAPI = require('jog/fbapi').FBAPI;
var Scene = require('jog/ui/scene').Scene;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var Cover = Class.create({
  main: function() {
    Scene.call(this);
  },

  extend: Scene,

  members: {
    createNode: function() {
      var node = this.superPrototype.createNode.call(this);
      dom.addClassName(node, cssx('app-ui-scene-cover'));
      return node;
    },

    onDocumentReady:function() {
      FBAPI.isLoggedIn().addCallback(lang.bind(this, function(result) {
        if (!this.isDisposed()) {
          this.dispatchEvent(EventType.EVT_FB_SESSION_READY);
//          dom.addClassName(this.getNode(), cssx('app-ui-scene-cover_ready'));
//          FBAPI.query('me()').addCallback(lang.bind(this, function(response) {
//            this.getNode().textContent = JSON.stringify(response);
//          }));
        }
      }));
    }
  }
});

exports.Cover = Cover;