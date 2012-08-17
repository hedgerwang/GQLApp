/**
 * @fileOverview PPP Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/ppp/ppp_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var PPP = require('ppp').PPP;

(new TestCase('PPP Test'))
  .demo('demo',
  function(body){
    // var obj = new PPP();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });