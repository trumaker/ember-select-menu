import Ember from "ember";
import nearestParent from "../computed/nearest-parent";
import stringify from "../computed/stringify";

var get = Ember.get;
var set = Ember.set;
var reads = Ember.computed.reads;
var not = Ember.computed.not;

var subscribe = Ember.subscribe;
var unsubscribe = Ember.unsubscribe;
var scheduleOnce = Ember.run.scheduleOnce;
var cancel = Ember.run.cancel;

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
                      'isHovering:hover'],

  ariaRole: 'button',
  "aria-haspopup": 'true',
  "aria-owns": reads('menu.list.elementId'),
  "aria-disabled": stringify("menu.disabled"),
  "aria-expanded": stringify("menu.isActive"),

  menu: nearestParent("select-menu"),

  registerView: function () {
    set(this, 'menu.label', this);
  }.on('didInsertElement'),

  tabindex: 0,

  prompt: reads('menu.prompt'),

  mouseEnter: function () {
    set(this, 'isHovering', true);
  },

  mouseLeave: function () {
    set(this, 'isHovering', false);
  },

  blur: function () {
    set(this, 'isHovering', false);
  },

  activeDescendant: reads('menu.activeDescendant'),
  isPrompting: not('activeDescendant'),

  instrumentActiveDescendant: function () {
    var view = this;
    this.instrumentor = subscribe("render.component.active-descendant", {
      after: function () {
        var activeDescendant = get(view, 'activeDescendant');
        set(view, 'value', activeDescendant.$().html());
      }
    });
  }.on('init'),

  removeInstrumentation: function () {
    unsubscribe(this.instrumentor);
  }.on('destroy'),

  // Schedule a rerender of the label when the active desencdant changes
  activeDescendantDidChange: function () {
    this._timer = scheduleOnce('afterRender', this, 'updateLabel');
  }.observes('activeDescendant').on('init'),

  activeDescendantWillChange: function () {
    cancel(this._timer);
    var activeDescendant = get(this, 'activeDescendant');
    if (activeDescendant) {
      activeDescendant.instrumentName = 'component';
    }
  }.observesBefore('activeDescendant'),

  updateLabel: function () {
    var activeDescendant = get(this, 'activeDescendant');
    if (activeDescendant) {
      activeDescendant.instrumentName = 'component.active-descendant';
      set(this, 'value', activeDescendant.$().html());
    }
  }

});

export default SelectMenuLabel;
