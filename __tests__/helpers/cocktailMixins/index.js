const mixinThree = require('./testSuper/mixinThree');
const mixinFour = require('./testSuper/mixinFour');
const mixinSeven = require('./testSuperTwo/mixinSeven');

module.exports = {
  testSuper: {
    mixinThree,
    mixinFour,
  },
  testSuperTwo: {
    mixinSeven,
  },
};
