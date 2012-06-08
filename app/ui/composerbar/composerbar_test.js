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
  function(body) {
    var bar = new ComposerBar();
    bar.render(body);
    setTimeout(function() {
      bar.setVisible(false);
    }, 0);
    setTimeout(function() {
      bar.setVisible(true);
    }, 500);
  });