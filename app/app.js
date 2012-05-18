/**
 * @fileOverview
 * @author Hedger Wang
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var Login = require('app/ui/scene/login').Login;
var dom = require('jog/dom').dom;

var App = Class.create({
  main: function() {
    var chrome = new Chrome();

    var loginScene = new Login();
    loginScene.render(chrome.getNode());

    chrome.render(dom.getDocument().body);
  }
});

window.addEventListener('load', function() {
  new App();
});