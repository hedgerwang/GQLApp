/**
 * @fileOverview ComposerBar Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/composerbar/composerbar_test.html
 */

var ComposerBar = require('app/ui/composerbar').ComposerBar;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('ComposerBar Test'))
  .demo('demo',
  function(body){
    // var obj = new ComposerBar();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });