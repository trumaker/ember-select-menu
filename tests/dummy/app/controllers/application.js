import Ember from "ember";

var get = Ember.get;

export default Ember.ArrayController.extend({
  queryParams: ['prompt', 'disabled'],
  prompt: null,
  disabled: null,
  isDisabled: function () {
    return get(this, 'disabled') === 'true';
  }.property('disabled')
});
