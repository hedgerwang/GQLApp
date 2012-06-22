/**
 * @fileOverview TimelineUnit Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/timelineunit/timelineunit_test.html
 */

var TestCase = require('jog/testing').TestCase;
var TimelineUnit = require('app/ui/timelineunit').TimelineUnit;
var asserts = require('jog/asserts').asserts;

(new TestCase('TimelineUnit Test'))
  .demo('demo',
  function(body){
    // var obj = new TimelineUnit();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });