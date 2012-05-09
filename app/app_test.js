/**
 * @fileOverview app/app.js Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/app_test.html
 */

var TestCase = require('/jog/testing').TestCase;
var asserts = require('/jog/asserts').asserts;

(new TestCase('app/app.js Test'))
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });