import Ember from "ember";

export default Ember.ArrayController.extend({
  queryParams: ['prompt', 'disabled'],
  prompt: null,
  disabled: false
});
