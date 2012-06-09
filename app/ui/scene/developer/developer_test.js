/**
 * @fileOverview Develope Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/developer/developer_test.html
 */

var Chrome = require('jog/ui/chrome').Chrome;
var Developer = require('app/ui/scene/developer').Developer;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Develope Test'))
  .demo('demo',
  function(body) {
    var chrome = new Chrome();
    chrome.appendChild(new Developer(), true);
    chrome.render(body);
  });