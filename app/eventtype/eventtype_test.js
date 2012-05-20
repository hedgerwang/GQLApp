/**
 * @fileOverview EventType Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/eventtype/eventtype_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('EventType Test'))
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });