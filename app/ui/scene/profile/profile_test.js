/**
 * @fileOverview Profile Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/scene/profile/profile_test.html
 */

var Profile = require('app/ui/scene/profile').Profile;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Profile Test'))
  .demo('demo',
  function(body){
    // var obj = new Profile();
  })
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });