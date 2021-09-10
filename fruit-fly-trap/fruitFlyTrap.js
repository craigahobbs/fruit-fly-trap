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
    'b': 0.7,
    'h': 4.5,
    'o': 1
};


// The application's hash parameter type model
const appHashTypes = (new smd.SchemaMarkdownParser(`\
# The FruitFlyTrap application hash parameters struct
struct FruitFlyTrap

    # Optional command
    optional Command cmd

    # The diameter of the glass, in inches (default is ${defaultParamValues.d} in)
    optional float(>= 1, <= 36) d

    # The diameter of the cone's bottom hole, in inches (default is ${defaultParamValues.b} in)
    optional float(>= 0.1, <= 32) b

    # The height of the glass, in inches (default is ${defaultParamValues.h} in)
    optional float(>= 1, <= 24) h

    # The offset from the bottom of the glass, in inches (default is ${defaultParamValues.o} in)
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
        const paramsDefault = {...defaultParamValues, ...this.params};
        if ('cmd' in this.params && 'print' in this.params.cmd) {
            return {'elements': FruitFlyTrap.trapFormElements(paramsDefault)};
        }

        // Helper function for up/down links
        const updownLink = (param, up) => {
            const linkParams = {...this.params};
            const testParams = {...paramsDefault};
            const {attr} = appHashTypes.FruitFlyTrap.struct.members.find((member) => member.name === param);
            const delta = 0.1;
            const roundFactor = 10;
            if (up) {
                testParams[param] = Math.round(roundFactor * Math.min(testParams[param] + delta, attr.lte)) / roundFactor;
            } else {
                testParams[param] = Math.round(roundFactor * Math.max(testParams[param] - delta, attr.gte)) / roundFactor;
            }
            if (FruitFlyTrap.trapFormElements(testParams) !== null) {
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
below. The fruit flies, attracted to the liquid, fly into the trap through the cone where they
become trapped!

~~~ fruit-fly-trap-diagram
220, 200
~~~

## Instructions

1. Measure the drinking glass's top-inside diameter, height, and cone-bottom offset. Use the "Less"
   and "More" links below to enter the measurements.

   **Glass inside-diameter (d)** ([Less](${updownLink('d', false)}) | [More](${updownLink('d', true)})): ${paramsDefault.d} in

   **Glass height (h)** ([Less](${updownLink('h', false)}) | [More](${updownLink('h', true)})): ${paramsDefault.h} in

   **Cone bottom-offset (o)** ([Less](${updownLink('o', false)}) | [More](${updownLink('o', true)})): ${paramsDefault.o} in

   **Cone bottom diameter (b)** ([Less](${updownLink('b', false)}) | [More](${updownLink('b', true)})): ${paramsDefault.b} in

   At any time, you can [reset the cone measurements](#).

2. [Print the cone form](#${encodeQueryString({...this.params, 'cmd': {'print': 1}})}). Using
   scissors, cut along the dotted line to cut out the cone form.

3. Tape the cone together along the cone form's flap line.

4. Pour a small amount of fruit-fly-attracting liquid (e.g., apple cider vinegar) into the glass.
   Be sure the liquid level is at least 1/4" below the cone-bottom offset you measured above.

5. Place the cone form in the glass. It may help to rub some water around the top rim of the glass
   to form a seal.

6. Set the trap near where you have fruit flies.
`),
                null,
                {'fruit-fly-trap-diagram': (codeBlock) => fruitFlyTrapDiagram(codeBlock)}
            )
        };
    }

    // Helper function to get a fruit fly trap cone form elements
    static trapFormElements(params) {
        return coneFormElements(params.d, params.b, params.h - params.o, params.o > 0 ? 0.5 : 0);
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
                'y': (0.5 * (top + bottom)).toFixed(precision)
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
                'y': ycoord.toFixed(precision)
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
                'height': height.toFixed(precision),
                'font-size': `${annotationTextSize.toFixed(precision)}px`,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
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
 * @property {number} [extraLength=0] - Extra length to add to the cone's side
 * @returns {Object} The cone form's element model
 */
export function coneFormElements(diameterTop, diameterBottom, height, extraLength = 0) {
    // Compute the cone form's radii and theta
    const formRadius = height * diameterBottom / (diameterTop - diameterBottom);
    const formRadiusOuter = formRadius + height + extraLength;
    const formTheta = Math.PI * diameterBottom / formRadius;

    // Compute the flap angle
    const flapLength = 0.125;
    const flapTheta = formTheta + flapLength / formRadius;

    // Invalid cone specification?
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

    // Return the cone form's SVG element model
    const precision = 8;
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
                        'stroke-dasharray': `${5 * lineWidthIn.toFixed(precision)}`,
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
