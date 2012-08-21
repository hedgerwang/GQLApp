/**
 * @fileOverview Slide Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/ppp/ui/slide/slide_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var Slide = require('ppp/ui/slide').Slide;

(new TestCase('Slide Test'))
  .demo('demo',
  function(body){
    // var obj = new Slide();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });