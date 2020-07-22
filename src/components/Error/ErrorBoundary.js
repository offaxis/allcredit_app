import React from 'react';
import bugsnag from 'bugsnag-js';
import createPlugin from 'bugsnag-react';

import config from '../../config';
import { version } from '../../../package.json';

let bugsnagClient = null;
if(typeof window !== 'undefined') {
    bugsnagClient = bugsnag({ apiKey: config.bugsnag.key, appVersion: version, notifyReleaseStages: ['production'], appType: 'client_browser' });
}


export function notifyError(error, meta = {}) {
    bugsnagClient && bugsnagClient.notify(error, meta);
}

export default bugsnagClient && bugsnagClient.use(createPlugin(React));
