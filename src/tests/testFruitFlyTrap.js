// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

/* eslint-disable id-length */

import {FruitFlyTrap, coneFormElements} from '../fruit-fly-trap/index.js';
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


test('FruitFlyTrap.main, diameter min', (t) => {
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


test('FruitFlyTrap.main, diameter max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=36&h=18&b=18');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=18&d=35.9&h=18', 'dMore': '#b=18&d=36&h=18', 'dValue': '36',
        'hLess': '#b=18&d=36&h=17.9', 'hMore': '#b=18&d=36&h=18.1', 'hValue': '18',
        'oLess': '#b=18&d=36&h=18&o=0.9', 'oMore': '#b=18&d=36&h=18&o=1.1',
        'bLess': '#b=17.9&d=36&h=18', 'bMore': '#b=18.1&d=36&h=18', 'bValue': '18',
        'print': '#b=18&cmd.print=1&d=36&h=18'
    }));
});


test('FruitFlyTrap.main, bottom min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('b=0.1');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=0.1&d=2.9', 'dMore': '#b=0.1&d=3.1',
        'hLess': '#b=0.1&h=4.4', 'hMore': '#b=0.1&h=4.6',
        'oLess': '#b=0.1&o=0.9', 'oMore': '#b=0.1&o=1.1',
        'bLess': '#b=0.1', 'bMore': '#b=0.2', 'bValue': '0.1',
        'print': '#b=0.1&cmd.print=1'
    }));
});


test('FruitFlyTrap.main, bottom max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('b=32&d=35.8&h=18');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=32&d=35.7&h=18', 'dMore': '#b=32&d=35.9&h=18', 'dValue': '35.8',
        'hLess': '#b=32&d=35.8&h=17.9', 'hMore': '#b=32&d=35.8&h=18.1', 'hValue': '18',
        'oLess': '#b=32&d=35.8&h=18&o=0.9', 'oMore': '#b=32&d=35.8&h=18&o=1.1',
        'bLess': '#b=31.9&d=35.8&h=18', 'bMore': '#b=32&d=35.8&h=18', 'bValue': '32',
        'print': '#b=32&cmd.print=1&d=35.8&h=18'
    }));
});


test('FruitFlyTrap.main, height min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=2&h=1&o=0.2');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=1.9&h=1&o=0.2', 'dMore': '#d=2.1&h=1&o=0.2', 'dValue': '2',
        'hLess': '#d=2&h=1&o=0.2', 'hMore': '#d=2&h=1.1&o=0.2', 'hValue': '1',
        'oLess': '#d=2&h=1&o=0.1', 'oMore': '#d=2&h=1&o=0.3', 'oValue': '0.2',
        'bLess': '#b=0.6&d=2&h=1&o=0.2', 'bMore': '#b=0.8&d=2&h=1&o=0.2',
        'print': '#cmd.print=1&d=2&h=1&o=0.2'
    }));
});


test('FruitFlyTrap.main, height max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('h=24');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=2.9&h=24', 'dMore': '#d=3.1&h=24',
        'hLess': '#h=23.9', 'hMore': '#h=24', 'hValue': '24',
        'oLess': '#h=24&o=0.9', 'oMore': '#h=24&o=1.1',
        'bLess': '#b=0.6&h=24', 'bMore': '#b=0.8&h=24',
        'print': '#cmd.print=1&h=24'
    }));
});


test('FruitFlyTrap.main, offset min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('o=0');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=2.9&o=0', 'dMore': '#d=3.1&o=0',
        'hLess': '#h=4.4&o=0', 'hMore': '#h=4.6&o=0',
        'oLess': '#o=0', 'oMore': '#o=0.1', 'oValue': '0',
        'bLess': '#b=0.6&o=0', 'bMore': '#b=0.8&o=0',
        'print': '#cmd.print=1&o=0'
    }));
});


test('FruitFlyTrap.main, offset max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('h=12&o=6');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=2.9&h=12&o=6', 'dMore': '#d=3.1&h=12&o=6',
        'hLess': '#h=11.9&o=6', 'hMore': '#h=12.1&o=6', 'hValue': '12',
        'oLess': '#h=12&o=5.9', 'oMore': '#h=12&o=6', 'oValue': '6',
        'bLess': '#b=0.6&h=12&o=6', 'bMore': '#b=0.8&h=12&o=6',
        'print': '#cmd.print=1&h=12&o=6'
    }));
});


test('FruitFlyTrap.main, invalid diameter', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('b=5.4&d=6');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=5.4&d=6', 'dMore': '#b=5.4&d=6.1', 'dValue': '6',
        'hLess': '#b=5.4&d=6&h=4.4', 'hMore': '#b=5.4&d=6&h=4.6',
        'oLess': '#b=5.4&d=6&o=0.9', 'oMore': '#b=5.4&d=6&o=1.1',
        'bLess': '#b=5.3&d=6', 'bMore': '#b=5.4&d=6', 'bValue': '5.4',
        'print': '#b=5.4&cmd.print=1&d=6'
    }));
});


test('FruitFlyTrap.main, invalid theta', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=7.3');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=7.2', 'dMore': '#d=7.3', 'dValue': '7.3',
        'hLess': '#d=7.3', 'hMore': '#d=7.3&h=4.6',
        'oLess': '#d=7.3&o=0.9', 'oMore': '#d=7.3',
        'bLess': '#d=7.3', 'bMore': '#b=0.8&d=7.3',
        'print': '#cmd.print=1&d=7.3'
    }));
});


test('FruitFlyTrap.main, print', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('cmd.print=1');
    t.deepEqual(
        app.main(),
        {
            'elements': {
                'svg': 'svg',
                'attr': {
                    'width': '5.07910628in',
                    'height': '7.98506172in',
                    'viewBox': '-0.00694444 -2.91289988 5.07910628 7.98506172'
                },
                'elem': {
                    'svg': 'g',
                    'attr': {
                        'transform': 'scale(1, -1) translate(0, -2.15926195)',
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': '0.00694444'
                    },
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke-dasharray': '0.034722199999999995',
                                'd': 'M 0 1.06521739 A 1.06521739 1.06521739 0 0 0 0.87247690 -0.61112368 ' +
                                    'L 4.14871669 -2.90595544 A 5.06521739 5.06521739 0 0 1 0 5.06521739 Z'
                            }
                        },
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke': 'lightgray',
                                'd': 'M 0.93802568 -0.50477314 L 4.46040780 -2.40024779'
                            }
                        }
                    ]
                }
            }
        }
    );
});


test('FruitFlyTrap.main, print non-default', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('cmd.print=1&d=4&h=6&o=1.5&b=1');
    t.deepEqual(
        app.main(),
        {
            'elements': {
                'svg': 'svg',
                'attr': {
                    'width': '6.51388889in',
                    'height': '10.22116504in',
                    'viewBox': '-0.00694444 -3.71422060 6.51388889 10.22116504'
                },
                'elem': {
                    'svg': 'g',
                    'attr': {
                        'transform': 'scale(1, -1) translate(0, -2.79272385)',
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': '0.00694444'
                    },
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke-dasharray': '0.034722199999999995',
                                'd': 'M 0 1.50000000 A 1.50000000 1.50000000 0 0 0 1.23210248 -0.85552527 ' +
                                    'L 5.33911074 -3.70727615 A 6.50000000 6.50000000 0 0 1 0 6.50000000 Z'
                            }
                        },
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke': 'lightgray',
                                'd': 'M 1.29903811 -0.75000000 L 5.62916512 -3.25000000'
                            }
                        }
                    ]
                }
            }
        }
    );
});


test('FruitFlyTrap.main, print zero-offset', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('cmd.print=1&d=4&h=6&o=0&b=1');
    t.deepEqual(
        app.main(),
        {
            'elements': {
                'svg': 'svg',
                'attr': {
                    'width': '8.01388889in',
                    'height': '8.51356343in',
                    'viewBox': '-0.00694444 -0.50661899 8.01388889 8.51356343'
                },
                'elem': {
                    'svg': 'g',
                    'attr': {
                        'transform': 'scale(1, -1) translate(0, -7.50032546)',
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': '0.00694444'
                    },
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke-dasharray': '0.034722199999999995',
                                'd': 'M 0 2.00000000 A 2.00000000 2.00000000 0 0 0 1.99609502 -0.12491864 ' +
                                    'L 7.98438009 -0.49967454 A 8.00000000 8.00000000 0 0 1 0 8.00000000 Z'
                            }
                        },
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke': 'lightgray',
                                'd': 'M 2.00000000 0.00000000 L 8.00000000 0.00000000'
                            }
                        }
                    ]
                }
            }
        }
    );
});


test('coneFormElements', (t) => {
    t.deepEqual(
        coneFormElements(3, 0.7, 4.5),
        {
            'svg': 'svg',
            'attr': {
                'width': '5.88345411in',
                'height': '6.62209131in',
                'viewBox': '-0.00694444 -0.74558165 5.88345411 6.62209131'
            },
            'elem': {
                'svg': 'g',
                'attr': {
                    'transform': 'scale(1, -1) translate(0, -5.13092801)',
                    'fill': 'none',
                    'stroke': 'black',
                    'stroke-width': '0.00694444'
                },
                'elem': [
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke-dasharray': '0.034722199999999995',
                            'd': 'M 0 1.36956522 A 1.36956522 1.36956522 0 0 0 1.35867760 -0.17234868 ' +
                                'L 5.82290399 -0.73863721 A 5.86956522 5.86956522 0 0 1 0 5.86956522 Z'
                        }
                    },
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke': 'lightgray',
                            'd': 'M 1.36873092 -0.04779714 L 5.86598964 -0.20484487'
                        }
                    }
                ]
            }
        }
    );
});


test('coneFormElements, extra length', (t) => {
    t.deepEqual(
        coneFormElements(3, 0.7, 4.5, 0.5),
        {
            'svg': 'svg',
            'attr': {
                'width': '6.38345411in',
                'height': '7.18501226in',
                'viewBox': '-0.00694444 -0.80850260 6.38345411 7.18501226'
            },
            'elem': {
                'svg': 'g',
                'attr': {
                    'transform': 'scale(1, -1) translate(0, -5.56800706)',
                    'fill': 'none',
                    'stroke': 'black',
                    'stroke-width': '0.00694444'
                },
                'elem': [
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke-dasharray': '0.034722199999999995',
                            'd': 'M 0 1.36956522 A 1.36956522 1.36956522 0 0 0 1.35867760 -0.17234868 ' +
                                'L 6.31892915 -0.80155815 A 6.36956522 6.36956522 0 0 1 0 6.36956522 Z'
                        }
                    },
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke': 'lightgray',
                            'd': 'M 1.36873092 -0.04779714 L 6.36568505 -0.22229462'
                        }
                    }
                ]
            }
        }
    );
});
