/**
 * @fileOverview Input Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/input/input_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var Input = require('app/ui/story/input').Input;

(new TestCase('Input Test'))
  .demo('demo',
  function(body){
    // var obj = new Input();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });