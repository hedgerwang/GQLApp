/**
 * @fileOverview ActiveSceneScroller Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/behavior/activescenescroller/activescenescroller_test.html
 */

var ActiveSceneScroller = require('app/behavior/activescenescroller').ActiveSceneScroller;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('ActiveSceneScroller Test'))
  .demo('demo',
  function(body){
    // var obj = new ActiveSceneScroller();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });