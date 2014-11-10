import Ember from "ember";
import nearestParent from "ember-popup-menu/computed/nearest-parent";
import stringify from "ember-popup-menu/computed/stringify";
import ScrollSandbox from "ember-popup-menu/mixins/scroll_sandbox";

var reads = Ember.computed.reads;
var not = Ember.computed.not;

var SelectMenuList = Ember.View.extend(ScrollSandbox, {

  tagName: 'ul',

  classNames: ['select-menu_list'],

  menu: nearestParent("select-menu"),
  popup: nearestParent("popup-menu"),

  isHidden: not('popup.isVisible'),

  // .............................................
  // WAI ARIA attributes
  //

  attributeBindings: ['aria-hidden',
                      'aria-labelledby',
                      'aria-disabled',
                      'aria-activedescendant'],

  ariaRole: 'listbox',
  "aria-hidden": stringify("isHidden"),
  "aria-labelledby": reads('menu.label.elementId'),
  "aria-disabled": stringify("menu.disabled"),
  "aria-activedescendant": reads("menu.activeDescendant.elementId")

});

export default SelectMenuList;
