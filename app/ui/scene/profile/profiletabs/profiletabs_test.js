/**
 * @fileOverview ProfileTabs Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/profile/profiletabs/profiletabs_test.html
 */

var ProfileTabs = require('app/ui/scene/profile/profiletabs').ProfileTabs;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('ProfileTabs Test'))
  .demo('demo',
  function(body){
    // var obj = new ProfileTabs();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });