// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

import * as smd from '../schema-markdown/index.js';
import {markdownElements, parseMarkdown} from '../markdown-model/index.js';
import {UserTypeElements} from '../schema-markdown-doc/index.js';
import {encodeQueryString} from '../schema-markdown/index.js';
import {renderElements} from '../element-model/index.js';


// Defaults
const defaultTop = 3;
const defaultBottom = 0.7;
const defaultHeight = 4.5;
const defaultOffset = 1;


// The application's hash parameter type model
const appHashTypes = (new smd.SchemaMarkdownParser(`\
# The FruitFlyTrap application hash parameters struct
struct FruitFlyTrap

    # Optional command
    optional Command cmd

    # The diameter of the glass, in inches (default is ${defaultTop} in)
    optional float(>= 1, <= 36) d

    # The diameter of the cone's bottom hole, in inches (default is ${defaultBottom} in)
    optional float(>= 0.1, <= 36) b

    # The height of the glass, in inches (default is ${defaultHeight} in)
    optional float(>= 1, <= 36) h

    # The offset from the bottom of the glass, in inches (default is ${defaultOffset} in)
    optional float(>= 0, <= 6) o

# Application command union
union Command

    # Render the application's hash parameter documentation
    int(==1) help

    # Print the cone form pattern
    int(==1) print
`).types);


/**
 * The FruitFlyTrap application
 *
 * @property {Object} window - The web browser window object
 * @property {Object} params - The validated hash parameters object
 */
export class FruitFlyTrap {
    /**
     * Create an application instance
     *
     * @property {Object} window - The web browser window object
     */
    constructor(window) {
        this.window = window;
        this.params = null;
    }

    /**
     * Run the application
     *
     * @property {Object} window - The web browser window object
     * @returns {FruitFlyTrap}
     */
    static run(window) {
        const app = new FruitFlyTrap(window);
        app.render();
        window.addEventListener('hashchange', () => app.render(), false);
        return app;
    }

    // Helper function to parse and validate the hash parameters
    updateParams(paramStr = null) {
        // Clear, then validate the hash parameters (may throw)
        this.params = null;

        // Decode the params string
        const paramStrActual = paramStr !== null ? paramStr : this.window.location.hash.substring(1);
        const params = smd.decodeQueryString(paramStrActual);

        // Validate the params
        this.params = smd.validateType(appHashTypes, 'FruitFlyTrap', params);
    }

    // Render the application
    render() {
        let result;
        try {
            // Validate hash parameters
            const paramsPrev = this.params;
            this.updateParams();

            // Skip the render if the page params haven't changed
            if (paramsPrev !== null && JSON.stringify(paramsPrev) === JSON.stringify(this.params)) {
                return;
            }

            // Render the application elements
            result = this.main();
        } catch ({message}) {
            result = {'elements': {'html': 'p', 'elem': {'text': `Error: ${message}`}}};
        }

        // Render the application
        renderElements(this.window.document.body, result.elements);
    }

    // Generate the application's element model
    main() {
        // Help?
        if ('cmd' in this.params && 'help' in this.params.cmd) {
            return {'elements': (new UserTypeElements(this.params)).getElements(appHashTypes, 'FruitFlyTrap')};
        }

        // Print?
        if ('cmd' in this.params && 'print' in this.params.cmd) {
            return {'elements': coneConfigFormElements(getConeConfig(this.params))};
        }

        // Input up/down helper component
        const updown = (label, param, delta) => {
            const {attr} = appHashTypes.FruitFlyTrap.struct.members.find((member) => member.name === param);

            // Compute the less link params
            const lessParams = {...this.params};
            const lessConfig = getConeConfig(this.params);
            const paramValue = lessConfig[param];
            lessConfig[param] = Math.max(lessConfig[param] - delta, attr.gte).toPrecision(2);
            if (coneConfigFormElements(lessConfig) !== null) {
                lessParams[param] = lessConfig[param];
            }

            // Compute the more link params
            const moreParams = {...this.params};
            const moreConfig = getConeConfig(this.params);
            moreConfig[param] = Math.min(moreConfig[param] + delta, attr.lte).toPrecision(2);
            if (coneConfigFormElements(moreConfig) !== null) {
                moreParams[param] = moreConfig[param];
            }

            return {
                'html': 'p',
                'elem': [
                    {'text': `${label} (`},
                    {'html': 'a', 'attr': {'href': `#${encodeQueryString(lessParams)}`}, 'elem': {'text': 'Less'}},
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': `#${encodeQueryString(moreParams)}`}, 'elem': {'text': 'More'}},
                    {'text': `): ${paramValue.toFixed(2)} in`}
                ]
            };
        };

        // Fruit fly trap form editor
        return {
            'elements': [
                markdownElements(parseMarkdown(
                    `\
# Ye Olde Fruit Fly Trap Maker
`
                )),
                {'html': 'div', 'attr': {'style': 'display: flex; flex-flow: row wrap; align-items: top;'}, 'elem': [
                    {'html': 'div', 'elem': [
                        markdownElements(parseMarkdown(
                            `\
## Instructions

Coming soon!

## Measurements
`
                        )),
                        {'html': 'div', 'attr': {'style': 'text-align: right;'}, 'elem': [
                            updown('Glass inside-diameter', 'd', 0.1),
                            updown('Glass height', 'h', 0.1),
                            updown('Glass bottom-offset', 'o', 0.1),
                            updown('Cone bottom diameter', 'b', 0.1),
                            {'html': 'p', 'elem': {
                                'html': 'a',
                                'attr': {'href': `#${encodeQueryString({...this.params, 'cmd': {'print': 1}})}`},
                                'elem': {'text': 'Print Cone Form'}
                            }},
                            {'html': 'p', 'elem': {'html': 'a', 'attr': {'href': '#'}, 'elem': {'text': 'Reset'}}}
                        ]}
                    ]},
                    {'html': 'div', 'attr': {'style': 'margin-left: 5em;'}, 'elem': [
                        {'html': 'p', 'elem': {'html': 'img', 'attr': {'src': 'fruit-fly-trap.svg', 'alt': 'Ye Olde Fruit Fly Trap'}}}
                    ]}
                ]}
            ]
        };
    }
}


// Helper function to get the cone params with defaults
function getConeConfig(params) {
    return {
        'd': defaultTop,
        'b': defaultBottom,
        'h': defaultHeight,
        'o': defaultOffset,
        ...params
    };
}


// Helper function to get a fruit fly trap cone form elements
function coneConfigFormElements(config) {
    return coneFormElements(config.d, config.b, config.h - config.o, config.o > 0 ? 0.5 : 0);
}


// Cone form SVG component
function coneFormElements(diameterTop, diameterBottom, height, extraLength) {
    // Compute the cone form's radii and theta
    const formRadius = height * diameterBottom / (diameterTop - diameterBottom);
    const formRadiusOuter = formRadius + height + extraLength;
    const formTheta = Math.PI * diameterBottom / formRadius;

    // Compute the flap angle
    const flapLength = 0.125;
    const flapTheta = formTheta + flapLength / formRadius;

    // Valid cone specification?
    if (diameterBottom > 0.9 * diameterTop || flapTheta > 2 * Math.PI) {
        return null;
    }

    // Compute the SVG extents
    let formMinX = 0;
    let formMaxX = 0;
    let formMinY = 0;
    let formMaxY = 0;
    const flapInnerX = formRadius * Math.sin(flapTheta);
    const flapInnerY = formRadius * Math.cos(flapTheta);
    const flapOuterX = formRadiusOuter * Math.sin(flapTheta);
    const flapOuterY = formRadiusOuter * Math.cos(flapTheta);
    if (flapTheta < 0.5 * Math.PI) {
        formMinX = 0;
        formMinY = flapInnerY;
        formMaxX = flapOuterX;
        formMaxY = formRadiusOuter;
    } else if (flapTheta < Math.PI) {
        formMinX = 0;
        formMinY = flapOuterY;
        formMaxX = formRadiusOuter;
        formMaxY = formRadiusOuter;
    } else if (flapTheta < 1.5 * Math.PI) {
        formMinX = flapOuterX;
        formMinY = -formRadiusOuter;
        formMaxX = formRadiusOuter;
        formMaxY = formRadiusOuter;
    } else {
        formMinX = -formRadiusOuter;
        formMinY = -formRadiusOuter;
        formMaxX = formRadiusOuter;
        formMaxY = formRadiusOuter;
    }

    // Expand the form bounding box by one line width (to accomodate lines)
    const lineWidthIn = 0.5 / 72;
    formMinX -= lineWidthIn;
    formMinY -= lineWidthIn;
    formMaxX += lineWidthIn;
    formMaxY += lineWidthIn;

    // Compute the cone form guide line
    const guideInnerX = formRadius * Math.sin(formTheta);
    const guideInnerY = formRadius * Math.cos(formTheta);
    const guideOuterX = formRadiusOuter * Math.sin(formTheta);
    const guideOuterY = formRadiusOuter * Math.cos(formTheta);

    // Generate the cone form's SVG elements
    const precision = 8;
    const dashLengthIn = 2 / 72;
    return {
        'svg': 'svg',
        'attr': {
            'width': `${(formMaxX - formMinX).toFixed(precision)}in`,
            'height': `${(formMaxY - formMinY).toFixed(precision)}in`,
            'viewBox': (`${formMinX.toFixed(precision)} ${formMinY.toFixed(precision)} ` +
                        `${(formMaxX - formMinX).toFixed(precision)} ${(formMaxY - formMinY).toFixed(precision)}`)
        },
        'elem': {
            'svg': 'g',
            'attr': {
                'transform': `scale(1, -1) translate(0, ${-(formMinY + formMaxY).toFixed(precision)})`,
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': `${lineWidthIn.toFixed(precision)}`
            },
            'elem': [
                {
                    'svg': 'path',
                    'attr': {
                        'd': (`M 0 ${formRadius.toFixed(precision)} ` +
                              `A ${formRadius.toFixed(precision)} ${formRadius.toFixed(precision)}` +
                              ` 0 ${flapTheta > Math.PI ? 1 : 0} 0 ${flapInnerX.toFixed(precision)} ${flapInnerY.toFixed(precision)} ` +
                              `L ${flapOuterX.toFixed(precision)} ${flapOuterY.toFixed(precision)} ` +
                              `A ${formRadiusOuter.toFixed(precision)} ${formRadiusOuter.toFixed(precision)}` +
                              ` 0 ${flapTheta > Math.PI ? 1 : 0} 1 0 ${formRadiusOuter.toFixed(precision)} ` +
                              'Z')
                    }
                },
                {
                    'svg': 'path',
                    'attr': {
                        'stroke-dasharray': dashLengthIn.toFixed(precision),
                        'd': (`M ${guideInnerX.toFixed(precision)} ${guideInnerY.toFixed(precision)} ` +
                              `L ${guideOuterX.toFixed(precision)} ${guideOuterY.toFixed(precision)}`)
                    }
                }
            ]
        }
    };
}
