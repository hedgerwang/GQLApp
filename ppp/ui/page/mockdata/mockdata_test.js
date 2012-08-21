/**
 * @fileOverview MockData Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/ppp/ui/page/mockdata/mockdata_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var MockData = require('ppp/ui/page/mockdata').MockData;

(new TestCase('MockData Test'))
  .demo('demo',
  function(body){
    // var obj = new MockData();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });