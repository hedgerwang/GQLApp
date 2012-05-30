/**
 * @fileOverview Story Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/story/story_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var Story = require('app/ui/story').Story;

(new TestCase('Story Test'))
  .test('test 1',
  function() {
    asserts.equal(1, 1);
  });