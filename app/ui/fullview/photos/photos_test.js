/**
 * @fileOverview Photos Test
 * @author Hedger Wang
 *
 * @url http://localhost:8888/app/ui/fullview/photos/photos_test.html
 */

var Album = require('app/ui/story/album').Album;
var Chrome = require('jog/ui/chrome').Chrome;
var Class = require('jog/class').Class;
var EventType = require('app/eventtype').EventType;
var Photo = require('app/ui/story/photo').Photo;
var Photos = require('app/ui/fullview/photos').Photos;
var TestCase = require('jog/testing').TestCase;
var asserts = require('jog/asserts').asserts;

(new TestCase('Photos Test'))
  .demo('demo',
  function(body) {
    // var obj = new Photos();
    var chrome = new Chrome();
    var album = new Album();
    chrome.appendChild(album, true);
    chrome.render(body);

    var i = 0;
    while (i++ < 5) {
      var image = {
        uri: '/images/test/' + i + '.jpg'
      };
      var photo = new Photo(image);
      album.addPhoto(photo);
    }

    var photos;
    album.addEventListener(EventType.STORY_ALBUM_TAP, function() {
      Class.dispose(photos);
      photos = new Photos();
      photos.importAlbum(album);
      chrome.appendChild(photos, true);
    });
  });