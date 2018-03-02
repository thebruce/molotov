const mixinOne = require('./testSuper/mixinOne');
const mixinTwo = require('./testSuper/mixinTwo');
const mixinThree = require('./testSuper/mixinThree');

module.exports = {
  testSuper: {
    mixinOne,
    mixinTwo,
    mixinThree,
  },
};
