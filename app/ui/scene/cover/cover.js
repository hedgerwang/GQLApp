/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var FBAPI = require('jog/fbapi').FBAPI;
var FBData = require('jog/fbdata').FBData;
var Scene = require('jog/ui/scene').Scene;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

var Cover = Class.create(Scene, {

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.append(node, dom.createElement('div', null, 'facebook'));
    dom.addClassName(node, cssx('app-ui-scene-cover'));
    return node;
  },

  /** @override} */
  onDocumentReady:function() {
    FBAPI.isLoggedIn().addCallback(this.bind(function(result) {
      if (result) {
        this.dispatchEvent(EventType.FB_SESSION_READY);
      } else {
        // Should've been redirected to login.
      }
    }));
  }

});

exports.Cover = Cover;