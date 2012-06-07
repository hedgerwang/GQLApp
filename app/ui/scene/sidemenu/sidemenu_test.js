/**
 * @fileOverview SideMenu Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/sidemenu/sidemenu_test.html
 */

var Chrome = require('jog/ui/chrome').Chrome;
var SideMenu = require('app/ui/scene/sidemenu').SideMenu;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('SideMenu Test'))
  .demo('demo',
  function(body) {
    var chrome = new Chrome();
    chrome.render(body);

    var menu = new SideMenu();
    menu.render(chrome.getNode());
  });