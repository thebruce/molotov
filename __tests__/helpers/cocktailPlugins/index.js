const pluginThree = require('./testSuper/pluginThree');
const pluginFour = require('./testSuper/pluginFour');
const pluginSeven = require('./testSuperTwo/pluginSeven');

module.exports = {
  testSuper: {
    pluginThree,
    pluginFour,
  },
  testSuperTwo: {
    pluginSeven,
  },
};
