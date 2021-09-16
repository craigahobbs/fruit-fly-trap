// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

/* eslint-disable id-length */

import {FruitFlyTrap, coneFormElements} from '../fruit-fly-trap/index.js';
import Window from 'window';
import {fruitFlyTrapDiagram} from '../fruit-fly-trap/fruitFlyTrap.js';
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
    dValue = '3 in', dLess = '#d=2.875', dMore = '#d=3.125',
    hValue = '4.5 in', hLess = '#h=4.375', hMore = '#h=4.625',
    oValue = '1 in', oLess = '#o=0.875', oMore = '#o=1.125',
    bValue = '0.75 in', bLess = '#b=0.625', bMore = '#b=0.875',
    print = '#cmd.print=1', metric = false
} = {}) {
    return {'elements': [
        {'html': 'h1', 'elem': [{'text': 'The Fruit Fly Trap Maker'}]},
        {'html': 'p', 'elem': [
            {'html': 'strong', 'elem': [{'text': 'The Fruit Fly Trap Maker'}]},
            {'text': ' rids your home of annoying fruit flies using only a drinking glass,\n' +
             'your computer printer, and a small amount of apple cider vinegar (or similar).'}
        ]},
        {'html': 'p', 'elem': [
            {'text': 'The trap is made by placing a custom-fitted cone (based on your measurements) into a drinking glass\n' +
             'containing a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar), as pictured\n' +
             'below. The fruit flies fly in through the cone opening and become trapped between the cone and the\n' +
             'liquid.'}
        ]},
        fruitFlyTrapDiagram({'lines': ['220, 200']}),
        {'html': 'h2', 'elem': [{'text': 'Instructions'}]},
        {'html': 'ol', 'attr': null, 'elem': [
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {'text': "Measure the drinking glass's top-inside diameter, height, and cone-bottom offset (see diagram\n" +
                     '   above). The cone-bottom offset is the distance from the bottom of the glass to the bottom of the\n' +
                     '   trap cone, allowing enough room for the liquid and space for the fruit flies to get into the\n' +
                     '   trap. Use the "Less" and "More" links below to enter the measurements.'}
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
                    {'text': 'Click here to '},
                    {
                        'html': 'a',
                        'attr': {'href': metric ? '#' : '#metric=1'},
                        'elem': [{'text': `use ${metric ? 'imperial' : 'metric'} units`}]
                    },
                    {'text': '.\n   At any time, you can '},
                    {'html': 'a', 'attr': {'href': metric ? '#metric=1' : '#'}, 'elem': [{'text': 'reset the cone measurements'}]},
                    {'text': '.'}
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {'text': 'Print the cone form using the link below. Cut out the cone form carefully using scissors. Use\n' +
                     "   your browser's back button to return to this page after printing."}
                ]},
                {'html': 'p', 'elem': [
                    {'html': 'a', 'attr': {'href': print}, 'elem': [{'text': 'Print Cone Form'}]}
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [{'text': 'Tape the cone together along the cone form\'s flap line.'}]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {'text': 'Pour a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar) into the glass. Be\n' +
                     `   sure the liquid level is at least ${metric ? '1/2 cm.' : '1/4 in.'} below the cone-bottom.`}
                ]}
            ]},
            {'html': 'li', 'elem': [
                {'html': 'p', 'elem': [
                    {'text': 'Place the cone form in the glass. It may help to rub some water around the top rim of the glass\n' +
                     '   to form a seal.'}
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


test('FruitFlyTrap.main, metric', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('metric=1');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=7.4&metric=1', 'dMore': '#d=7.6&metric=1', 'dValue': '7.5 cm',
        'hLess': '#h=11.4&metric=1', 'hMore': '#h=11.6&metric=1', 'hValue': '11.5 cm',
        'oLess': '#metric=1&o=2.4', 'oMore': '#metric=1&o=2.6', 'oValue': '2.5 cm',
        'bLess': '#b=1.9&metric=1', 'bMore': '#b=2.1&metric=1', 'bValue': '2 cm',
        'print': '#cmd.print=1&metric=1', 'metric': true
    }));
});


test('FruitFlyTrap.main, complete params', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=5&h=6&o=1.5&b=0.5');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=0.5&d=4.875&h=6&o=1.5', 'dMore': '#b=0.5&d=5.125&h=6&o=1.5', 'dValue': '5 in',
        'hLess': '#b=0.5&d=5&h=5.875&o=1.5', 'hMore': '#b=0.5&d=5&h=6.125&o=1.5', 'hValue': '6 in',
        'oLess': '#b=0.5&d=5&h=6&o=1.375', 'oMore': '#b=0.5&d=5&h=6&o=1.625', 'oValue': '1.5 in',
        'bLess': '#b=0.375&d=5&h=6&o=1.5', 'bMore': '#b=0.625&d=5&h=6&o=1.5', 'bValue': '0.5 in',
        'print': '#b=0.5&cmd.print=1&d=5&h=6&o=1.5'
    }));
});


test('FruitFlyTrap.main, diameter min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=1');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=1', 'dMore': '#d=1.125', 'dValue': '1 in',
        'hLess': '#d=1&h=4.375', 'hMore': '#d=1&h=4.625',
        'oLess': '#d=1&o=0.875', 'oMore': '#d=1&o=1.125',
        'bLess': '#b=0.625&d=1', 'bMore': '#b=0.875&d=1',
        'print': '#cmd.print=1&d=1'
    }));
});


test('FruitFlyTrap.main, diameter max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=36&h=18&b=18');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=18&d=35.875&h=18', 'dMore': '#b=18&d=36&h=18', 'dValue': '36 in',
        'hLess': '#b=18&d=36&h=17.875', 'hMore': '#b=18&d=36&h=18.125', 'hValue': '18 in',
        'oLess': '#b=18&d=36&h=18&o=0.875', 'oMore': '#b=18&d=36&h=18&o=1.125',
        'bLess': '#b=17.875&d=36&h=18', 'bMore': '#b=18.125&d=36&h=18', 'bValue': '18 in',
        'print': '#b=18&cmd.print=1&d=36&h=18'
    }));
});


test('FruitFlyTrap.main, bottom min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('b=0.125');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=0.125&d=2.875', 'dMore': '#b=0.125&d=3.125',
        'hLess': '#b=0.125&h=4.375', 'hMore': '#b=0.125&h=4.625',
        'oLess': '#b=0.125&o=0.875', 'oMore': '#b=0.125&o=1.125',
        'bLess': '#b=0.125', 'bMore': '#b=0.25', 'bValue': '0.125 in',
        'print': '#b=0.125&cmd.print=1'
    }));
});


test('FruitFlyTrap.main, bottom max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('b=32&d=35.875&h=18');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=32&d=35.75&h=18', 'dMore': '#b=32&d=36&h=18', 'dValue': '35.875 in',
        'hLess': '#b=32&d=35.875&h=17.875', 'hMore': '#b=32&d=35.875&h=18.125', 'hValue': '18 in',
        'oLess': '#b=32&d=35.875&h=18&o=0.875', 'oMore': '#b=32&d=35.875&h=18&o=1.125',
        'bLess': '#b=31.875&d=35.875&h=18', 'bMore': '#b=32&d=35.875&h=18', 'bValue': '32 in',
        'print': '#b=32&cmd.print=1&d=35.875&h=18'
    }));
});


test('FruitFlyTrap.main, height min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=2&h=1&o=0.25');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=1.875&h=1&o=0.25', 'dMore': '#d=2&h=1&o=0.25', 'dValue': '2 in',
        'hLess': '#d=2&h=1&o=0.25', 'hMore': '#d=2&h=1.125&o=0.25', 'hValue': '1 in',
        'oLess': '#d=2&h=1&o=0.125', 'oMore': '#d=2&h=1&o=0.25', 'oValue': '0.25 in',
        'bLess': '#d=2&h=1&o=0.25', 'bMore': '#b=0.875&d=2&h=1&o=0.25',
        'print': '#cmd.print=1&d=2&h=1&o=0.25'
    }));
});


test('FruitFlyTrap.main, height max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('h=24');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=2.875&h=24', 'dMore': '#d=3.125&h=24',
        'hLess': '#h=23.875', 'hMore': '#h=24', 'hValue': '24 in',
        'oLess': '#h=24&o=0.875', 'oMore': '#h=24&o=1.125',
        'bLess': '#b=0.625&h=24', 'bMore': '#b=0.875&h=24',
        'print': '#cmd.print=1&h=24'
    }));
});


test('FruitFlyTrap.main, offset min', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('o=0');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=2.875&o=0', 'dMore': '#d=3.125&o=0',
        'hLess': '#h=4.375&o=0', 'hMore': '#h=4.625&o=0',
        'oLess': '#o=0', 'oMore': '#o=0.125', 'oValue': '0 in',
        'bLess': '#b=0.625&o=0', 'bMore': '#b=0.875&o=0',
        'print': '#cmd.print=1&o=0'
    }));
});


test('FruitFlyTrap.main, offset max', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('h=12&o=6');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=2.875&h=12&o=6', 'dMore': '#d=3.125&h=12&o=6',
        'hLess': '#h=11.875&o=6', 'hMore': '#h=12.125&o=6', 'hValue': '12 in',
        'oLess': '#h=12&o=5.875', 'oMore': '#h=12&o=6', 'oValue': '6 in',
        'bLess': '#b=0.625&h=12&o=6', 'bMore': '#b=0.875&h=12&o=6',
        'print': '#cmd.print=1&h=12&o=6'
    }));
});


test('FruitFlyTrap.main, invalid diameter', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('b=5.375&d=6');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#b=5.375&d=6', 'dMore': '#b=5.375&d=6.125', 'dValue': '6 in',
        'hLess': '#b=5.375&d=6&h=4.375', 'hMore': '#b=5.375&d=6&h=4.625',
        'oLess': '#b=5.375&d=6&o=0.875', 'oMore': '#b=5.375&d=6&o=1.125',
        'bLess': '#b=5.25&d=6', 'bMore': '#b=5.375&d=6', 'bValue': '5.375 in',
        'print': '#b=5.375&cmd.print=1&d=6'
    }));
});


test('FruitFlyTrap.main, invalid theta', (t) => {
    const window = new Window();
    const app = new FruitFlyTrap(window);
    app.updateParams('d=6.5');
    t.deepEqual(app.main(), getMainElements({
        'dLess': '#d=6.375', 'dMore': '#d=6.5', 'dValue': '6.5 in',
        'hLess': '#d=6.5', 'hMore': '#d=6.5&h=4.625',
        'oLess': '#d=6.5&o=0.875', 'oMore': '#d=6.5',
        'bLess': '#d=6.5', 'bMore': '#b=0.875&d=6.5',
        'print': '#cmd.print=1&d=6.5'
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
                    'width': '5.18066667in',
                    'height': '8.18363832in',
                    'viewBox': '-0.00700000 -3.00997166 5.18066667 8.18363832'
                },
                'elem': {
                    'svg': 'g',
                    'attr': {
                        'transform': 'scale(1, -1) translate(0, -2.16369501)',
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': '0.00700000'
                    },
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke-dasharray': '0.03500000',
                                'd': 'M 0 1.16666667 A 1.16666667 1.16666667 0 0 0 0.94937061 -0.67809037 ' +
                                    'L 4.20435556 -3.00297166 A 5.16666667 5.16666667 0 0 1 0 5.16666667 Z'
                            }
                        },
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke': 'lightgray',
                                'd': 'M 1.05113035 -0.50619770 L 4.65500582 -2.24173265'
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
                    'width': '6.51400000in',
                    'height': '10.48348734in',
                    'viewBox': '-0.00700000 -3.97648734 6.51400000 10.48348734'
                },
                'elem': {
                    'svg': 'g',
                    'attr': {
                        'transform': 'scale(1, -1) translate(0, -2.53051266)',
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': '0.00700000'
                    },
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke-dasharray': '0.03500000',
                                'd': 'M 0 1.50000000 A 1.50000000 1.50000000 0 0 0 1.18780423 -0.91603554 ' +
                                    'L 5.14715166 -3.96948734 A 6.50000000 6.50000000 0 0 1 0 6.50000000 Z'
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
                    'width': '8.01400000in',
                    'height': '8.81266733in',
                    'viewBox': '-0.00700000 -0.80566733 8.01400000 8.81266733'
                },
                'elem': {
                    'svg': 'g',
                    'attr': {
                        'transform': 'scale(1, -1) translate(0, -7.20133267)',
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': '0.00700000'
                    },
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'stroke-dasharray': '0.03500000',
                                'd': 'M 0 2.00000000 A 2.00000000 2.00000000 0 0 0 1.99000833 -0.19966683 ' +
                                    'L 7.96003332 -0.79866733 A 8.00000000 8.00000000 0 0 1 0 8.00000000 Z'
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


test('fruitFlyTrapDiagram', (t) => {
    t.deepEqual(
        fruitFlyTrapDiagram({'lines': ['220, 200']}),
        {
            'html': 'p',
            'elem': {
                'svg': 'svg',
                'attr': {
                    'width': '220.000',
                    'height': '200.000'
                },
                'elem': [
                    {
                        'svg': 'path',
                        'attr': {
                            'fill': '#cc99ff80',
                            'stroke': 'none',
                            'stroke-width': '5.000',
                            'd': 'M 34.500 155.500 L 34.500 185.500 L 185.500 185.500 L 185.500 155.500\nZ'
                        }
                    },
                    {
                        'svg': 'path',
                        'attr': {
                            'fill': 'none',
                            'stroke': 'black',
                            'stroke-width': '5.000',
                            'd': 'M 34.500 50.000 L 34.500 185.500 L 185.500 185.500 L 185.500 50.000'
                        }
                    },
                    {
                        'svg': 'path',
                        'attr': {
                            'fill': 'white',
                            'stroke': 'black',
                            'stroke-width': '1.000',
                            'd': 'M 12.735 12.000 L 90.000 133.000 L 130.000 133.000 L 207.265 12.000\nZ'
                        }
                    },
                    [
                        {
                            'svg': 'path',
                            'attr': {
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': '1.000',
                                'd': 'M 12.000 50.000 L 22.000 50.000 M 17.000 50.000 L 17.000 105.750 ' +
                                    'M 17.000 185.500 L 17.000 129.750 M 12.000 185.500 L 22.000 185.500'
                            }
                        },
                        {
                            'svg': 'text',
                            'attr': {
                                'x': '17.000',
                                'y': '117.750',
                                'font-size': '14.000px',
                                'text-anchor': 'middle',
                                'dominant-baseline': 'middle'
                            },
                            'elem': {'text': 'h'}
                        }
                    ],
                    [
                        {
                            'svg': 'path',
                            'attr': {
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': '1.000',
                                'd': 'M 198.000 133.000 L 208.000 133.000 M 203.000 133.000 L 203.000 147.250 ' +
                                    'M 203.000 185.500 L 203.000 171.250 M 198.000 185.500 L 208.000 185.500'
                            }
                        },
                        {
                            'svg': 'text',
                            'attr': {
                                'x': '203.000',
                                'y': '159.250',
                                'font-size': '14.000px',
                                'text-anchor': 'middle',
                                'dominant-baseline': 'middle'
                            },
                            'elem': {'text': 'o'}
                        }
                    ],
                    [
                        {
                            'svg': 'path',
                            'attr': {
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': '1.000',
                                'd': 'M 37.000 30.000 L 37.000 40.000 M 37.000 35.000 L 98.000 35.000 ' +
                                    'M 183.000 35.000 L 122.000 35.000 M 183.000 30.000 L 183.000 40.000'
                            }
                        },
                        {
                            'svg': 'text',
                            'attr': {
                                'x': '110.000',
                                'y': '35.000',
                                'font-size': '14.000px',
                                'text-anchor': 'middle',
                                'dominant-baseline': 'middle'
                            },
                            'elem': {'text': 'd'}
                        }
                    ],
                    [
                        {
                            'svg': 'path',
                            'attr': {
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': '1.000',
                                'd': 'M 90.000 113.000 L 90.000 123.000 M 90.000 118.000 L 98.000 118.000 ' +
                                    'M 130.000 118.000 L 122.000 118.000 M 130.000 113.000 L 130.000 123.000'
                            }
                        },
                        {
                            'svg': 'text',
                            'attr': {
                                'x': '110.000',
                                'y': '118.000',
                                'font-size': '14.000px',
                                'text-anchor': 'middle',
                                'dominant-baseline': 'middle'
                            },
                            'elem': {'text': 'b'}
                        }
                    ]
                ]
            }
        }
    );
});


test('coneFormElements', (t) => {
    t.deepEqual(
        coneFormElements(3, 0.75, 4.5, 0.2, 0.007),
        {
            'svg': 'svg',
            'attr': {
                'width': '6.01400000in',
                'height': '6.81163174in',
                'viewBox': '-0.00700000 -0.80463174 6.01400000 6.81163174'
            },
            'elem': {
                'svg': 'g',
                'attr': {
                    'transform': 'scale(1, -1) translate(0, -5.20236826)',
                    'fill': 'none',
                    'stroke': 'black',
                    'stroke-width': '0.00700000'
                },
                'elem': [
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke-dasharray': '0.03500000',
                            'd': 'M 0 1.50000000 A 1.50000000 1.50000000 0 0 0 1.48668641 -0.19940793 ' +
                                'L 5.94674563 -0.79763174 A 6.00000000 6.00000000 0 0 1 0 6.00000000 Z'
                        }
                    },
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke': 'lightgray',
                            'd': 'M 1.50000000 0.00000000 L 6.00000000 0.00000000'
                        }
                    }
                ]
            }
        }
    );
});


test('coneFormElements, extra length', (t) => {
    t.deepEqual(
        coneFormElements(3, 0.75, 4.5, 0.2, 0.007, 'in', 0.5),
        {
            'svg': 'svg',
            'attr': {
                'width': '6.51400000in',
                'height': '7.37810105in',
                'viewBox': '-0.00700000 -0.87110105 6.51400000 7.37810105'
            },
            'elem': {
                'svg': 'g',
                'attr': {
                    'transform': 'scale(1, -1) translate(0, -5.63589895)',
                    'fill': 'none',
                    'stroke': 'black',
                    'stroke-width': '0.00700000'
                },
                'elem': [
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke-dasharray': '0.03500000',
                            'd': 'M 0 1.50000000 A 1.50000000 1.50000000 0 0 0 1.48668641 -0.19940793 ' +
                                'L 6.44230777 -0.86410105 A 6.50000000 6.50000000 0 0 1 0 6.50000000 Z'
                        }
                    },
                    {
                        'svg': 'path',
                        'attr': {
                            'stroke': 'lightgray',
                            'd': 'M 1.50000000 0.00000000 L 6.50000000 0.00000000'
                        }
                    }
                ]
            }
        }
    );
});
