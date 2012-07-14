/**
 * @fileOverview Feedbacks Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/feedbacks/feedbacks_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var Feedbacks = require('app/ui/story/feedbacks').Feedbacks;

(new TestCase('Feedbacks Test'))
  .demo('demo',
  function(body){
    // var obj = new Feedbacks();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });