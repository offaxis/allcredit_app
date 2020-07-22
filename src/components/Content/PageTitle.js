import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Text as TextNative } from 'react-native';
import { H1, Text } from 'native-base';

import config from '../../config';
import styles from '../../styles';

import logo from '../../assets/images/all-credit-logo-tampon.png';
import logoHome from '../../assets/images/all-credit-logo-home.png';

export default function PageTitle(props) {
    return (
        <View
            style={{
                alignItems: 'center',
            }}
        >
            <ImageBackground
                style={{
                    justifyContent: 'center',
                    width: '75%',
                    height: 180,
                    marginTop: 10,
                    paddingTop: 2,
                    overflow: 'visible',
                }}
                imageStyle={{
                    height: '100%',
                    width: '100%',
                }}
                source={props.children ? logo : logoHome}
            >

                <H1
                    style={[styles.center, styles.specialFont, { fontWeight: 'normal', fontSize: 22, padding: 3 }]}
                >
                    {
                        props.children
                    }
                </H1>

            </ImageBackground>
        </View>
    );
}

PageTitle.defaultProps = {
    children: null,
};

PageTitle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};
