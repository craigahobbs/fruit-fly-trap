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
    t.true(window.document.body.innerHTML.startsWith('<h1>Ye Olde Fruit Fly Trap</h1>'));
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
    t.deepEqual(
        app.main(),
        {
            'elements': [
                {'html': 'h1', 'elem': {'text': 'Ye Olde Fruit Fly Trap'}},
                {
                    'html': 'p',
                    'elem': [
                        {'html': 'a', 'attr': {'href': '#cmd.print=1'}, 'elem': {'text': 'Print'}},
                        {'text': ' | '},
                        {'html': 'a', 'attr': {'href': '#'}, 'elem': {'text': 'Reset'}}
                    ]
                },
                {
                    'html': 'p',
                    'elem': [
                        {'text': 'Glass inside-diameter ('},
                        {'html': 'a', 'attr': {'href': '#d=2.9'}, 'elem': {'text': 'Less'}},
                        {'text': ' '},
                        {'html': 'a', 'attr': {'href': '#d=3.1'}, 'elem': {'text': 'More'}},
                        {'text': '): 3.00 in'}
                    ]
                },
                {
                    'html': 'p',
                    'elem': [
                        {'text': 'Glass height ('},
                        {'html': 'a', 'attr': {'href': '#h=4.4'}, 'elem': {'text': 'Less'}},
                        {'text': ' '},
                        {'html': 'a', 'attr': {'href': '#h=4.6'}, 'elem': {'text': 'More'}},
                        {'text': '): 4.50 in'}
                    ]
                },
                {
                    'html': 'p',
                    'elem': [
                        {'text': 'Glass bottom-offset ('},
                        {'html': 'a', 'attr': {'href': '#o=0.90'}, 'elem': {'text': 'Less'}},
                        {'text': ' '},
                        {'html': 'a', 'attr': {'href': '#o=1.1'}, 'elem': {'text': 'More'}},
                        {'text': '): 1.00 in'}
                    ]
                },
                {
                    'html': 'p',
                    'elem': [
                        {'text': 'Cone bottom diameter ('},
                        {'html': 'a', 'attr': {'href': '#b=0.40'}, 'elem': {'text': 'Less'}},
                        {'text': ' '},
                        {'html': 'a', 'attr': {'href': '#b=0.60'}, 'elem': {'text': 'More'}},
                        {'text': '): 0.50 in'}
                    ]
                },
                {'html': 'p', 'elem': {'text': '\xa0'}},
                {
                    'svg': 'svg',
                    'attr': {'width': '4.714in', 'height': '8.322in', 'viewBox': '-0.007 -0.007 4.714 8.322'},
                    'elem': [
                        {
                            'svg': 'path',
                            'attr': {
                                'fill': 'none',
                                'stroke': 'black',
                                'stroke-width': '0.007',
                                'd': 'M 0.000 4.000 L 0.016 4.000 L 0.031 4.001 L 0.047 4.002 L 0.063 4.003 L 0.078 4.004 L 0.094 4.006 ' +
                                    'L 0.110 4.009 L 0.125 4.011 L 0.140 4.014 L 0.156 4.018 L 0.171 4.021 L 0.186 4.025 L 0.201 4.030 ' +
                                    'L 0.216 4.034 L 0.231 4.039 L 0.246 4.045 L 0.261 4.050 L 0.275 4.056 L 0.289 4.063 L 0.304 4.069 ' +
                                    'L 0.318 4.076 L 0.332 4.084 L 0.345 4.091 L 0.359 4.099 L 0.372 4.107 L 0.386 4.116 L 0.399 4.125 ' +
                                    'L 0.411 4.134 L 0.424 4.143 L 0.436 4.153 L 0.449 4.163 L 0.461 4.173 L 0.472 4.183 L 0.484 4.194 ' +
                                    'L 0.495 4.205 L 0.506 4.216 L 0.517 4.228 L 0.527 4.239 L 0.537 4.251 L 0.547 4.264 L 0.557 4.276 ' +
                                    'L 0.566 4.289 L 0.575 4.301 L 0.584 4.314 L 0.593 4.328 L 0.601 4.341 L 0.609 4.355 L 0.616 4.368 ' +
                                    'L 0.624 4.382 L 0.631 4.396 L 0.637 4.411 L 0.644 4.425 L 0.650 4.439 L 0.655 4.454 L 0.661 4.469 ' +
                                    'L 0.666 4.484 L 0.670 4.499 L 0.675 4.514 L 0.679 4.529 L 0.682 4.544 L 0.686 4.560 L 0.689 4.575 ' +
                                    'L 0.691 4.590 L 0.694 4.606 L 0.696 4.622 L 0.697 4.637 L 0.698 4.653 L 0.699 4.669 L 0.700 4.684 ' +
                                    'L 0.700 4.700 L 0.700 4.716 L 0.699 4.731 L 0.698 4.747 L 0.697 4.763 L 0.696 4.778 L 0.694 4.794 ' +
                                    'L 0.691 4.810 L 0.689 4.825 L 0.686 4.840 L 0.682 4.856 L 0.679 4.871 L 0.675 4.886 L 0.670 4.901 ' +
                                    'L 0.666 4.916 L 0.661 4.931 L 0.655 4.946 L 0.650 4.961 L 0.644 4.975 L 0.637 4.989 L 0.631 5.004 ' +
                                    'L 0.624 5.018 L 0.616 5.032 L 0.609 5.045 L 0.601 5.059 L 0.593 5.072 L 0.584 5.086 L 0.575 5.099 ' +
                                    'L 0.566 5.111 L 0.557 5.124 L 0.547 5.136 L 0.537 5.149 L 0.527 5.161 L 0.517 5.172 L 0.506 5.184 ' +
                                    'L 0.495 5.195 L 0.484 5.206 L 0.472 5.217 L 0.461 5.227 L 0.449 5.237 L 3.012 8.308 L 3.092 8.239 ' +
                                    'L 3.171 8.169 L 3.248 8.097 L 3.323 8.023 L 3.397 7.948 L 3.469 7.871 L 3.539 7.792 L 3.608 7.712 ' +
                                    'L 3.675 7.630 L 3.739 7.547 L 3.802 7.463 L 3.863 7.377 L 3.922 7.289 L 3.980 7.201 L 4.035 7.111 ' +
                                    'L 4.088 7.019 L 4.139 6.927 L 4.188 6.834 L 4.235 6.739 L 4.279 6.644 L 4.322 6.547 L 4.362 6.450 ' +
                                    'L 4.400 6.351 L 4.436 6.252 L 4.470 6.152 L 4.501 6.052 L 4.531 5.950 L 4.558 5.848 L 4.582 5.746 ' +
                                    'L 4.604 5.643 L 4.624 5.539 L 4.642 5.435 L 4.657 5.331 L 4.670 5.226 L 4.681 5.121 L 4.689 5.016 ' +
                                    'L 4.695 4.911 L 4.699 4.805 L 4.700 4.700 L 4.699 4.595 L 4.695 4.489 L 4.689 4.384 L 4.681 4.279 ' +
                                    'L 4.670 4.174 L 4.657 4.069 L 4.642 3.965 L 4.624 3.861 L 4.604 3.757 L 4.582 3.654 L 4.558 3.552 ' +
                                    'L 4.531 3.450 L 4.501 3.348 L 4.470 3.248 L 4.436 3.148 L 4.400 3.049 L 4.362 2.950 L 4.322 2.853 ' +
                                    'L 4.279 2.756 L 4.235 2.661 L 4.188 2.566 L 4.139 2.473 L 4.088 2.381 L 4.035 2.289 L 3.980 2.199 ' +
                                    'L 3.922 2.111 L 3.863 2.023 L 3.802 1.937 L 3.739 1.853 L 3.675 1.770 L 3.608 1.688 L 3.539 1.608 ' +
                                    'L 3.469 1.529 L 3.397 1.452 L 3.323 1.377 L 3.248 1.303 L 3.171 1.231 L 3.092 1.161 L 3.012 1.092 ' +
                                    'L 2.930 1.025 L 2.847 0.961 L 2.763 0.898 L 2.677 0.837 L 2.589 0.778 L 2.501 0.720 L 2.411 0.665 ' +
                                    'L 2.319 0.612 L 2.227 0.561 L 2.134 0.512 L 2.039 0.465 L 1.944 0.421 L 1.847 0.378 L 1.750 0.338 ' +
                                    'L 1.651 0.300 L 1.552 0.264 L 1.452 0.230 L 1.352 0.199 L 1.250 0.169 L 1.148 0.142 L 1.046 0.118 ' +
                                    'L 0.943 0.096 L 0.839 0.076 L 0.735 0.058 L 0.631 0.043 L 0.526 0.030 L 0.421 0.019 L 0.316 0.011 ' +
                                    'L 0.211 0.005 L 0.105 0.001 L 0.000 0.000 Z'
                            }
                        },
                        {
                            'svg': 'path',
                            'attr': {
                                'fill': 'none',
                                'stroke': 'black',
                                'stroke-width': '0.007',
                                'd': 'M 0.547 5.136 L 3.675 7.630 Z'
                            }
                        }
                    ]
                }
            ]
        }
    );
});
