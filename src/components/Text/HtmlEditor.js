import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';

// if(typeof window !== 'undefined') {
//     console.log('window exists !', window);
//     const CKEditor = require('ckeditor4-react'); // eslint-disable-line global-require
// }

import CKEditor from 'react-ckeditor-component';

function HtmlEditor(props) {
   //  if(typeof window !== 'undefined') {
   //      return (
   //          <CKEditor
   //              {...props}
   //              onCustomConfigLoaded={e => {
   //                  // Load MathType plugin.
   //                  window.CKEDITOR.plugins.addExternal('ckeditor_wiris', '../../../node_modules/@wiris/mathtype-ckeditor4/plugin.js');
   //              }}
   //              data={props.content}
   //              type={props.isInline ? 'inline' : 'classic'}
   //              config={{
   //                  ...props.config,
   //                  extraPlugins: 'ckeditor_wiris',
   //                  toolbar: [['ckeditor_wiris_formulaEditor']],
   //                  allowedContent: true,
   //              }}
   //          />
   //     );
   // }
   // return null;

   return (
       <CKEditor
           {...props}
           content={props.content}
           events={{
               'change': event => props.onChange && props.onChange(event.editor.getData()),
           }}
           scriptUrl={`${config.url}assets/ckeditor/ckeditor.js`}
           config={{
               ...props.config,
               // extraPlugins: 'ckeditor_wiris',
               // toolbar: [['ckeditor_wiris_formulaEditor']],
               allowedContent: true,
           }}
       />
   );
}

HtmlEditor.defaultProps = {
    content: '',
};

HtmlEditor.propTypes = {
    content: PropTypes.string.isRequired,
    config: PropTypes.object,
    onChange: PropTypes.func,
};

export default HtmlEditor;
