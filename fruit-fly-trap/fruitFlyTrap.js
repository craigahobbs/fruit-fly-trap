// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

import * as smd from '../schema-markdown/index.js';
import {markdownElements, parseMarkdown} from '../markdown-model/index.js';
import {UserTypeElements} from '../schema-markdown-doc/index.js';
import {encodeQueryString} from '../schema-markdown/index.js';
import {renderElements} from '../element-model/index.js';


// Default parameter values
const defaultParamValues = {
    'd': 3,
    'b': 0.75,
    'h': 4.5,
    'o': 1
};


// Default metric parameter values
const defaultMetricParamValues = {
    'd': 7.5,
    'b': 2,
    'h': 11.5,
    'o': 2.5
};


// The application's hash parameter type model
const appHashTypes = (new smd.SchemaMarkdownParser(`\
# The FruitFlyTrap application hash parameters struct
struct FruitFlyTrap

    # Optional command
    optional Command cmd

    # The diameter of the glass, in inches or centimeters, as determined by the "metric" member
    # (default is ${defaultParamValues.d} in. or ${defaultMetricParamValues.d} cm.)
    optional float(>= 1, <= 36) d

    # The diameter of the cone's bottom hole, in inches or centimeters, as determined by the "metric" member
    # (default is ${defaultParamValues.b} in. or ${defaultMetricParamValues.b} cm.)
    optional float(>= 0.1, <= 32) b

    # The height of the glass, in inches or centimeters, as determined by the "metric" member
    # (default is ${defaultParamValues.h} in. or ${defaultParamValues.h} cm.)
    optional float(>= 1, <= 24) h

    # The offset from the bottom of the glass, in inches or centimeters, as determined by the "metric" member
    # (default is ${defaultParamValues.o} in. or ${defaultParamValues.o} cm.)
    optional float(>= 0, <= 6) o

    # If set, use metric units (centimeters). Otherwise, use imperial units (inches, the default).
    optional int(== 1) metric

# Application command union
union Command

    # Render the application's hash parameter documentation
    int(== 1) help

    # Print the cone form pattern
    int(== 1) print
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

        // Imperial units or metric?
        const metric = 'metric' in this.params;
        const units = metric ? 'cm' : 'in';
        const paramsDefault = metric ? {...defaultMetricParamValues, ...this.params} : {...defaultParamValues, ...this.params};

        // Helper function to get a fruit fly trap cone form elements
        const trapFormElements = (params) => {
            const flapLength = metric ? 0.5 : 0.2;
            const lineWidth = metric ? 0.018 : 0.007;
            const extraLength = params.o > 0 ? (metric ? 1.25 : 0.5) : 0;
            return coneFormElements(params.d, params.b, params.h - params.o, flapLength, lineWidth, units, extraLength);
        };

        // Print?
        if ('cmd' in this.params && 'print' in this.params.cmd) {
            return {'elements': trapFormElements(paramsDefault)};
        }

        // Helper function for up/down links
        const updownLink = (param, up) => {
            const linkParams = {...this.params};
            const testParams = {...paramsDefault};
            const {attr} = appHashTypes.FruitFlyTrap.struct.members.find((member) => member.name === param);
            const delta = metric ? 0.1 : 0.125;
            const roundFactor = 1 / delta;
            if (up) {
                testParams[param] = Math.round(roundFactor * Math.min(testParams[param] + delta, attr.lte)) / roundFactor;
            } else {
                testParams[param] = Math.round(roundFactor * Math.max(testParams[param] - delta, attr.gte)) / roundFactor;
            }
            if (trapFormElements(testParams) !== null) {
                linkParams[param] = testParams[param];
            }
            return `#${encodeQueryString(linkParams)}`;
        };

        // Fruit fly trap form editor
        return {
            'elements': markdownElements(
                parseMarkdown(`\
# The Fruit Fly Trap Maker

**The Fruit Fly Trap Maker** rids your home of annoying fruit flies using only a drinking glass,
your computer printer, and a small amount of apple cider vinegar (or similar).

The trap is made by placing a custom-fitted cone (based on your measurements) into a drinking glass
containing a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar), as pictured
below. The fruit flies fly in through the cone opening and become trapped between the cone and the
liquid.

~~~ fruit-fly-trap-diagram
220, 200
~~~

## Instructions

1. Measure the drinking glass's top-inside diameter, height, and cone-bottom offset (see diagram
   above). The cone-bottom offset is the distance from the bottom of the glass to the bottom of the
   trap cone, allowing enough room for the liquid and space for the fruit flies to get into the
   trap. Use the "Less" and "More" links below to enter the measurements.

   **Glass inside-diameter (d)** ([Less](${updownLink('d', false)}) | [More](${updownLink('d', true)})): ${paramsDefault.d} ${units}

   **Glass height (h)** ([Less](${updownLink('h', false)}) | [More](${updownLink('h', true)})): ${paramsDefault.h} ${units}

   **Cone bottom-offset (o)** ([Less](${updownLink('o', false)}) | [More](${updownLink('o', true)})): ${paramsDefault.o} ${units}

   **Cone bottom diameter (b)** ([Less](${updownLink('b', false)}) | [More](${updownLink('b', true)})): ${paramsDefault.b} ${units}

   Click here to [use ${metric ? 'imperial' : 'metric'} units](${metric ? '#' : '#metric=1'}).
   At any time, you can [reset the cone measurements](${metric ? '#metric=1' : '#'}).

2. Print the cone form using the link below. Cut out the cone form carefully using scissors. Use
   your browser's back button to return to this page after printing.

   [Print Cone Form](#${encodeQueryString({...this.params, 'cmd': {'print': 1}})})

3. Tape the cone together along the cone form's flap line.

4. Pour a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar) into the glass. Be
   sure the liquid level is at least ${metric ? '1/2 cm.' : '1/4 in.'} below the cone-bottom.

5. Place the cone form in the glass. It may help to rub some water around the top rim of the glass
   to form a seal.

6. Set the trap near where you have fruit flies.
`),
                null,
                {'fruit-fly-trap-diagram': (codeBlock) => fruitFlyTrapDiagram(codeBlock)}
            )
        };
    }
}


// Fruit fly trap diagram SVG markdown-model code block function
export function fruitFlyTrapDiagram({lines}) {
    // Parse the SVG width and height
    const [width, height] = lines[0].split(',').map((val) => parseInt(val, 10));

    // Constants
    const precision = 3;
    const imageMargin = 12;
    const lineWidth = 1;
    const glassLineWidth = 5 * lineWidth;
    const annotationWidth = 20;
    const annotationBarWidth = 0.5 * annotationWidth;
    const annotationTextHeight = 1.2 * annotationWidth;
    const annotationTextSize = 0.7 * annotationWidth;
    const airHeight = annotationWidth;
    const liquidHeight = 1.5 * airHeight;

    // Glass position
    const glassTop = 0.25 * height;
    const glassLeft = imageMargin + annotationWidth + 0.5 * glassLineWidth;
    const glassLeftRight = glassLeft + 0.5 * glassLineWidth;
    const glassBottom = height - imageMargin - 0.5 * glassLineWidth;
    const glassRight = width - glassLeft;
    const glassRightLeft = glassRight - 0.5 * glassLineWidth;

    // Cone position
    const coneBottom = height - imageMargin - glassLineWidth - liquidHeight - airHeight;
    const coneBottomLeft = 0.5 * width - annotationWidth;
    const coneBottomRight = width - coneBottomLeft;
    const coneTop = imageMargin;
    const coneTopLeft = (coneBottomLeft * (glassTop - coneTop) + glassLeftRight * (coneTop - coneBottom)) / (glassTop - coneBottom);
    const coneTopRight = width - coneTopLeft;

    // Helper function to create vertical annotations
    const verticalAnnotation = (text, xcoord, top, bottom) => [
        {
            'svg': 'path',
            'attr': {
                'fill': 'white',
                'stroke': 'black',
                'stroke-width': lineWidth.toFixed(precision),
                'd': `\
M ${(xcoord - 0.5 * annotationBarWidth).toFixed(precision)} ${top.toFixed(precision)} \
L ${(xcoord + 0.5 * annotationBarWidth).toFixed(precision)} ${top.toFixed(precision)} \
M ${xcoord.toFixed(precision)} ${top.toFixed(precision)} \
L ${xcoord.toFixed(precision)} ${(0.5 * (top + bottom) - 0.5 * annotationTextHeight).toFixed(precision)} \
M ${xcoord.toFixed(precision)} ${bottom.toFixed(precision)} \
L ${xcoord.toFixed(precision)} ${(0.5 * (top + bottom) + 0.5 * annotationTextHeight).toFixed(precision)} \
M ${(xcoord - 0.5 * annotationBarWidth).toFixed(precision)} ${bottom.toFixed(precision)} \
L ${(xcoord + 0.5 * annotationBarWidth).toFixed(precision)} ${bottom.toFixed(precision)}`
            }
        },
        {
            'svg': 'text',
            'attr': {
                'x': xcoord.toFixed(precision),
                'y': (0.5 * (top + bottom)).toFixed(precision),
                'font-size': `${annotationTextSize.toFixed(precision)}px`,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
            },
            'elem': {'text': text}
        }
    ];

    // Helper function to create horizontal annotations
    const horizontalAnnotation = (text, ycoord, left, right) => [
        {
            'svg': 'path',
            'attr': {
                'fill': 'white',
                'stroke': 'black',
                'stroke-width': lineWidth.toFixed(precision),
                'd': `\
M ${left.toFixed(precision)} ${(ycoord - 0.5 * annotationBarWidth).toFixed(precision)} \
L ${left.toFixed(precision)} ${(ycoord + 0.5 * annotationBarWidth).toFixed(precision)} \
M ${left.toFixed(precision)} ${ycoord.toFixed(precision)} \
L ${(0.5 * (left + right) - 0.5 * annotationTextHeight).toFixed(precision)} ${ycoord.toFixed(precision)} \
M ${right.toFixed(precision)} ${ycoord.toFixed(precision)} \
L ${(0.5 * (left + right) + 0.5 * annotationTextHeight).toFixed(precision)} ${ycoord.toFixed(precision)} \
M ${right.toFixed(precision)} ${(ycoord - 0.5 * annotationBarWidth).toFixed(precision)} \
L ${right.toFixed(precision)} ${(ycoord + 0.5 * annotationBarWidth).toFixed(precision)}`
            }
        },
        {
            'svg': 'text',
            'attr': {
                'x': (0.5 * (left + right)).toFixed(precision),
                'y': ycoord.toFixed(precision),
                'font-size': `${annotationTextSize.toFixed(precision)}px`,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
            },
            'elem': {'text': text}
        }
    ];

    // Return the fruit fly trap diagram element model
    return {
        'html': 'p',
        'elem': {
            'svg': 'svg',
            'attr': {
                'width': width.toFixed(precision),
                'height': height.toFixed(precision)
            },
            'elem': [
                // Liquid
                {
                    'svg': 'path',
                    'attr': {
                        'fill': '#cc99ff80',
                        'stroke': 'none',
                        'stroke-width': glassLineWidth.toFixed(precision),
                        'd': `\
M ${glassLeft.toFixed(precision)} ${(glassBottom - liquidHeight).toFixed(precision)} \
L ${glassLeft.toFixed(precision)} ${glassBottom.toFixed(precision)} \
L ${glassRight.toFixed(precision)} ${glassBottom.toFixed(precision)} \
L ${glassRight.toFixed(precision)} ${(glassBottom - liquidHeight).toFixed(precision)}
Z`
                    }
                },

                // Glass
                {
                    'svg': 'path',
                    'attr': {
                        'fill': 'none',
                        'stroke': 'black',
                        'stroke-width': glassLineWidth.toFixed(precision),
                        'd': `\
M ${glassLeft.toFixed(precision)} ${glassTop.toFixed(precision)} \
L ${glassLeft.toFixed(precision)} ${glassBottom.toFixed(precision)} \
L ${glassRight.toFixed(precision)} ${glassBottom.toFixed(precision)} \
L ${glassRight.toFixed(precision)} ${glassTop.toFixed(precision)}`
                    }
                },

                // Cone
                {
                    'svg': 'path',
                    'attr': {
                        'fill': 'white',
                        'stroke': 'black',
                        'stroke-width': lineWidth.toFixed(precision),
                        'd': `\
M ${coneTopLeft.toFixed(precision)} ${coneTop.toFixed(precision)} \
L ${coneBottomLeft.toFixed(precision)} ${coneBottom.toFixed(precision)} \
L ${coneBottomRight.toFixed(precision)} ${coneBottom.toFixed(precision)} \
L ${coneTopRight.toFixed(precision)} ${coneTop.toFixed(precision)}
Z`
                    }
                },

                // Annotations
                verticalAnnotation('h', imageMargin + 0.5 * annotationBarWidth, glassTop, glassBottom),
                verticalAnnotation('o', width - imageMargin - 0.5 * annotationBarWidth, coneBottom, glassBottom),
                horizontalAnnotation('d', glassTop - annotationWidth + 0.5 * annotationBarWidth, glassLeftRight, glassRightLeft),
                horizontalAnnotation('b', coneBottom - annotationWidth + 0.5 * annotationBarWidth, coneBottomLeft, coneBottomRight)
            ]
        }
    };
}


/**
 * Cone form SVG element-model component function
 *
 * @property {number} diameterTop - The cone's top diameter
 * @property {number} diameterBottom - The cone's bottom diameter
 * @property {number} height - The cone's height
 * @property {number} flapLength - The cone form's flap length
 * @property {number} lineWidth - The cone form's line width
 * @property {string} [units='in'] - The units of each measure (e.g., diameterTop)
 * @property {number} [extraLength=0] - Extra length to add to the cone's side
 * @returns {Object} The cone form's element model
 */
export function coneFormElements(diameterTop, diameterBottom, height, flapLength, lineWidth, units = 'in', extraLength = 0) {
    // Compute the cone form's radii and theta
    const formRadius = height * diameterBottom / (diameterTop - diameterBottom);
    const formRadiusOuter = formRadius + height + extraLength;
    const formTheta = Math.PI * diameterBottom / formRadius;

    // Compute the flap angle
    const flapTheta = formTheta + flapLength / formRadius;

    // Invalid cone specification?
    if (diameterBottom > 0.9 * diameterTop || flapTheta > 0.9 * 2 * Math.PI) {
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
    formMinX -= lineWidth;
    formMinY -= lineWidth;
    formMaxX += lineWidth;
    formMaxY += lineWidth;

    // Compute the cone form guide line
    const guideInnerX = formRadius * Math.sin(formTheta);
    const guideInnerY = formRadius * Math.cos(formTheta);
    const guideOuterX = formRadiusOuter * Math.sin(formTheta);
    const guideOuterY = formRadiusOuter * Math.cos(formTheta);

    // Return the cone form's SVG element model
    const precision = 8;
    return {
        'svg': 'svg',
        'attr': {
            'width': `${(formMaxX - formMinX).toFixed(precision)}${units}`,
            'height': `${(formMaxY - formMinY).toFixed(precision)}${units}`,
            'viewBox': (`${formMinX.toFixed(precision)} ${formMinY.toFixed(precision)} ` +
                        `${(formMaxX - formMinX).toFixed(precision)} ${(formMaxY - formMinY).toFixed(precision)}`)
        },
        'elem': {
            'svg': 'g',
            'attr': {
                'transform': `scale(1, -1) translate(0, ${-(formMinY + formMaxY).toFixed(precision)})`,
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': `${lineWidth.toFixed(precision)}`
            },
            'elem': [
                {
                    'svg': 'path',
                    'attr': {
                        'stroke-dasharray': `${(5 * lineWidth).toFixed(precision)}`,
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
                        'stroke': 'lightgray',
                        'd': (`M ${guideInnerX.toFixed(precision)} ${guideInnerY.toFixed(precision)} ` +
                              `L ${guideOuterX.toFixed(precision)} ${guideOuterY.toFixed(precision)}`)
                    }
                }
            ]
        }
    };
}
