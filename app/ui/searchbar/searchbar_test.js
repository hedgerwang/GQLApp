/**
 * @fileOverview SearchBar Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/searchbar/searchbar_test.html
 */

var SearchBar = require('app/ui/searchbar').SearchBar;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('SearchBar Test'))
  .demo('demo',
  function(body) {
    var obj = new SearchBar();
    obj.render(body);
  });