/**
 * This is a testSuper mixin which follows the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   * composition in play.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  testFunction(otherValue) {
    this.nonsense = 'help';
    return String.concat(otherValue, 'pluginThree');
  }
};
