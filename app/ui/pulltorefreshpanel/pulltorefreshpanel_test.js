/**
 * @fileOverview PullToRefreshPanel Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/pulltorefreshpanel/pulltorefreshpanel_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var PullToRefreshPanel = require('app/ui/pulltorefreshpanel').PullToRefreshPanel;

(new TestCase('PullToRefreshPanel Test'))
  .demo('demo',
  function(body){
    // var obj = new PullToRefreshPanel();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });