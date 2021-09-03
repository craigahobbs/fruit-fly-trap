// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

import * as smd from 'schema-markdown/index.js';
import {markdownElements, parseMarkdown} from 'markdown-model/index.js';
import {UserTypeElements} from 'schema-markdown-doc/index.js';
import {encodeQueryString} from 'schema-markdown/index.js';
import {renderElements} from 'element-model/index.js';


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

        // Compute the params with defaults
        this.config = {
            'd': defaultTop,
            'b': defaultBottom,
            'h': defaultHeight,
            'o': defaultOffset,
            ...this.params
        };
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
            return {'elements': coneFormElements(this.config.d, this.config.b, this.config.h - this.config.o, 0.5 * this.config.o)};
        }

        // Input up/down helper component
        const updown = (label, param, delta) => {
            const {attr} = appHashTypes.FruitFlyTrap.struct.members.find((member) => member.name === param);
            const lessParams = {...this.params};
            const moreParams = {...this.params};
            lessParams[param] = Math.max(this.config[param] - delta, attr.gte).toPrecision(2);
            moreParams[param] = Math.min(this.config[param] + delta, attr.lte).toPrecision(2);
            return {
                'html': 'p',
                'elem': [
                    {'text': `${label} (`},
                    {'html': 'a', 'attr': {'href': `#${encodeQueryString(lessParams)}`}, 'elem': {'text': 'Less'}},
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': `#${encodeQueryString(moreParams)}`}, 'elem': {'text': 'More'}},
                    {'text': `): ${this.config[param].toFixed(2)} in`}
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


// Cone form SVG component
function coneFormElements(diameterTop, diameterBottom, height, extraLength) {
    // Compute the cone form's radii and theta
    const formRadius = height * diameterBottom / (diameterTop - diameterBottom);
    const formRadiusOuter = formRadius + height + extraLength;
    const formTheta = Math.PI * diameterBottom / formRadius;

    // Compute the flap angle
    const flapLength = 0.125;
    const flapTheta = (formTheta + flapLength / formRadius) % (2 * Math.PI);

    // Compute the SVG extents
    let formMinX = 0;
    let formMaxX = 0;
    let formMinY = 0;
    let formMaxY = 0;
    const flapInnerX = formRadius * Math.sin(flapTheta);
    const flapInnerY = formRadius * Math.cos(flapTheta);
    const flapOuterX = formRadiusOuter * Math.sin(flapTheta);
    const flapOuterY = formRadiusOuter * Math.cos(flapTheta);
    if (flapTheta > 1.5 * Math.PI) {
        formMinX = -formRadiusOuter;
        formMinY = -formRadiusOuter;
        formMaxX = formRadiusOuter;
        formMaxY = formRadiusOuter;
    } else if (flapTheta > Math.PI) {
        formMinX = flapOuterX;
        formMinY = -formRadiusOuter;
        formMaxX = formRadiusOuter;
        formMaxY = formRadiusOuter;
    } else if (flapTheta > 0.5 * Math.PI) {
        formMinX = 0;
        formMinY = flapOuterY;
        formMaxX = formRadiusOuter;
        formMaxY = formRadiusOuter;
    } else {
        formMinX = 0;
        formMinY = flapInnerY;
        formMaxX = flapOuterX;
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
    const dashLengthIn = 3 / 72;
    return {
        'svg': 'svg',
        'attr': {
            'width': `${(formMaxX - formMinX).toFixed(3)}in`,
            'height': `${(formMaxY - formMinY).toFixed(3)}in`,
            'viewBox': (`${formMinX.toFixed(3)} ${formMinY.toFixed(3)} ` +
                        `${(formMaxX - formMinX).toFixed(3)} ${(formMaxY - formMinY).toFixed(3)}`)
        },
        'elem': {
            'svg': 'g',
            'attr': {
                'transform': `scale(1, -1) translate(0, ${-(formMinY + formMaxY).toFixed(3)})`,
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': `${lineWidthIn.toFixed(3)}`
            },
            'elem': [
                {
                    'svg': 'path',
                    'attr': {
                        'd': (`M 0 ${formRadius.toFixed(3)} ` +
                              `A ${formRadius.toFixed(3)} ${formRadius.toFixed(3)} 0 ${flapTheta > Math.PI ? 1 : 0} 0 ` +
                              `${flapInnerX.toFixed(3)} ${flapInnerY.toFixed(3)} ` +
                              `L ${flapOuterX.toFixed(3)} ${flapOuterY.toFixed(3)} ` +
                              `A ${formRadiusOuter.toFixed(3)} ${formRadiusOuter.toFixed(3)} 0 ${flapTheta > Math.PI ? 1 : 0} 1 ` +
                              `0 ${formRadiusOuter.toFixed(3)} ` +
                              'Z')
                    }
                },
                {
                    'svg': 'path',
                    'attr': {
                        'stroke-dasharray': dashLengthIn.toFixed(3),
                        'd': `M ${guideInnerX.toFixed(3)} ${guideInnerY.toFixed(3)} L ${guideOuterX.toFixed(3)} ${guideOuterY.toFixed(3)}`
                    }
                }
            ]
        }
    };
}
