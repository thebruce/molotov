import test from 'ava';

const Molotov = require('../molotov');

// Test for bad path rejection.
test('molotovBadPath', (t) => {
  t.throws(() => {
    Molotov([], {}, {});
  });
});

// Test for bad supers rejection.
test('molotovSupers', (t) => {
  t.throws(() => {
    Molotov('./test/helpers/baba', {}, {});
  });
});

// Test for bad supers rejection.
test('molotovSupersNotObject', (t) => {
  t.throws(() => {
    Molotov('./test/helpers/baba', 'not object', {});
  });
});

// Test for bad plugin rejection.
test('molotovBadPlugins', (t) => {
  t.throws(() => {
    Molotov('./test/helpers/baba', {item: 'thing'}, {});
  });
});

// Test for bad plugin type rejection.
test('molotovPluginsNotObject', (t) => {
  t.throws(() => {
    Molotov('./test/helpers/baba', {item: 'thing'}, 'not an object');
  });
});
