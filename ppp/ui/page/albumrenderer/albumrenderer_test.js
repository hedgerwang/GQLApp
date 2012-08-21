/**
 * @fileOverview AlbumRenderer Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/ppp/ui/page/albumrenderer/albumrenderer_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var AlbumRenderer = require('ppp/ui/page/albumrenderer').AlbumRenderer;

(new TestCase('AlbumRenderer Test'))
  .demo('demo',
  function(body){
    // var obj = new AlbumRenderer();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });