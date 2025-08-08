# Static Configurable Hyperscript

[hyperscript]: https://github.com/hyperhype/hyperscript
[deno_dom]: https://deno.land/x/deno_dom

This is a very simple implementation of [hyperscript][] with a few useful
properties for modern environments:

- exposed as ES module
- clean, modern JavaScript with types and documentation
- test suite
- can be instantiated with different DOM implementations like [deno_dom][] or xmldom

It provides a HyperScript-compatible `h` function, along with React-compatible
`createElement`.  It also generally works fine with XML, not just HTML, for example
with [xmldom](https://www.npmjs.com/package/@xmldom/xmldom).

To use this in the browser, you need to use a transpiler that understands JSR imports,
and write:

```javascript
import { h } from '@mdekstrand/hyperstatic';

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

If you use `esbuild` with [`esbuild-module-loader`][esb-deno], you can specify the following
options to transpile JSX to Hyperstatic-based DOM manipulations for the browser:

```javascript
{
    jsx: "automatic",
    jsxImportSource: "@mdekstrand/hyperstatic/browser",
}
```

[esb-deno]: https://jsr/@luca/esbuild-deno-loader

## Node and JSDOM

To use in Node with JSDom:

```javascript
import { h } from 'jsr:@mdekstrand/hyperstatic/jsdom';

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

## Use with JSX

A Hyperstatic instance also exposes a React-compatible `createElement`
function, `Fragment` constant, and modern JSX runtime `jsx` and `jsxs`
functions to enable use with JSX.  You enable this with the following
in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@mdekstrand/hyperstatic/jsdom"
    }
}
```
