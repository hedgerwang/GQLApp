/**
 * @fileOverview Photo Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/photo/photo_test.html
 */

var Photo = require('app/ui/story/photo').Photo;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Photo Test'))
  .demo('demo',
  function(body){
    // var obj = new Photo();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });