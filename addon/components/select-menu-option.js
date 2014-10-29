import Ember from "ember";
import nearestParent from "../computed/nearest-parent";

var get = Ember.get;
var set = Ember.set;
var alias = Ember.computed.alias;
var w = Ember.String.w;

var addObserver = Ember.addObserver;
var removeObserver = Ember.removeObserver;
var propertyDidChange = Ember.propertyDidChange;

var SelectMenuOption = Ember.Component.extend({

  tagName: 'li',
  classNames: ['select-menu-option'],
  classNameBindings: ['isSelected:selected'],
  attributeBindings: ['aria-selected'],

  ariaRole: 'option',
  "aria-selected": function () {
    return String(get(this, 'isSelected'));
  }.property('isSelected'),

  "search-by": alias('searchBy'),
  searchBy: function (key, value) {
    return w(value || '');
  }.property(),

  searchStrings: function () {
    var model = get(this, 'model');
    if (!model) { return []; }
    return get(this, 'searchBy').map(function (key) {
      return get(model, key);
    }, this);
  }.property('model'),

  searchByWillChange: function () {
    get(this, 'searchBy').forEach(function (property) {
      removeObserver(this, property, 'searchStringsDidChange');
    }, this);
  }.observesBefore('searchBy'),

  searchByDidChange: function () {
    get(this, 'searchBy').forEach(function (property) {
      addObserver(this, property, 'searchStringsDidChange');
    }, this);
    this.notifyPropertyChange('searchStrings');
  }.observes('searchBy').on('init'),

  searchStringsDidChange: function () {
    propertyDidChange(this, 'searchStrings');
  },

  menu: nearestParent("select-menu"),
  popup: nearestParent("popup-menu"),

  registerWithMenu: function () {
    get(this, 'menu.options').unshiftObject(this);
  }.on('didInsertElement'),

  unregisterWithMenu: function () {
    get(this, 'menu.options').removeObject(this);
  }.on('willDestroyElement'),

  activeDescendant: alias("menu.activeDescendant"),
  selection: alias("menu.selection"),

  isSelected: function () {
    return get(this, 'selection') === get(this, 'model');
  }.property('selection', 'model'),

  click: function () {
    set(this, 'activeDescendant', this);
    set(this, 'selection', get(this, 'model'));
    set(this, 'popup.isActive', false);
  }

});

export default SelectMenuOption;
