/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var LoadingIndicator = require('jog/ui/loadingindicator').LoadingIndicator;
var FBAPI = require('jog/fbapi').FBAPI;
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
    this.appendChild(new LoadingIndicator(), true);

    FBAPI.isLoggedIn().addCallback(this.bind(function(result) {
      if (!this.disposed) {
        this.dispatchEvent(EventType.EVT_FB_SESSION_READY);
      }
    }));
  }

});

exports.Cover = Cover;