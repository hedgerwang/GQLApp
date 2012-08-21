/**
 * @fileOverview Page Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/ppp/ui/page/page_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var Page = require('ppp/ui/page').Page;

(new TestCase('Page Test'))
  .demo('demo',
  function(body){
    // var obj = new Page();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });