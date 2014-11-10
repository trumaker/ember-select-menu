import Ember from "ember";
import nearestParent from "ember-popup-menu/computed/nearest-parent";
import stringify from "ember-popup-menu/computed/stringify";

var get = Ember.get;
var set = Ember.set;
var alias = Ember.computed.alias;

var SelectOption = Ember.Component.extend({

  tagName: 'li',
  classNames: ['select-option'],
  classNameBindings: ['selected', 'disabled'],
  attributeBindings: ['aria-selected', 'aria-disabled', 'aria-label'],

  ariaRole: 'option',
  "aria-selected": stringify("selected"),
  "aria-disabled": stringify("disabled"),
  "aria-label": alias("label"),

  label: null,
  disabled: false,

  menu: nearestParent("select-menu"),
  popup: nearestParent("popup-menu"),

  registerWithMenu: function () {
    get(this, 'menu.options').unshiftObject(this);
  }.on('didInsertElement'),

  unregisterWithMenu: function () {
    get(this, 'menu.options').removeObject(this);
  }.on('willDestroyElement'),

  activeDescendant: alias("menu.activeDescendant"),
  selection: alias("menu.value"),

  selected: function () {
    return get(this, 'selection') === get(this, 'value');
  }.property('selection', 'value'),

  click: function () {
    if (get(this, 'disabled')) { return; }

    set(this, 'activeDescendant', this);
    set(this, 'selection', get(this, 'value'));
    set(this, 'popup.isActive', false);
  }

});

export default SelectOption;
