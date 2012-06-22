/**
 * @fileOverview Timeline Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/profile/timeline/timeline_test.html
 */

var TestCase = require('jog/testing').TestCase;
var Timeline = require('app/ui/scene/profile/timeline').Timeline;
var asserts = require('jog/asserts').asserts;

(new TestCase('Timeline Test'))
  .demo('demo',
  function(body){
    // var obj = new Timeline();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });