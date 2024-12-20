# babel-plugin-function-tracker

Provides tracking without external wrapper overhead by calling user function at the end of block
statement.

## Installation

Install it as any other babel plugin to dev dependencies:

```
npm i -D babel-plugin-function-tracker
```

Then add it to your plugins in `babel.config.js` and configure it's options. The plugin works only
when special function imported from special module and used as a statement in any function
definition. So with options like `{ functionName: 'functionName', moduleName: 'moduleName' }` it
will search for any import statement with `functionName` identifier and `moduleName` source:

```js
module.exports = {
  // other babel config
  plugins: [
    ['babel-plugin-function-tracker', { functionName: 'functionName', moduleName: 'moduleName' }],
    // other babel plugins
  ],
};
```

## Options

The plugin accepts two required options (`functionName` and `moduleName`) to search for them in the
following import statements:

```ts
import { functionName } from 'moduleName';
import * as functionName from 'moduleName';
import functionName from 'moduleName';
import { default as functionName } from 'moduleName';
import { something as functionName } from 'moduleName';
```

Please, note: any other form of import is not available for special function which should be used
only directly.

## How it works

Let's assume we provided plugin options as
`{ functionName: 'functionName', moduleName: 'moduleName' }`.

The plugin checks for special function import first using provided plugin options:

```ts
import React from 'react';
import { name1, functionName, name2, name3 } from 'moduleName'; // found
```

Then it searches for any special function call as a statement inside a block statement:

```ts
function random() {
  functionName(); // found!
  if (Math.random() < 0.5) {
    return 0;
  } else {
    return 1;
  }
}

function log(text) {
  const result = functionName(); // skipped: the call is not a statement
  console.log(text);
}
```

And only then the code generation happens:

```ts
function random() {
  // get the result of special function
  const _end = functionName();
  // wrap every statement below special function in try/catch
  try {
    if (Math.random() < 0.5) {
      // wrap each return statement in the result
      return _end(0);
    } else {
      // wrap each return statement in the result
      return _end(1);
    }
  } catch (_e) {
    // wrap error in the result too
    throw _end(_e);
  }
}
```

Please take a look at `test/fixtures` directory for more examples.

## Special function

The special function may accept any arguments, but it should always return "end"-function of the
following type:

```ts
<T>(arg: T) => T;
```

That means any input of "end"-function should be returned unmodified for correct work.

The simplest example of special function is

```ts
export const f = () => (arg) => arg;
```

It is useless without side effects so we may improve it a little to track call time in ms:

```ts
export const track = (name: string) => {
  const now = Date.now();
  console.log('call start', name);
  const end = (arg) => {
    console.log('call end', name, Date.now() - now);
    return arg;
  };
  return end;
};
```
