import Ember from "ember";
import SelectMenuLabel from "../views/select-menu-label";
import nearestChild from "../computed/nearest-child";

var get = Ember.get;
var next = Ember.run.next;
var cancel = Ember.run.cancel;
var later = Ember.run.later;
var set = Ember.set;
var bind = Ember.run.bind;

var guidFor = Ember.guidFor;

var filterBy = Ember.computed.filterBy;
var reads = Ember.computed.reads;
var alias = Ember.computed.alias;

var RSVP = Ember.RSVP;
var $ = Ember.$;


// Key code mappings
var ESC              = 27,
    UP               = 38,
    DOWN             = 40,
    BACKSPACE        = 8,
    TAB              = 9,
    ENTER            = 13,
    SHIFT            = 16,
    CTRL             = 17,
    ALT              = 18,
    CAPS_LOCK        = 20,
    PAGE_DOWN        = 33,
    PAGE_UP          = 34,
    END              = 35,
    INSERT           = 36,
    DELETE           = 46,
    LEFT_WINDOW_KEY  = 91,
    RIGHT_WINDOW_KEY = 92,
    SELECT_KEY       = 93,
    NUM_LOCK         = 144,
    SCROLL_LOCK      = 145;


var SelectMenu = Ember.Component.extend({

  init: function () {
    if (get(this, 'elementId') !== guidFor(this)) {
      set(this, 'inheritedId', get(this, 'elementId'));
      set(this, 'elementId', guidFor(this));
    }

    this._super();
  },

  createChildView: function (childView, options) {
    if (SelectMenuLabel.detect(childView)) {
      options.elementId = get(this, 'inheritedId');
    }
    return this._super(childView, options);
  },

  classNames: ['select-menu'],

  disabled: false,

  options: function () {
    return [];
  }.property(),

  activeDescendants: filterBy('options', 'isSelected'),
  activeDescendant: reads('activeDescendants.firstObject'),

  searchString: null,
  isActive: alias('popup.isActive'),

  prompt: null,

  popup: nearestChild('popup-menu'),

  /**
    The item of the content that is currently selected.

    If the {{select-menu}} has a prompt, then the selection
    will by default be null. Otherwise, the selection will
    be the first item in the content.

    @property selection
    @type Object
    @default null
   */
  selection: function (key, value) {
    var hasPrompt = !!get(this, 'prompt');
    var selection = value;

    if (hasPrompt) {
      if (selection && selection.then) {
        var menu = this;
        RSVP.Promise.cast(selection).then(function (selection) {
          if (menu.isDestroyed) { return; }
          set(menu, 'selection', selection);
        });
      }
    } else if (selection == null) {
      next(this, function () {
        if (this.isDestroyed || get(this, 'prompt')) { return; }
        var firstOption = get(this, 'options.firstObject.model');
        if (firstOption) {
          set(this, 'selection', firstOption);
        }
      });
    }

    return selection;
  }.property(),


  _shouldShowPrompt: function () {
    var hasPrompt = !!get(this, 'prompt');
    if (!hasPrompt && get(this, 'selection') == null) {
      this.notifyPropertyChange('selection');
    }
  }.observes('options.[]', 'prompt').on('init'),

  /** @private
    Attach events to labels that having a matching for attribute to this
    select menu.
   */
  didInsertElement: function () {
    var selector = "label[for='%@']".fmt(get(this, 'label.elementId'));

    $(document).on('mouseenter', selector, bind(this, 'mouseEnterLabel'));
    $(document).on('mouseleave', selector, bind(this, 'mouseLeaveLabel'));
  },

  /** @private
    Cleanup event delegation.
   */
  willDestroyElement: function () {
    var selector = "label[for='%@']".fmt(get(this, 'label.elementId'));
    $(document).off('mouseenter', selector);
    $(document).off('mouseleave', selector);
  },

  mouseEnterLabel: function (evt) {
    get(this, 'label').trigger('mouseEnter', evt);
  },

  mouseLeaveLabel: function (evt) {
    get(this, 'label').trigger('mouseLeave', evt);
  },

  /**
    Interpret keyboard events
   */
  keyDown: function (evt) {
    var code = (evt.keyCode ? evt.keyCode : evt.which);
    var search = get(this, 'searchString');

    // If the meta key was held, don't do anything.
    if (evt.metaKey) {
      if (String.fromCharCode(code).toLowerCase() === 'a') {
        code = SELECT_KEY;
      } else {
        return;
      }
    }

    // Ignore all events if the select is disabled
    if (get(this, 'disabled')) { return; }

    switch (code) {
    case UP:
      if (get(this, 'isActive')) {
        this.selectPrevious();
      }
      set(this, 'isActive', true);

      break;
    case DOWN:
      if (get(this, 'isActive')) {
        this.selectNext();
      }
      set(this, 'isActive', true);

      break;
    case ESC:
      set(this, 'isActive', false);

      break;

    // Allow tabs to pass through
    case TAB:
    case ENTER:
      set(this, 'isActive', false);
      return;

    // A whitelist of characters to let the browser handle
    case SHIFT:
    case CTRL:
    case ALT:
    case CAPS_LOCK:
    case PAGE_DOWN:
    case PAGE_UP:
    case END:
    case INSERT:
    case DELETE:
    case LEFT_WINDOW_KEY:
    case RIGHT_WINDOW_KEY:
    case NUM_LOCK:
    case SCROLL_LOCK:
      return;

    case SELECT_KEY:
      break;

    case BACKSPACE:
      if (search) {
        set(this, 'searchString', search.slice(0, -1));
      }

      break;
    default:
      var chr = String.fromCharCode(code);

      // Append
      if (search) {
        set(this, 'searchString', search + chr);
      } else {
        if (chr === ' ') {
          this.toggleProperty('isActive');
        } else {
          set(this, 'isActive', true);
          set(this, 'searchString', chr);
        }
      }
    }

    evt.preventDefault();
  },

  /**
    Selects the next item in the option list.
   */
  selectNext: function () {
    var options = get(this, 'options');
    var activeDescendant = get(this, 'activeDescendant');
    var index;

    if (options) {
      if (activeDescendant) {
        index = options.indexOf(activeDescendant);
      } else {
        index = -1;
      }

      var option = options.objectAt(Math.min(index + 1, get(options, 'length') - 1));
      if (option !== activeDescendant) {
        set(this, 'activeDescendant', option);
        set(this, 'selection', get(option, 'model'));
      }
    }
  },

  /**
    Selects the previous item in the option list.
   */
  selectPrevious: function () {
    var options = get(this, 'options');
    var activeDescendant = get(this, 'activeDescendant');
    var index;

    if (options) {
      if (activeDescendant) {
        index = options.indexOf(activeDescendant);
      } else {
        index = get(options, 'length');
      }

      var option = options.objectAt(Math.max(index - 1, 0));
      if (option !== activeDescendant) {
        set(this, 'activeDescendant', option);
        set(this, 'selection', get(option, 'model'));
      }
    }
  },

  /**
    Locally iterate through options and find the
    best match. After 500 milliseconds of inactivity,
    the search is reset, allowing users to search again.
   */
  searchStringDidChange: function () {
    if (this.__timer) {
      cancel(this.__timer);
    }

    var options = get(this, 'options');
    var search = get(this, 'searchString');

    if (options && search) {
      var length = get(options, 'length'),
          match = null,
          start,
          matchIndex;

      search = search.toUpperCase();

      // Continue searching from the index of
      // the last search match
      if (this.__matchIndex) {
        start = Math.min(this.__matchIndex, length - 1);
      } else {
        start = 0;
      }

      var searcher = function (string) {
        return String(string || '').toUpperCase().indexOf(search) === 0;
      };

      // Search from the current selection
      // for the next match
      for (var i = start; i < length; i++) {
        var option = options.objectAt(i);
        match = get(option, 'searchStrings').find(searcher);

        // Break on the first match,
        // if a user would like to match
        // a more specific entry, they should
        // continue typing
        if (match) {
          match = option;
          matchIndex = i;
          break;
        }
      }

      // Stash the last matched search item
      // so we can continue searching from that
      // index on consective searches
      if (match != null) {
        set(this, 'activeDescendant', match);
        set(this, 'selection', get(match, 'model'));
        this.__matchIndex = matchIndex;
      }
    }

    if (search) {
      this.__timer = later(this, this.resetSearch, 750);
    }
  }.observes('searchString'),

  /**
    Reset the `searchString`.
   */
  resetSearch: function () {
    this.__timer = null;
    this.__matchIndex = null;
    set(this, 'searchString', null);
  }
});

export default SelectMenu;
