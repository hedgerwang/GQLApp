var EventType = {
  ACTIVE_SCENE_SCROLLER_SCROLLOUT: 0,
  COMPOSER_CLOSE: 1,
  COMPOSER_OPEN: 2,
  COMPOSER_POST: 3,
  FB_SESSION_READY: 3,
  JEWELBAR_SIDE_MENU_TOGGLE: 10,
  JEWELBAR_BACK: 11,
  JEWELBAR_SCROLL_TO_TOP: 12,
  NEWSFEED_REFRESH: 13,
  PHOTOS_VIEW_CLOSE: 15,
  PHOTOS_VIEW_READY: 16,
  SEARCH_BAR_ON_SEARCH_START: 20,
  SEARCH_BAR_ON_SEARCH_END: 21,
  SEARCH_BAR_ON_SEARCH_SELECT: 22,
  SIDE_MENU_HOME: 30,
  SIDE_MENU_PROFILE: 31,
  SIDE_MENU_DEVELOPER: 32,
  STORY_ALBUM_TAP: 40,
  STORY_PHOTO_TAP: 41,
  VIEW_PROFILE: 50,
  VIEW_STORY: 51
};

if (__DEV__) {
  // Make name more readable.
  var i = 0;
  for (var name in EventType) {
    EventType[name] = name + ':' + (i++);
  }
}

exports.EventType = EventType;
