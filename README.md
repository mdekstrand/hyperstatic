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
import { h } from 'jsr:@mdekstrand/hyperstatic';

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

## Deno and deno_dom

To use in Deno:

```javascript
import { Document } from 'jsr:@b-fuze/deno-dom';
import { hyperstatic } from 'jsr:@mdekstrand/hyperstatic';
const h = hyperstatic({
    document: new Document()
});

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

The `deno-dom` submodule provides a Hyperstatic instance configured to use
[deno_dom][].

## Use with JSX

A Hyperstatic instandce also exposes a React-compatible `createElement`
function, `Fragment` constant, and modern JSX runtime `jsx` and `jsxs`
functions to enable use with JSX.  You enable this with the following
in `deno.json`:

```json
{
    "imports": {
        "@mdekstrand/hyperstatic": "@mdekstrand/hyperstatic@^0.6"
    },
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@mdekstrand/hyperstatic/deno-dom"
    }
}
```
