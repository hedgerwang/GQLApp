/**
 * @fileOverview FullStory Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/fullstory/fullstory_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var FullStory = require('app/ui/scene/fullstory').FullStory;

(new TestCase('FullStory Test'))
  .demo('demo',
  function(body){
    // var obj = new FullStory();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });