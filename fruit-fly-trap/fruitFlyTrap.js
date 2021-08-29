// Licensed under the MIT License
// https://github.com/craigahobbs/fruit-fly-trap/blob/main/LICENSE

import * as smd from '../schema-markdown/index.js';
import {UserTypeElements} from '../schema-markdown-doc/index.js';
import {encodeQueryString} from '../schema-markdown/index.js';
import {renderElements} from '../element-model/index.js';


// The application's hash parameter type model
const appHashTypes = (new smd.SchemaMarkdownParser(`\
# The FruitFlyTrap application hash parameters struct
struct FruitFlyTrap

    # Optional command
    optional Command cmd

    # The diameter of the glass, in inches (default is 3 in)
    optional float(>= 1, <= 36) d

    # The diameter of the cone's bottom hole, in inches (default is 0.5 in)
    optional float(>= 0.1, <= 36) b

    # The height of the glass, in inches (default is 6 in)
    optional float(>= 1, <= 36) h

    # The offset from the bottom of the glass, in inches (default is 1 in)
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
            'd': 3,
            'h': 4.5,
            'o': 1,
            'b': 0.5,
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

        // Compute the cone form elements
        const formElements = coneFormElements(this.config.d, this.config.b, this.config.h - this.config.o, 0.5 * this.config.o);

        // Print?
        if ('cmd' in this.params && 'print' in this.params.cmd) {
            return {'elements': formElements};
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
                    {'text': ' '},
                    {'html': 'a', 'attr': {'href': `#${encodeQueryString(moreParams)}`}, 'elem': {'text': 'More'}},
                    {'text': `): ${this.config[param].toFixed(2)} in`}
                ]
            };
        };

        // Fruit fly trap form editor
        return {
            'elements': [
                {'html': 'h1', 'elem': {'text': 'Ye Olde Fruit Fly Trap'}},
                {'html': 'p', 'elem': [
                    {
                        'html': 'a',
                        'attr': {'href': `#${encodeQueryString({...this.params, 'cmd': {'print': 1}})}`},
                        'elem': {'text': 'Print'}
                    },
                    {'text': ' | '},
                    {'html': 'a', 'attr': {'href': '#'}, 'elem': {'text': 'Reset'}}
                ]},
                updown('Glass inside-diameter', 'd', 0.1),
                updown('Glass height', 'h', 0.1),
                updown('Glass bottom-offset', 'o', 0.1),
                updown('Cone bottom diameter', 'b', 0.1),
                {'html': 'p', 'elem': {'text': '\xa0'}},
                formElements
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

    // Compute the cone form's points
    const formPoints = [];
    const formCenterX = 0;
    const formCenterY = formRadiusOuter;
    const formPointCount = 100;
    const formExtraCount = formPointCount + 10;
    const thetaDelta = formTheta / formPointCount;
    let formPathMinX = 0;
    let formPathMaxX = 0;
    let formPathMinY = 0;
    let formPathMaxY = 0;
    for (const forward of [true, false]) {
        const radius = forward ? formRadius : formRadiusOuter;
        for (let thetaIx = 0; thetaIx < formExtraCount; thetaIx += 1) {
            const theta = thetaDelta * (forward ? thetaIx : formExtraCount - thetaIx - 1);
            const formPathX = formCenterX + radius * Math.sin(theta);
            const formPathY = formCenterY - radius * Math.cos(theta);
            formPoints.push([formPathX, formPathY]);
            formPathMinX = Math.min(formPathMinX, formPathX);
            formPathMaxX = Math.max(formPathMaxX, formPathX);
            formPathMinY = Math.min(formPathMinY, formPathY);
            formPathMaxY = Math.max(formPathMaxY, formPathY);
        }
    }

    // Compute the cone form's extra marker
    const thetaExtra = formPointCount * thetaDelta;
    const formExtraPoints = [
        [formCenterX + formRadius * Math.sin(thetaExtra), formCenterY - formRadius * Math.cos(thetaExtra)],
        [formCenterX + formRadiusOuter * Math.sin(thetaExtra), formCenterY - formRadiusOuter * Math.cos(thetaExtra)]
    ];

    // Compute the SVG extents
    const lineWidthIn = 0.5 / 72;
    formPathMinX -= lineWidthIn;
    formPathMaxX += lineWidthIn;
    formPathMinY -= lineWidthIn;
    formPathMaxY += lineWidthIn;
    const formWidth = formPathMaxX - formPathMinX;
    const formHeight = formPathMaxY - formPathMinY;

    // Generate the cone form's SVG elements
    return {
        'svg': 'svg',
        'attr': {
            'width': `${formWidth.toFixed(3)}in`,
            'height': `${formHeight.toFixed(3)}in`,
            'viewBox': `${formPathMinX.toFixed(3)} ${formPathMinY.toFixed(3)} ${formWidth.toFixed(3)} ${formHeight.toFixed(3)}`
        },
        'elem': [formPoints, formExtraPoints].map((points) => ({
            'svg': 'path',
            'attr': {
                'fill': 'none',
                'stroke': 'black',
                'stroke-width': `${lineWidthIn.toFixed(3)}`,
                // eslint-disable-next-line prefer-template
                'd': points.map((pt, ix) => `${ix === 0 ? 'M' : 'L'} ${pt[0].toFixed(3)} ${pt[1].toFixed(3)}`).join(' ') + ' Z'
            }
        }))
    };
}
