/**
 * @fileOverview Chrome Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/chrome/chrome_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Chrome Test'))
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });