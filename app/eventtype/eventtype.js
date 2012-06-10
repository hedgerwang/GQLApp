var EventType = {
  ACTIVE_SCENE_SCROLLER_SCROLLOUT: 0,
  FB_SESSION_READY: 1,
  JEWELBAR_SIDE_MENU_TOGGLE: 10,
  JEWELBAR_BACK: 11,
  SEARCH_BAR_ON_SEARCH_START: 20,
  SEARCH_BAR_ON_SEARCH_END: 21,
  SEARCH_BAR_ON_SEARCH_SELECT: 22,
  SIDE_MENU_HOME: 30,
  SIDE_MENU_PROFILE: 31,
  SIDE_MENU_DEVELOPER: 32,
  STORY_ALBUM_TAP: 40,
  STORY_PHOTO_TAP: 41,
  VIEW_PROFILE: 50
};

if (__DEV__) {
  // Make name more readable.
  for (var name in EventType) {
    EventType[name] = name;
  }
}

exports.EventType = EventType;
