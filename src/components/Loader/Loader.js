import React from 'react';
import FontAwesome from 'react-fontawesome';

import config from '../../config';
import styles from './Loader.css';

export default function Loader() {
    return (
        <div className={`${styles.wrapper} loader-wrapper`} style={{ minHeight: '300px', textAlign: 'center', padding: '50px' }}>
            <img src={`${config.staticUrl}images/app/logo-alt.png`} alt={config.application.name} /><br />
            <FontAwesome name="spinner" spin size="lg" className="text-primary" />
        </div>
    );
}
