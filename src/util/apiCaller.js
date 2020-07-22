import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import config from '../config';

es6Promise.polyfill();

// import { notifyError } from '../components/Error/ErrorBoundary';

// export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'development')
//     ? process.env.BASE_URL || (`http://localhost:${config.port}/api`)
//     : '/api';

// export const API_URL = `${config.api}/api`;
export const API_URL = `${config.api}`;

// console.log(config, process.env, API_URL);

const MAX_ATTEMPTS = 3;

export default function callApi(
    endpoint,
    method = 'get',
    body,
    headersContent = {},
    isExternal = false,
) {
    headersContent['Content-Type'] = 'application/json';
    // const headers = new Headers(headersContent);
    const headers = headersContent;

    const apiUrl = isExternal ? endpoint : `${API_URL}/${endpoint}`;

    console.log(apiUrl, method, headers, body);
    return new Promise((resolve, reject) => {
        try {
            fetch(apiUrl, {
                headers,
                method,
                body: body ? JSON.stringify(body) : null,
            })
                .then(response => {
                    return response
                        .json()
                        .then(json => ({ json, response }))
                        .catch(err => {
                            notifyCallApiError(
                                err,
                                apiUrl,
                                method,
                                body,
                                headersContent,
                                isExternal,
                            );
                            reject(response.statusText || 'JsonParseError');
                        });
                })
                .then(({ json, response }) => {
                    // console.log('API Json Response', json, response);
                    if(!response.ok) {
                        // console.error('API Json Response Error', json, response);
                        // return reject(json.message);
                        return reject(json);
                    }
                    return json;
                })
                .then(response => resolve(response), err => reject(err))
                .catch(err => {
                    console.error(err);
                    reject('FetchApiError');
                    notifyCallApiError(
                        err,
                        apiUrl,
                        method,
                        body,
                        headersContent,
                        isExternal,
                    );
                    return err;
                });
        } catch (err) {
            console.error('FetchApiError', err);
            notifyCallApiError(
                err,
                apiUrl,
                method,
                body,
                headersContent,
                isExternal,
            );
            reject('FetchApiError');
        }
    });
}

export function callExternalApi(
    endpoint,
    method = 'get',
    body,
    headersContent = {},
) {
    return callApi(endpoint, method, body, headersContent, true);
}

export function buildQuery(obj, numPrefix, tempKey) {
    const outputString = [];

    Object.keys(obj).forEach(val => {
        let key = val;

        if(numPrefix && !isNaN(key)) {
            key = numPrefix + key;
        }

        key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
        if(tempKey) {
            key = `${tempKey}[${key}]`;
        }

        if(typeof obj[val] === 'object') {
            const query = buildQuery(obj[val], null, key);
            outputString.push(query);
        } else {
            const value = typeof obj[val] === 'string'
                    ? encodeURIComponent(obj[val].replace(/[!'()*]/g, escape))
                    : obj[val];
            outputString.push(`${key}=${value}`);
        }
    });

    return outputString.join('&');
}

function notifyCallApiError(
    err,
    endpoint,
    method,
    body,
    headersContent,
    isExternal,
) {
    console.error('Notify Error', err, endpoint);
    // notifyError(err, {
    //     severity: 'error',
    //     request: {
    //         endpoint,
    //         method,
    //         body,
    //         headersContent,
    //         isExternal,
    //     },
    // });
}
