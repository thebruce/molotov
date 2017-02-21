'use strict';

/**
 * Test SuperClass
 *
 */
module.exports = class testSuper {
  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   * composition in play.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  testFunction(value) {
    return value;
  }
};
