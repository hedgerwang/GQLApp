/**
 * @fileOverview UFI Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/ufi/ufi_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var UFI = require('app/ui/story/ufi').UFI;

(new TestCase('UFI Test'))
  .demo('demo',
  function(body){
    // var obj = new UFI();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });