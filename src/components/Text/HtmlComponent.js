import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import reactHtmlParser, { convertNodeToElement } from 'react-html-parser';

class HtmlComponent extends Component {

    constructor(props) {
        super(props);
        this.transform = this.transform.bind(this);
    }

    transform(node, index) {
    }

    renderHtml() {
        if(this.props.text) {
            // Patch for Wiris plugin, see: https://docs.wiris.com/en/mathtype/mathtype_web/integrations/mathml-mode
            setTimeout(() => {
                const textWrappers = document.getElementsByClassName('html-text-wrapper');
                for(let i = 0; i < textWrappers.length; i++) {
                    window.com.wiris.js.JsPluginViewer.parseElement(textWrappers[i], true, function() {});
                }
            }, 500);
            return reactHtmlParser(this.props.text, {
                transform: this.transform,
            });
        }
    }

    render() {
        return (
            <div className="html-text-wrapper">{this.renderHtml()}</div>
        );
    }

}

HtmlComponent.propTypes = {
    text: PropTypes.string.isRequired,
};

export default HtmlComponent;
