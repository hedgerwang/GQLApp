/**
 * @fileOverview app/ui/jewel/jewel.js Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/jewel/jewel_test.html
 */

var Jewel = require('app/ui/jewelbar').JewelBar;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('app/ui/jewelbar/jewelbar.js Test'))
  .demo('DEMO',
  function(body) {
    var jewel = new Jewel();
    jewel.render(body);
  });