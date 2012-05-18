/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var FBAPI = require('jog/fbapi').FBAPI;
var Scene = require('jog/ui/scene').Scene;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;


var Login = Class.create({
  main: function() {
    Scene.call(this);
  },

  extend: Scene,

  members: {
    createNode: function() {
      var node = this.superPrototype.createNode.call(this);
      dom.addClassName(node, cssx('app-up-scene-login'));
      return node;
    },

    onDocumentReady:function() {
      FBAPI.ensureLogin().addCallback(function(result) {
        alert(result);
      });
    }
  }
});

exports.Login = Login;