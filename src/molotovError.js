// @flow

/**
 *   A custom error class which has a `code` property that
 *   should align with molotov errors defined in ../_errors.js
 */
class MolotovError extends Error {
  code: string
  /**
   * Creates an instance of MolotovError.
   * @param {string} code
   *   A code string.
   * @param {any} args
   *   Additional args.
   * @memberof MolotovError
   */
  constructor(code: string, ...args: any) {
    const [message, ...rest] = args;
    super(message || code, ...rest);

    Error.captureStackTrace(this, MolotovError);

    this.code = code;
  }
}

module.exports = {
  MolotovError,
};
