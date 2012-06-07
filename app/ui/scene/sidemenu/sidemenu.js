/**
 * @fileOverview
 * @author Hedger Wang
 */

var Class = require('jog/class').Class;
var Deferred = require('jog/deferred').Deferred;
var FBData = require('jog/fbdata').FBData;
var Imageable = require('jog/behavior/imageable').Imageable;
var Scene = require('jog/ui/scene').Scene;
var ScrollList = require('jog/ui/scrolllist').ScrollList;
var SearchBar = require('app/ui/searchbar').SearchBar;
var Tappable = require('jog/behavior/tappable').Tappable;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;
var lang = require('jog/lang').lang;
var objects = require('jog/objects').objects;

var SideMenu = Class.create(Scene, {
  /** @override} */
  main: function() {
    this._scrollList = this.appendChild(new ScrollList());
    this._searchBar = this.appendChild(new SearchBar());
  },

  /** @override} */
  dispose: function() {
    Class.dispose(this._tappable);
  },

  /** @override} */
  createNode: function() {
    var node = Scene.prototype.createNode.call(this);
    dom.addClassName(node, cssx('app-ui-scene-sidemenu'));
    return node;
  },

  /** @override} */
  onDocumentReady: function() {
    this._searchBar.render(this.getNode());
    this._scrollList.render(this.getNode());

    this._renderProfile().
      then(this.bind(this._renderFavorites)).
      then(this.bind(this._renderGroups)).
      then(this.bind(this._renderFriendLists)).
      then(this.bind(this._renderOther));

    this._tappable = new Tappable(this.getNode());

    this.getEvents().listen(this._tappable, 'tap', this._onTap);
  },

  /**
   * @param {Event} event
   */
  _onTap: function(event) {
    var name = event.data ? event.data._name : null;

    switch (name) {
      case 'reload':
        window.location.reload();
        break;
    }
  },

  /**
   * @retrun {Deferred}
   */
  _renderProfile: function() {
    return FBData.getProfile(0, true).addCallback(this.bind(function(response) {
      var uid = response.userid;
      var name = objects.getValueByName(uid + '.name', response);
      var src = objects.getValueByName(uid + '.profile_picture.uri', response);
      var item = this._createMenuItem(name, src);
      this._scrollList.addContent(item);
    }))
  },

  /**
   * @retrun {Deferred}
   */
  _renderFavorites: function() {
    return (new Deferred()).addCallback(this.bind(function() {
      var body = dom.createElement('ul', cssx('app-ui-scene-sidemenu_body'),
        this._createHeading('Favorites'),

        this._createMenuItem('News Feed',
          '//s-static.ak.facebook.com/rsrc.php/v2/y8/r/R2NjP5a0R3f.png'),

        this._createMenuItem('Messages',
          '//s-static.ak.facebook.com/rsrc.php/v2/yS/r/Ts7l0QBNRnV.png'),

        this._createMenuItem('Near By',
          '//s-static.ak.facebook.com/rsrc.php/v2/yk/r/BhCnfPi-P2i.png'),

        this._createMenuItem('Events',
          '//s-static.ak.facebook.com/rsrc.php/v2/yL/r/34CgvWdkzyW.png'),

        this._createMenuItem('Find Friends',
          '//s-static.ak.facebook.com/rsrc.php/v2/y4/r/E6jmLaCoCUD.png')
      );
      this._scrollList.addContent(body);
    })).succeed(true);
  },

  /**
   * @retrun {Deferred}
   */
  _renderGroups: function() {
    return FBData.getGroups(6, null, true).addCallback(this.bind(function(response) {
      var uid = response.userid;
      var groups = objects.getValueByName(uid + '.groups.nodes', response);

      if (lang.isArray(groups) && groups.length) {
        var body = dom.createElement('ul', cssx('app-ui-scene-sidemenu_body'),
          this._createHeading('Groups'));

        for (var i = 0, group; group = groups[i]; i++) {
          var uri = objects.getValueByName('profile_picture.uri', group);

          // TODO(hedger): What to do with this hack?
          if (uri.indexOf('graph.facebook.com') > -1) {
            uri = uri.replace('graph.facebook.com', 'www.facebook.com');
          }

          body.appendChild(this._createMenuItem(group.name, uri));
        }

        this._scrollList.addContent(body);
      }
    }));
  },

  /**
   * @retrun {Deferred}
   */
  _renderFriendLists: function() {
    return FBData.getFriendsList(3, null, true).addCallback(
      this.bind(function(response) {
        var uid = response.userid;

        var friendLists = objects.getValueByName(
          uid + '.friend_lists.nodes', response);

        if (lang.isArray(friendLists) && friendLists.length) {
          var body = dom.createElement('ul', cssx('app-ui-scene-sidemenu_body'),
            this._createHeading('Friends'));

          for (var i = 0, list; list = friendLists[i]; i++) {
            body.appendChild(
              this._createMenuItem(
                list.name,
                '//s-static.ak.facebook.com/rsrc.php/v2/y4/r/E6jmLaCoCUD.png'
              )
            );
          }

          this._scrollList.addContent(body);
        }
      })
    );
  },

  /**
   * @retrun {Deferred}
   */
  _renderOther: function() {
    return (new Deferred()).addCallback(this.bind(function() {
      var body = dom.createElement(
        'ul',
        cssx('app-ui-scene-sidemenu_body'),
        this._createHeading('Other')
      );

      body.appendChild(this._createMenuItem('Reload APP', null, null, 'reload'));
      body.appendChild(this._createMenuItem('Logout', null, null, 'logout'));
      this._scrollList.addContent(body);
    })).succeed(true);
  },

  /**
   * @param {string} text
   * @param {string} iconSrc
   * @param {Object=} opt_data
   * @param {string=} opt_name
   * @return {Node}
   */
  _createMenuItem: function(text, iconSrc, opt_data, opt_name) {
    var icon = dom.createElement('div',
      cssx('app-ui-scene-sidemenu_item-icon'));

    if (iconSrc) {
      new Imageable(icon, iconSrc);
    }

    var node = dom.createElement('li', cssx('app-ui-scene-sidemenu_item'),
      icon,
      dom.createElement('div', cssx('app-ui-scene-sidemenu_item-text'), text));

    if (opt_name) {
      node._name = opt_name;
    }

    this._tappable.addTarget(node);
    return node;
  },

  /**
   * @param {string} text
   * @param {Object} data
   * @return {Node}
   */
  _createHeading: function(text, data) {
    return dom.createElement('li', cssx('app-ui-scene-sidemenu_heading'), text);
  },

  /**
   * @type {SimpleScrollList}
   */
  _scrollList: null,

  /**
   * @type {Imageable}
   */
  _imageable: null
});

exports.SideMenu = SideMenu;