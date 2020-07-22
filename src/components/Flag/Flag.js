import React from 'react';
import PropTypes from 'prop-types';

import config from '../../config';

export default function Flag({ country }) {
    function getCountryFileName() {
        if(country.includes('_')) {
            return country.toLowerCase();
        }
        return country.toUpperCase();
    }

    function getImgPath() {
        if(country) {
            return `assets/images/flags/${getCountryFileName()}.png`;
        }
        return '';
    }

    const flagImgPath = getImgPath();
    return flagImgPath ? <img src={`/${flagImgPath}`} alt={`flag ${country}`} title={country} /> : <span>{country}</span>;
}

Flag.propTypes = {
    country: PropTypes.string.isRequired,
};
