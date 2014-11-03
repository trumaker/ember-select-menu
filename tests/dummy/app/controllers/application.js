import Ember from "ember";

var get = Ember.get;

export default Ember.ArrayController.extend({
  queryParams: ['prompt', 'disabled', 'blockStyle'],
  prompt: null,
  disabled: null,
  blockStyle: false,
  isDisabled: function () {
    return get(this, 'disabled') === 'true';
  }.property('disabled')
});
