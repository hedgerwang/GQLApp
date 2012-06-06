/**
 * @fileOverview SearchBar Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/searchbar/searchbar_test.html
 */

var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

var SearchBar = require('app/ui/searchbar').SearchBar;

(new TestCase('SearchBar Test'))
  .demo('demo',
  function(body) {
    var obj = new SearchBar();
    obj.render(body);
  });