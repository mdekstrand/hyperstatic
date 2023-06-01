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
`createElement`.  It also generally works fine with XML, not just HTML.

To use in the browser:

```javascript
import { h } from 'https://deno.land/x/hyperstatic/hyperstatic.js';

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```

To use in Deno:

```javascript
import { Document } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { hyperstatic } from 'https://deno.land/x/hyperstatic/hyperstatic.js';
const h = hyperstatic({
    document: new Document()
});

let elt = h('a.link', {href: 'https://example.com'}, 'Example');
```
