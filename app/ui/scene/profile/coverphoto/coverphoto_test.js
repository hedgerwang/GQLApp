/**
 * @fileOverview CoverPhoto Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/profile/coverphoto/coverphoto_test.html
 */

var CoverPhoto = require('app/ui/scene/profile/coverphoto').CoverPhoto;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('CoverPhoto Test'))
  .demo('demo',
  function(body){
    // var obj = new CoverPhoto();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });