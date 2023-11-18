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

To use in the browser:

```javascript
import { h } from 'https://deno.land/x/hyperstatic/mod.ts';

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

## Deno and deno_dom

To use in Deno:

```javascript
import { Document } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { hyperstatic } from 'https://deno.land/x/hyperstatic/mod.ts';
const h = hyperstatic({
    document: new Document()
});

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

The `deno-dom` submodule provides a Hyperstatic instance configured to use
[deno_dom][]. It expects a `deno-dom` import map entry in `deno.json`:

```json
{
    "imports": {
        "deno-dom": "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts",
    }
}
```

## Use with JSX

A Hyperstatic instandce also exposes a React-compatible `createElement`
function, `Fragment` constant, and modern JSX runtime `jsx` and `jsxs`
functions to enable use with JSX.

Doing this typically requires further import maps, since deno.land 
doesn't support non-extension imports.

```json
{
    "imports": {
        "deno-dom": "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts",
        "hyperdeno/jsx-runtime": "https://deno.land/x/hyperscript/deno-dom/jsx-runtime.ts"
    },
    "compilerOptions": {
        "jsxImportSource": "hyperdeno"
    }
}
```
