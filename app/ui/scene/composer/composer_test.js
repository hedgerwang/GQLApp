/**
 * @fileOverview Composer Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/composer/composer_test.html
 */

var Composer = require('app/ui/scene/composer').Composer;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Composer Test'))
  .demo('demo',
  function(body){
    var obj = new Composer();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });