import Ember from "ember";
import nearestParent from "ember-popup-menu/computed/nearest-parent";
import stringify from "ember-popup-menu/computed/stringify";

var get = Ember.get;
var set = Ember.set;
var reads = Ember.computed.reads;
var not = Ember.computed.not;
var bind = Ember.run.bind;
var keys = Ember.keys;

var scheduleOnce = Ember.run.scheduleOnce;

var $ = Ember.$;

var SelectMenuLabel = Ember.View.extend({

  tagName: 'a',

  classNames: ['select-menu_label'],
  templateName: 'select-menu-label',

  attributeBindings: ['aria-haspopup',
                      'aria-disabled',
                      'aria-expanded',
                      'aria-owns',
                      'tabindex'],

  classNameBindings: ['isPrompting:is-prompting',
                      'menu.isActive:active',
                      'isHovering:hover',
                      'menu.disabled:disabled'],

  menu: nearestParent("select-menu"),
  prompt: reads('menu.prompt'),

  ariaRole: 'button',
  "aria-haspopup": 'true',
  "aria-owns": reads('menu.list.elementId'),
  "aria-disabled": stringify("menu.disabled"),
  "aria-expanded": stringify("menu.isActive"),

  tabindex: 0,

  /** @private
    Attach events to labels that having a matching for attribute to this
    select menu.
   */
  didInsertElement: function () {
    var selector = "label[for='%@']".fmt(get(this, 'elementId'));
    var eventManager = this._eventManager = {
      mouseenter: bind(this, 'set', 'isHovering', true),
      mouseleave: bind(this, 'set', 'isHovering', false)
    };

    keys(eventManager).forEach(function (event) {
      $(document).on(event, selector, eventManager[event]);
    });
  },

  /** @private
    Cleanup event delegation.
   */
  willDestroyElement: function () {
    var selector = "label[for='%@']".fmt(get(this, 'elementId'));
    var eventManager = this._eventManager;

    keys(eventManager).forEach(function (event) {
      $(document).off(event, selector, eventManager[event]);
    });
  },

  blur: function () {
    set(this, 'isHovering', false);
  },

  activeDescendant: reads('menu.activeDescendant'),
  isPrompting: not('activeDescendant'),

  activeDescendantDidChange: function () {
    scheduleOnce('afterRender', this, 'sync');
  }.observes('activeDescendant').on('init'),

  sync: function () {
    var activeDescendant = get(this, 'activeDescendant');
    set(this, 'value', activeDescendant ? activeDescendant.$().html() : null);
  }

});

export default SelectMenuLabel;
