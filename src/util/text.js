import slug from 'slug';
import copy from 'copy-to-clipboard';

export function capitalizeFirstLetter(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

export function slugify(string) {
    return string ? slug(string) : '';
}

export function copyToClipboard(text) {
    return copy(text);
}

export function textToColor(str) {
    str = `${str}`;
    let hash = 0;
    for(let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for(let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += (`00${value.toString(16)}`).substr(-2);
    }
    return color;
}

// from: https://gist.github.com/kongchen/941a652882d89bb96f87
export function utf8To16(input) {
    const _escape = (s) => {
        function q(c) {
            const e = c.charCodeAt();
            return `%${(e < 16 ? '0' : '')}${e.toString(16).toUpperCase()}`;
        }
        return s.replace(/[\x00-),:-?[-^`{-\xFF]/g, q);
    };
    try {
        return decodeURIComponent(_escape(input));
    } catch (URIError) {
        // include invalid character, cannot convert
        return input;
    }
}

export function nl2br(str, isXhtml) {
    if(typeof str === 'undefined' || str === null) {
        return '';
    }
    const breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
    return `${str}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
}

export function splitCamelCase(s) {
   return `${s}`.split(/([A-Z][a-z]+)/).filter(e => e);
}
