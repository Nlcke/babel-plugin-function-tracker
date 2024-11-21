import { describe, it } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from '@babel/core';
import { format as prettierFormat } from '@prettier/sync';
import plugin from '../src';

/** @type {(source: string) => string} */
const format = (source) => prettierFormat(source, { parser: 'babel' });

describe('fixtures', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).forEach((testName) => {
    it(testName, () => {
      const fixtureDir = path.join(fixturesDir, testName);

      // eslint-disable-next-line import/no-dynamic-require, global-require
      const pluginOptions = require(path.join(fixtureDir, 'options.js')).options;

      process.env.BABEL_ENV = 'production';

      const actual = transformFileSync(path.join(fixtureDir, 'actual.js'), {
        babelrc: false,
        plugins: [[plugin, pluginOptions]],
      });

      const expected = transformFileSync(path.join(fixtureDir, 'expected.js'), {
        babelrc: false,
        plugins: [],
      });

      assert.strictEqual(
        format((actual && actual.code) || ''),
        format((expected && expected.code) || ''),
      );
    });
  });
});
