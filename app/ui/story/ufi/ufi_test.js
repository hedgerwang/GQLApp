/**
 * @fileOverview UFI Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/ufi/ufi_test.html
 */

var TestCase = require('jog/testing').TestCase;
var UFI = require('app/ui/story/ufi').UFI;
var asserts = require('jog/asserts').asserts;

(new TestCase('UFI Test'))
  .demo('demo',
  function(body){
    // var obj = new UFI();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });