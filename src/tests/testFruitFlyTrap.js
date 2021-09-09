// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

/* eslint-disable id-length */

import {FruitFlyTrap} from '../fruit-fly-trap/index.js';
import Window from 'window';
import test from 'ava';


test('FruitFlyTrap, constructor', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    t.is(app.window, window);
    t.is(app.params, null);
});


test('FruitFlyTrap.run, help command', (t) => {
    const window = new Window();
    window.location.hash = '#cmd.help=1';
    const app = FruitFlyTrap.run(window);
    t.is(app.window, window);
    t.deepEqual(app.params, {'cmd': {'help': 1}});
    t.is(window.document.title, '');
    t.true(window.document.body.innerHTML.startsWith(
        '<h1 id="cmd.help=1&amp;type_FruitFlyTrap"><a class="linktarget">FruitFlyTrap</a></h1>'
    ));
});


test('FruitFlyTrap.run, main', (t) => {
    const window = new Window();
    window.location.hash = '#';
    const app = FruitFlyTrap.run(window);
    t.is(app.window, window);
    t.deepEqual(app.params, {});
    t.is(window.document.title, '');
    t.true(window.document.body.innerHTML.startsWith('<h1>The Fruit Fly Trap Maker</h1>'));
});


test('FruitFlyTrap.run, hash parameter error', (t) => {
    const window = new Window();
    window.location.hash = '#foo=bar';
    const app = FruitFlyTrap.run(window);
    t.is(app.window, window);
    t.is(app.params, null);
    t.is(window.document.title, '');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('FruitFlyTrap.main', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('');
    const result = app.main();
    t.deepEqual(
        result.elements[0],
        {'html': 'h1', 'elem': [{'text': 'The Fruit Fly Trap Maker'}]}
    );
});
