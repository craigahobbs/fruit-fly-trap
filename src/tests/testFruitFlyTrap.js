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


// Helper function to generate main element model expected values
function getMainElements({
    dValue = '3', dLess = '#d=2.9', dMore = '#d=3.1',
    hValue = '4.5', hLess = '#h=4.4', hMore = '#h=4.6',
    oValue = '1', oLess = '#o=0.9', oMore = '#o=1.1',
    bValue = '0.7', bLess = '#b=0.6', bMore = '#b=0.8',
    print = '#cmd.print=1'
} = {}) {
    return {'elements': [
        {'html': 'h1', 'elem': [{'text': 'The Fruit Fly Trap Maker'}]},
        {'html': 'p', 'elem': [
            {'html': 'strong', 'elem': [{'text': 'The Fruit Fly Trap Maker'}]},
            {
                'text': ' rids your home of annoying fruit flies using only a drinking glass,\n' +
                    'your computer printer, and a small amount of apple cider vinegar (or similar).'
            }
        ]},
        {'html': 'p', 'elem': [
            {
                'text': 'The trap is made by placing a custom-fitted cone (based on your measurements) into a drinking glass\n' +
                    'containing a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar), as pictured\n' +
                    'below. The fruit flies, attracted to the liquid, fly into the trap through the cone where they\n' +
                    'become trapped!'
            }
        ]},
        {'html': 'p', 'elem': [
            {'html': 'img', 'attr': {'src': 'fruit-fly-trap.svg', 'alt': 'Fruit Fly Trap Diagram'}}
        ]},
        {'html': 'h2', 'elem': [{'text': 'Instructions'}]},
        {'html': 'ol', 'attr': null, 'elem': [
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {
                        'text': 'Measure the drinking glass\'s top-inside diameter, height, and cone-bottom offset. Use the "Less"\n' +
                            '   and "More" links below to enter the measurements.'
                    }
                ]},
                {'html': 'p', 'elem': [
                    {'html': 'strong', 'elem': [{'text': 'Glass inside-diameter (d)'}]},
                    {'text': ' ('},
                    {'html': 'a', 'attr': {'href': dLess}, 'elem': [{'text': 'Less'}]},
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': dMore}, 'elem': [{'text': 'More'}]},
                    {'text': `): ${dValue}`}
                ]},
                {'html': 'p', 'elem': [
                    {'html': 'strong', 'elem': [{'text': 'Glass height (h)'}]},
                    {'text': ' ('},
                    {'html': 'a', 'attr': {'href': hLess}, 'elem': [{'text': 'Less'}]},
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': hMore}, 'elem': [{'text': 'More'}]},
                    {'text': `): ${hValue}`}
                ]},
                {'html': 'p', 'elem': [
                    {'html': 'strong', 'elem': [{'text': 'Cone bottom-offset (o)'}]},
                    {'text': ' ('},
                    {'html': 'a', 'attr': {'href': oLess}, 'elem': [{'text': 'Less'}]},
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': oMore}, 'elem': [{'text': 'More'}]},
                    {'text': `): ${oValue}`}
                ]},
                {'html': 'p', 'elem': [
                    {'html': 'strong', 'elem': [{'text': 'Cone bottom diameter (b)'}]},
                    {'text': ' ('},
                    {'html': 'a', 'attr': {'href': bLess}, 'elem': [{'text': 'Less'}]},
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': bMore}, 'elem': [{'text': 'More'}]},
                    {'text': `): ${bValue}`}
                ]},
                {'html': 'p', 'elem': [
                    {'text': 'At any time, you can '},
                    {'html': 'a', 'attr': {'href': '#'}, 'elem': [{'text': 'reset the cone measurements'}]},
                    {'text': '.'}
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {'html': 'a', 'attr': {'href': print}, 'elem': [{'text': 'Print the cone form'}]},
                    {'text': '. Using\n   scissors, cut along the dotted line to cut out the cone form.'}
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [{'text': 'Tape the cone together along the cone form\'s flap line.'}]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {
                        'text': 'Pour a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar) into the glass.\n' +
                            '   Be sure the liquid level is at least 1/4" below the cone-bottom offset you measured above.'
                    }
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {
                        'text': 'Place the cone form in the glass. It may help to rub some water around the top rim of the glass\n' +
                            '   to form a seal.'
                    }
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {'text': 'Set the trap near where you have fruit flies.'}
                ]}
            ]}
        ]}
    ]};
}


test('FruitFlyTrap.main', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('');
    t.deepEqual(app.main(), getMainElements());
});


test('FruitFlyTrap.main, complete params', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=5&h=6&o=1.5&b=0.5');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=0.5&d=4.9&h=6&o=1.5', 'dMore': '#b=0.5&d=5.1&h=6&o=1.5', 'dValue': '5',
        'hLess': '#b=0.5&d=5&h=5.9&o=1.5', 'hMore': '#b=0.5&d=5&h=6.1&o=1.5', 'hValue': '6',
        'oLess': '#b=0.5&d=5&h=6&o=1.4', 'oMore': '#b=0.5&d=5&h=6&o=1.6', 'oValue': '1.5',
        'bLess': '#b=0.4&d=5&h=6&o=1.5', 'bMore': '#b=0.6&d=5&h=6&o=1.5', 'bValue': '0.5',
        'print': '#b=0.5&cmd.print=1&d=5&h=6&o=1.5'
    }));
});


test('FruitFlyTrap.main, min diameter', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=1');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=1', 'dMore': '#d=1.1', 'dValue': '1',
        'hLess': '#d=1&h=4.4', 'hMore': '#d=1&h=4.6',
        'oLess': '#d=1&o=0.9', 'oMore': '#d=1&o=1.1',
        'bLess': '#b=0.6&d=1', 'bMore': '#b=0.8&d=1',
        'print': '#cmd.print=1&d=1'
    }));
});
