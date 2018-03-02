/**
 * Test SuperClass
 *
 */
module.exports = class testSuper {
  constructor() {
    this.value = 'test';
  }

  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   * composition in play.
   *
   * @param {string} otherValue
   *  A value to perform a transformation upon.
   *
   * @returns {string}
   *   A test return value.
   */
  testFunction(otherValue) {
    return String.concat(this.value, 'cocktailSuperOne', otherValue);
  }
};
