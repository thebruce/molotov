// @flow
/* eslint-disable */
// Molotov Errors
module.exports = {
  COCKTAIL_SUPERS_NOT_DEFINED_IN_COCKTAIL_CONFIG: 'A Cocktail class had supers passed in its supers object but not defined in its cocktail config.',
  VALID_COCKTAIL_CONFIG_REQUIRED: 'Cocktail classes must atleast have a fully formed config object.',
  MOLOTOV_CONFIG_REQUIRED: 'molotovConfig is required and must be an molotov config object.',
  MOLOTOV_SUPERS_REQUIRED: 'supers is required and must be an object',
  MOLOTOV_PLUGINS_REQUIRED: 'plugins is required and must be an object',
  MOLOTOV_MALFORMED_OVERRIDES: 'Configuration overrides must be an object.',
  MOLOTOV_MALFORMED_COCKTAIL_ARRAY: 'Cocktail classes must be passed as an array.',
  MOLOTOV_PLUGIN_MAKER_NO_SUPER_WITH_THIS_NAME: 'Molotov was attempting to create mixins with a super that does not exist.',
  MOLOTOV_PLUGIN_MAKER_PLUGIN_CANT_FIND_MIXIN: 'Molotov was attempting to create a plugin but the mixins indicated for the plugin could not be found in the mixin object that was passed.',
  MOLOTOV_MALFORMED_MOLOTOV_CONFIG: 'Molotov configuration failed validation against the molotov schema. Please ensure your config conforms to the molotovConfig schema.'
};
/* eslint-enable */
