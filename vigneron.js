/**
 * Form Handler Module
 *
 * '''vigneron means a person who takes care of the vineyards'''
 *
 * @public
 *
 * @constructor
 *
 * @description
 *
 * ### TODO
 * - Need to add functions for custom validators
 * - Need to add functions to get the value of an individual element
 * - Functions to set value of inidividual elements
 *
 *
 * @param  {String} formSelector    id of the form element
 * @param  {Object} settings        settings object.
 */
var Vigneron = function( formSelector, settings ) {

    var log = bows( 'vigneron' );

    var currentSelector,
        validator,
        vigneronObject;

    var defaultOptions = {
        // TODO: Need to add default options here
    };

    var dom = {
        statusBox : {
            element   : '.js-vg-status-box-element',
            container : '.js-vg-status-box',
            success   : '.js-vg-status-success',
            fail      : '.js-vg-status-fail',
            working   : '.js-vg-status-working'
        }
    };

    /**
     * Logging messages to be used by this module
     * @type {Object}
     */
    var messages = {
        noFormSelector : 'No ID given on invocation of form module',
        initialized    : 'Initialized vigneron module',
        initSettings   : 'InitSettings called',
        noSettings     : 'No settings object provided. Turning into default settings',
        buildVigneron  : 'Building the form object.',
        buildingDom    : 'Building DOM',
        validateForm   : 'Requested to validate the whole form',
        reset          : 'requested to reset the vigneron'
    };

    /**
     * initialize options.
     * Use default values if user does not supply
     * @param  {Object} settings options provided by the user
     */
    function initSettings( settings ) {
        log( messages.initSettings );
        if ( settings ) {
            // TODO : Need to check various settings and
            // build up a new settings object. If the value does not exist
            // then go to default value, else use the value given by the user.
            // Also validate that the options provided by the user are valid.
        } else {
            log( messages.noSettings );
            settings = defaultOptions;
        }
    }

    /**
     * generates the html for the status boxes
     * @return {html} returns html
     */
    function generateStatusBoxHtml() {
        var html = '<div class="vg-status-box js-vg-status-box">' +
                        '<div class="vg-status-box-success vg-status-box-element js-vg-status-success js-vg-status-box-element"><i class="icon-ok"></i></div>'+
                        '<div class="vg-status-box-fail vg-status-box-element js-vg-status-fail js-vg-status-box-element"><i class="icon-remove"></i></div>'+
                        '<div class="vg-status-box-working vg-status-box-element js-vg-status-working js-vg-status-box-element"><i class="icon-spin icon-spinner"></i></div>'+
                    '</div>';
        return html;
    }

    /**
     * build up the DOM.
     * Add/remove/modify elements
     */
    function buildDOM() {
        log( messages.buildingDom );
        currentSelector.find( 'input' ).each( function() {
            var element = $( this );
            if ( element.is( '[data-vig-validate]' ) ) {
                var html = generateStatusBoxHtml();
                var $htmlReference = $( html ).insertAfter( this );
                $htmlReference.css( calculateStatusBoxCSS( element ) );
            }
        });

        dom.submitButton = currentSelector.find( 'input[ type="submit" ]' );
    }

    /**
     * Calculate the CSS rules for the status boxes to be inserted
     * into the input elements.
     *
     * @param  {jQuery Selector} selector jQuery Object for an **input** element
     * @return {CSS Rule Object}          CSS Rule Object
     *
     * @description
     *
     * ### TODO
     *  - Need to set the width of the status box autmotically rather than hard coding it
     *
     */
    function calculateStatusBoxCSS( selector ) {

        /**
         * Calculating the CSS properties of the input element.
         * @type {Object}
         */
        var selectorCSS = {
            paddingRight : parseCSSValue( selector.css( 'paddingRight' ) ),
            marginTop    : parseCSSValue( selector.css( 'marginTop' ) ),
            marginBottom : parseCSSValue( selector.css( 'marginBottom' ) ),
            marginLeft   : parseCSSValue( selector.css( 'marginLeft' ) ),
            offsetLeft   : parseCSSValue( selector.position().left ),
            offsetTop    : parseCSSValue( selector.position().top ),
            width        : parseCSSValue( selector.innerWidth() ),
            height       : parseCSSValue( selector.innerHeight() ),
            borderTop    : parseCSSValue( selector.css( 'border-top-width' ) ),
            borderBottom : parseCSSValue( selector.css( 'border-bottom-width' ) ),
            borderRight  : parseCSSValue( selector.css( 'border-right-width' ) ),
            borderLeft   : parseCSSValue( selector.css( 'border-left-width' ) ),
            borderRadius : parseCSSValue( selector.css( 'border-radius' ) )
        };

        /**
         * Calculating CSS of the status box
         * @type {Object}
         */
        var statusBoxCss = {
            position     : 'absolute',
            top          : selectorCSS.offsetTop + selectorCSS.marginTop + selectorCSS.borderTop,
            left         : selectorCSS.offsetLeft + selectorCSS.marginLeft +  selectorCSS.width + selectorCSS.borderLeft - 40,
            width        : '40px',
            lineHeight   : '40px',
            borderTopRightRadius : selectorCSS.borderRadius + 'px',
            borderBottomRightRadius : selectorCSS.borderRadius + 'px'
        };

        return statusBoxCss;
    }

    /**
     * Parse various CSS values and return only the numeric equivalent of the properties
     * Currently only checks for 'px' string.
     *
     * ### TODO
     *  - Need to add other checks if they exist
     *
     * @param  {String} value CSS value
     * @return {Number}       Returne the numeric part of the property
     *
     */
    function parseCSSValue( value ) {
        value = value.toString();
        value = value.replace( 'px', '' );
        value = parseInt( value, 10 );
        if ( isNaN( value ) ) {
            log( 'could not return value. Not a number' );
        } else {
            return value;
        }
    }

    /**
     * building the main vigneron object which takes care of
     *
     * - Building an object with the form element names
     * - Storing there error messages
     * - Storing their validation conditions
     * - Keeping track of their values
     *
     * @return {[type]} [description]
     */
    function buildVigneronObject() {
        log( messages.buildVigneron );
        vigneronObject = {};
        currentSelector.find( 'input' ).each( function( index, element ) {
            element = $( element );
            if ( element.is( '[data-vig-validate]' ) ) {
                var elementName = element.attr( 'name' );
                var elementErrorMsg = element.attr( 'data-vig-err' );
                var elementValidation = element.attr( 'data-vig-validate' );
                if ( elementName ) {
                    vigneronObject[ elementName ] = {
                        currentValue : null,
                        errorMsg     : elementErrorMsg,
                        validation   : elementValidation,
                        selector     : element
                    };
                }
            }
        });
        console.log( vigneronObject );
    }

    /**
     * Check for validation of a form element
     * @param  {DOM selector} element selector for the input
     */
    function checkFormElement( element ) {
        element = $( element );
        var elementName = element.attr( 'name' );
        var elementValue = element.val();
        if ( vigneronObject.hasOwnProperty( elementName ) ) {
            vigneronObject[ elementName ].currentValue = elementValue;
            validateElement( elementName );
        }
    }

    /**
     * Validate an element and call the respective functions
     *
     * @param  {String} name input element name
     */
    function validateElement( name ) {
        if ( vigneronObject.hasOwnProperty( name ) ) {
            var elementObject = vigneronObject[ name ];
            var elementValidation = elementObject.validation;
            var validationCheck = vigneronValidator.returnCheck( elementValidation );
            var validationResponse = validationCheck( elementObject.currentValue );
            if ( validationResponse ) {
                elementObject.validationStatus = true;
                showSuccess( name );
            } else {
                elementObject.validationStatus = false;
                showFail( name );
            }
        }
    }

    /**
     * Show success on an element
     * Show status box if set to true
     *
     * @param  {String} name form element name
     *
     */
    function showSuccess( name ) {
        if ( vigneronObject.hasOwnProperty( name ) ) {
            var elementObject = vigneronObject[ name ];
            var selector = elementObject.selector;
            selector.next( dom.statusBox.container ).find( dom.statusBox.element ).hide();
            selector.next( dom.statusBox.container ).find( dom.statusBox.success ).show();
        }
    }

    /**
     * Show fail on an element
     * Show status box if set to true
     * Show error message if provided and set to true
     * @param  {String} name form element name
     */
    function showFail( name ) {
        if ( vigneronObject.hasOwnProperty( name ) ) {
            var elementObject = vigneronObject[ name ];
            var selector = elementObject.selector;
            selector.next( dom.statusBox.container ).find( dom.statusBox.element ).hide();
            selector.next( dom.statusBox.container ).find( dom.statusBox.fail ).show();
        }
    }

    /**
     * Show a loading status box on the input container
     * @param  {String} name form element name
     */
    function showWorking( name ) {
        if ( vigneronObject.hasOwnProperty( name ) ) {
            var elementObject = vigneronObject[ name ];
            var selector = elementObject.selector;
            selector.next( dom.statusBox.container ).find( dom.statusBox.element ).hide();
            selector.next( dom.statusBox.container ).find( dom.statusBox.working ).show();
        }
    }

    function validateForm() {
        log( messages.validateForm );
        var validationStatus = true;
        for( var item in vigneronObject ) {
            var formElement = vigneronObject[ item ];
            checkFormElement( formElement.selector );
            if ( !formElement.validationStatus ) {
                if ( !formElement.validationStatus ) {
                    validationStatus = false;
                }
            }
        }

        return validationStatus;
    }

    /**
     * Bind various DOM events
     */
    function bindDOMEvents() {
        currentSelector.on( 'blur', 'input', function() {
            checkFormElement( this );
        } );
    }

    /**
     * update the form whenever the form ui or value has been changed
     */
    function update() {
        buildVigneronObject();
        buildDOM();
        bindDOMEvents();
    }

    /**
     * reset form
     * @return {[type]} [description]
     */
    function reset() {
        log( messages.reset );
        currentSelector.find( dom.statusBox.container ).hide();
    }

    /**
     * ### Self initialization function
     *
     */
    (function init() {
        log( messages.initialized );
        if ( formSelector ) {
            currentSelector = $( formSelector );
            initSettings( settings );
            buildVigneronObject();
            buildDOM();
            bindDOMEvents();
        } else {
            log( messages.noFormSelector );
        }
    })();

    return {
        validateForm : validateForm,
        update       : update,
        reset        : reset
    };

};

