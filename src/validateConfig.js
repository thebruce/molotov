// @flow

import type { molotovConfig } from './types/molotov';

const Ajv = require('ajv');
const schema = require('../schema/molotovConfig');

const {
  MOLOTOV_MALFORMED_MOLOTOV_CONFIG,
} = require('../_errors');

const {
  MolotovError,
} = require('./molotovError');


const ajv = new Ajv();
const validate = ajv.compile(schema);

module.exports = function validateConfig(config: molotovConfig) {
  const valid = validate(config);
  if (!valid) throw new MolotovError(MOLOTOV_MALFORMED_MOLOTOV_CONFIG);
};

