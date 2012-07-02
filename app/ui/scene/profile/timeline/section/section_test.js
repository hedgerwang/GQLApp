/**
 * @fileOverview Section Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/profile/timeline/section/section_test.html
 */

var Section = require('app/ui/scene/profile/timeline/section').Section;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Section Test'))
  .demo('demo',
  function(body){
    // var obj = new Section();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });