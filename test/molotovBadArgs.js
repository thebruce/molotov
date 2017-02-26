import test from 'ava';

const Molotov = require('../molotov');

// no args.
test('molotovNoArgs', (t) => {
  t.throws(() => {
    const molotov = new Molotov();
  });
});

// Test for bad path rejection.
test('molotovBadPath', (t) => {
  t.throws(() => {
    const molotov = new Molotov([], {}, {});
  });
});

// Test for bad supers rejection.
test('molotovSupers', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', {}, {});
  });
});

// Test for bad supers rejection.
test('molotovSupersNotObject', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', 'not object', {});
  });
});

// Test for bad plugin rejection.
test('molotovBadPlugins', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', {item: 'thing'}, {});
  });
});

// Test for bad plugin type rejection.
test('molotovPluginsNotObject', (t) => {
  t.throws(() => {
    const molotov = new Molotov('./test/helpers/baba', {item: 'thing'}, 'not an object');
  });
});
