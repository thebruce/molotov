const pluginOne = require('./testSuper/pluginOne');
const pluginTwo = require('./testSuper/pluginTwo');
const pluginThree = require('./testSuper/pluginThree');

module.exports = {
  testSuper: {
    pluginOne,
    pluginTwo,
    pluginThree,
  },
};
