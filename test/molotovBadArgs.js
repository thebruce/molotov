import test from 'ava';

const Molotov = require('../molotov');

// no args.
test('molotovNoArgs', (t) => {
  t.throws(() => {
    const molotov = new Molotov();  // eslint-disable-line no-unused-vars
  });
});

// Test for bad path rejection.
test('molotovBadPath', (t) => {
  t.throws(() => {
    const molotov = new Molotov([], {}, {}); // eslint-disable-line no-unused-vars
  });
});

// Test for bad supers rejection.
test('molotovSupers', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', 'testPackage', {}, {}); // eslint-disable-line no-unused-vars
  });
});

// Test for bad supers rejection.
test('molotovSupersNotObject', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', 'testPackage', 'not object', {}); // eslint-disable-line no-unused-vars
  });
});

// Test for bad plugin rejection.
test('molotovBadPlugins', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', 'testPackage', {item: 'thing'}, {}); // eslint-disable-line no-unused-vars
  });
});

// Test for bad plugin type rejection.
test('molotovPluginsNotObject', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', 'testPackage', {item: 'thing'}, 'not an object'); // eslint-disable-line no-unused-vars
  });
});
