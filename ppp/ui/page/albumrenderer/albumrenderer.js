var objects = require('jog/objects').objects;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;

function styleBG(uri) {
  return uri ? 'background-image:url(' + uri + ');' : '';
}

function borderNode() {
  return dom.createElement('i', cssx('ppp-ui-page-album-renderer-inset-border'));
}

var AlbumRenderer = {
  renderCover:function(data) {
    var coverPhoto = data.cover_photo;
    var photos = objects.getValueByName('photos.nodes', data);
    if (coverPhoto) {
      var node = dom.createElement('div');

      node.appendChild(dom.createElement('div', {
        className: cssx('ppp-ui-page-album-renderer-cover-image-big'),
        style: styleBG(objects.getValueByName('image.uri', coverPhoto))
      }));

      if (lang.isArray(photos) && photos.length > 2) {
        // photos = ([]).concat([photos[0], photos[1]]);
        if (photos.length === 3) {
          dom.addClassName(node, cssx('ppp-ui-page-album-renderer-cover-layout-2'));
        } else if (photos.length > 3) {
          dom.addClassName(node, cssx('ppp-ui-page-album-renderer-cover-layout-3'));
        }

        // Skip the first one (cover photo).
        for (var i = 1, j = photos.length; i < j || i < 4; i++) {
          node.appendChild(dom.createElement(
            'div',
            {
              className: cssx('ppp-ui-page-album-renderer-cover-image-small') +
                ' n' + i,
              style: styleBG(objects.getValueByName('image.uri', photos[i]))
            },
            borderNode()));
        }
      }

      return dom.getOuterHTML(node);
    } else {
      if (__DEV__) {
        throw new Error('No Cover Photo');
      }
    }

    return JSON.stringify(data);
  },

  renderPhotos:function(data) {
    var photos = objects.getValueByName('photos.nodes', data);
    if (lang.isArray(photos) && photos.length > 0) {
      // photos = photos.splice(0, 9);

      var node = dom.createElement('div',
        cssx('ppp-ui-page-album-renderer-photos-layout'));

      photos = [].concat(photos).concat(photos).concat(photos);
      photos.length = 4;


      for (var i = 0, j = photos.length; i < j; i++) {
        node.appendChild(dom.createElement(
          'div',
          {
            className: cssx('ppp-ui-page-album-renderer-photos-image') +
              ' n' + (i + 1),
            style: styleBG(objects.getValueByName('image.uri', photos[i]))
          },
          borderNode()));
      }

      var className;
      switch (photos.length) {
        case 1:
          className = cssx('ppp-ui-page-album-renderer-photos-layout-1');
          break;

        case 2:
          className = cssx('ppp-ui-page-album-renderer-photos-layout-2');
          break;

        case 4:
          className = cssx('ppp-ui-page-album-renderer-photos-layout-4');
          break;


        case 9:
          className = cssx('ppp-ui-page-album-renderer-photos-layout-9');
          break;

        default:
          className = cssx('ppp-ui-page-album-renderer-photos-layout-0');
          break;
      }

      dom.addClassName(node, className);
      return dom.getOuterHTML(node);
    }
    return JSON.stringify(data);
  }
};

exports.AlbumRenderer = AlbumRenderer;