import Ember from "ember";
import nearestParent from "../computed/nearest-parent";
import stringify from "../computed/stringify";
import ScrollSandbox from "../mixins/scroll_sandbox";

var set = Ember.set;
var reads = Ember.computed.reads;
var not = Ember.computed.not;

var SelectList = Ember.View.extend(ScrollSandbox, {

  tagName: 'ul',

  classNames: ['select-menu_list'],

  attributeBindings: ['aria-hidden',
                      'aria-labelledby',
                      'aria-disabled',
                      'aria-activedescendant'],

  registerView: function () {
    set(this, 'menu.list', this);
  }.on('didInsertElement'),

  menu: nearestParent("select-menu"),
  popup: nearestParent("popup-menu"),

  isHidden: not('popup.isVisible'),

  // .............................................
  // WAI ARIA attributes
  //

  ariaRole: 'listbox',
  "aria-hidden": stringify("isHidden"),
  "aria-labelledby": reads('menu.label.elementId'),
  "aria-disabled": stringify("menu.disabled"),
  "aria-activedescendant": reads("menu.activeDescendant.elementId")

});

export default SelectList;
