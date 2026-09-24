import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('App initializes without error', () => {
  assert.ok(app);
});
