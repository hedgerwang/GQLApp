/**
 * @fileOverview Album Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/album/album_test.html
 */

var Album = require('app/ui/story/album').Album;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Album Test'))
  .demo('demo',
  function(body){
    // var obj = new Album();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });