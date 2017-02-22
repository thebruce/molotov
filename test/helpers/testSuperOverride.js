/**
 * Test SuperClass
 *
 */
module.exports = class testSuperOverride {
  constructor() {
    this.value = 'test';
  }

  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   * composition in play.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  testFunction(otherValue) {
    return String.concat(this.value, 'override', otherValue);
  }
};
